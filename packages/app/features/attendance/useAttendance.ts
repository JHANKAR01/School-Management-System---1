import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AttendanceRecord } from '../../../../../types'; // Adjust relative import based on monorepo structure

// MOCK: Local SQLite Database Adapter
// In React Native, this would use `expo-sqlite`
const localDB = {
  queue: [] as any[],
  save: (record: any) => {
    // Simulate SQLite INSERT
    const queue = JSON.parse(localStorage.getItem('offline_attendance_queue') || '[]');
    queue.push(record);
    localStorage.setItem('offline_attendance_queue', JSON.stringify(queue));
  },
  getQueue: () => {
    return JSON.parse(localStorage.getItem('offline_attendance_queue') || '[]');
  },
  clearQueue: () => {
    localStorage.removeItem('offline_attendance_queue');
  }
};

// MOCK: API Service
const api = {
  submitAttendance: async (data: { studentId: string; status: string; date: string }) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate random network failure for offline demo
    if (Math.random() > 0.7) {
      throw new Error("Network Error");
    }
    return { success: true };
  }
};

export const useAttendance = (schoolId: string) => {
  const queryClient = useQueryClient();

  // Optimistic Mutation
  const mutation = useMutation({
    mutationFn: async (vars: { studentId: string; status: 'PRESENT' | 'ABSENT'; date: string }) => {
      try {
        // Try online first
        return await api.submitAttendance(vars);
      } catch (error) {
        // Fallback to Offline Queue (SQLite)
        console.warn("Network failed, queuing locally...", error);
        localDB.save({ ...vars, schoolId, timestamp: Date.now() });
        return { success: true, offline: true };
      }
    },
    onMutate: async (newAttendance) => {
      // Cancel outgoing refetches to avoid overwrite
      await queryClient.cancelQueries({ queryKey: ['attendance', schoolId] });

      // Snapshot previous value
      const previousAttendance = queryClient.getQueryData(['attendance', schoolId]);

      // Optimistically update cache to show "Green/Success" instantly
      queryClient.setQueryData(['attendance', schoolId], (old: AttendanceRecord[] | undefined) => {
        if (!old) return [];
        return old.map(record => 
          record.student_id === newAttendance.studentId 
            ? { ...record, status: newAttendance.status, synced: false }
            : record
        );
      });

      return { previousAttendance };
    },
    onError: (err, newTodo, context) => {
      // If catastrophic failure (not just offline), rollback
      // For offline-first, we usually don't rollback on network error, only logic error
      if (context?.previousAttendance) {
        // queryClient.setQueryData(['attendance', schoolId], context.previousAttendance);
      }
    },
    onSettled: () => {
      // queryClient.invalidateQueries(['attendance', schoolId]);
    },
  });

  const syncOfflineQueue = async () => {
    const queue = localDB.getQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline records...`);
    // Process queue...
    localDB.clearQueue();
    await queryClient.invalidateQueries({ queryKey: ['attendance', schoolId] });
  };

  return {
    markAttendance: mutation.mutate,
    isLoading: mutation.isPending,
    isOffline: mutation.data?.offline,
    syncOfflineQueue
  };
};
