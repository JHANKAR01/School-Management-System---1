
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLowDataMode } from '../../hooks/useLowDataMode';
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Haptics from 'expo-haptics';

// --- OFFLINE STORE ADAPTER (SQLite / LocalStorage) ---

let db: any = null;
if (Platform.OS !== 'web') {
  // Initialize SQLite on Native
  try {
      db = SQLite.openDatabaseSync('sovereign.db');
      db.execSync('CREATE TABLE IF NOT EXISTS attendance_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT, timestamp INTEGER);');
  } catch(e) { console.error("SQLite Init Failed", e); }
}

const offlineStore = {
  async push(record: any) {
    if (Platform.OS !== 'web' && db) {
       console.log('[SQLite] Saving offline record:', record);
       await db.runAsync('INSERT INTO attendance_queue (payload, timestamp) VALUES (?, ?)', JSON.stringify(record), Date.now());
    } else if (Platform.OS === 'web') {
       // Web Fallback
       const q = JSON.parse(localStorage.getItem('sovereign_queue') || '[]');
       q.push(record);
       localStorage.setItem('sovereign_queue', JSON.stringify(q));
    }
  },
  
  async popAll() {
    if (Platform.OS !== 'web' && db) {
       const rows = await db.getAllAsync('SELECT * FROM attendance_queue');
       if (rows.length > 0) {
         await db.runAsync('DELETE FROM attendance_queue');
       }
       return rows.map((r: any) => JSON.parse(r.payload));
    } else if (Platform.OS === 'web') {
       // Web Fallback
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
        // 1. Check connectivity or user preference
        // On Native, we might use NetInfo, but here we stick to navigator.onLine for web
        // For Native, we assume online unless specified otherwise, or let the fetch fail
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
        // 3. Fallback to SQLite/LocalStorage
        await offlineStore.push({ ...vars, schoolId, timestamp: Date.now() });
        return { success: true, offline: true };
      }
    },
    onMutate: async (newAttendance) => {
      // 0. Native Haptics
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

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
