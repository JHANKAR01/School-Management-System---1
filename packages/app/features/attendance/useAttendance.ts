import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLowDataMode } from '../../hooks/useLowDataMode';

// --- OFFLINE STORE ADAPTER (Conceptual Drizzle/SQLite Interface) ---
// In production, this file imports 'expo-sqlite' and a Drizzle Schema
const offlineStore = {
  queue: [] as any[],
  
  async push(record: any) {
    // INSERT INTO attendance_queue VALUES ...
    console.log('[SQLite] Saving offline record:', record);
    this.queue.push(record);
    localStorage.setItem('sovereign_queue', JSON.stringify(this.queue));
  },
  
  async popAll() {
    // SELECT * FROM attendance_queue
    const q = JSON.parse(localStorage.getItem('sovereign_queue') || '[]');
    this.queue = [];
    localStorage.setItem('sovereign_queue', '[]');
    return q;
  }
};

export const useAttendance = (schoolId: string) => {
  const queryClient = useQueryClient();
  const { isLowData } = useLowDataMode();

  const mutation = useMutation({
    mutationFn: async (vars: { studentId: string; status: 'PRESENT' | 'ABSENT'; date: string }) => {
      try {
        // 1. Check connectivity or user preference
        if (isLowData || !navigator.onLine) {
           throw new Error("FORCE_OFFLINE");
        }

        // 2. Attempt Real API Call
        // Note: The API validates token & checks RLS
        const response = await fetch('/api/attendance', { 
            method: 'POST', 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({ ...vars }) 
        });

        if (!response.ok) throw new Error("API_ERROR");
        return await response.json();

      } catch (error) {
        // 3. Fallback to SQLite
        await offlineStore.push({ ...vars, schoolId, timestamp: Date.now() });
        return { success: true, offline: true };
      }
    },
    onMutate: async (newAttendance) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['attendance', schoolId] });
      const previous = queryClient.getQueryData(['attendance', schoolId]);

      queryClient.setQueryData(['attendance', schoolId], (old: any[] | undefined) => {
        if (!old) return [];
        return old.map(r => r.id === newAttendance.studentId 
          ? { ...r, status: newAttendance.status, synced: false } 
          : r
        );
      });

      return { previous };
    }
  });

  const syncOfflineQueue = async () => {
    const records = await offlineStore.popAll();
    if (records.length === 0) return;

    console.log(`[Sync] Uploading ${records.length} records to Cloud...`);
    
    // Batch Upload to Hono Endpoint
    await fetch('/api/attendance/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ records })
    });
    
    await queryClient.invalidateQueries({ queryKey: ['attendance', schoolId] });
  };

  return { 
    markAttendance: mutation.mutate, 
    isOffline: mutation.data?.offline, 
    syncOfflineQueue 
  };
};
