
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLowDataMode } from '../../hooks/useLowDataMode';
import { Platform } from 'react-native';

// --- OFFLINE STORE ADAPTER (LocalStorage for Web / Mock for Native in this shared file) ---
// In a full monorepo, we would inject the storage provider based on target.
const offlineStore = {
  async push(record: any) {
    if (Platform.OS === 'web') {
       const q = JSON.parse(localStorage.getItem('sovereign_queue') || '[]');
       q.push(record);
       localStorage.setItem('sovereign_queue', JSON.stringify(q));
    } else {
       console.log('[Native] Queued offline record (Mock)', record);
    }
  },
  
  async popAll() {
    if (Platform.OS === 'web') {
       const q = JSON.parse(localStorage.getItem('sovereign_queue') || '[]');
       localStorage.setItem('sovereign_queue', '[]');
       return q;
    }
    return [];
  }
};

export const useAttendance = (schoolId: string) => {
  const queryClient = useQueryClient();
  const { isLowData } = useLowDataMode();

  const mutation = useMutation({
    mutationFn: async (vars: { studentId: string; status: 'PRESENT' | 'ABSENT'; date: string }) => {
      try {
        // 1. Check connectivity
        if (isLowData || (Platform.OS === 'web' && !navigator.onLine)) {
           throw new Error("FORCE_OFFLINE");
        }

        // 2. Attempt Real API Call
        const response = await fetch('https://api.sovereign.school/api/attendance', { 
            method: 'POST', 
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Platform.OS === 'web' ? localStorage.getItem('token') : 'native-secure-token'}` 
            },
            body: JSON.stringify({ ...vars }) 
        });

        if (!response.ok) throw new Error("API_ERROR");
        return await response.json();

      } catch (error) {
        // 3. Fallback to Offline Store
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
    
    // Batch Upload
    await fetch('https://api.sovereign.school/api/attendance/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Platform.OS === 'web' ? localStorage.getItem('token') : 'native-secure-token'}` 
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
