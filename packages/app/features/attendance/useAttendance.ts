import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLowDataMode } from '../../hooks/useLowDataMode';
// NOTE: In a real Expo Native app, you would import 'expo-sqlite'
// import * as SQLite from 'expo-sqlite';

// --- MOCK SQLITE ADAPTER FOR WEB PREVIEW ---
const mockSqlite = {
  execSync: (sql: string) => console.log('[SQLite Init]', sql),
  runSync: (sql: string, params?: any[]) => {
    if (sql.includes('INSERT')) {
      const queue = JSON.parse(localStorage.getItem('sovereign_offline_db') || '[]');
      queue.push(params);
      localStorage.setItem('sovereign_offline_db', JSON.stringify(queue));
    }
    if (sql.includes('DELETE')) {
      localStorage.removeItem('sovereign_offline_db');
    }
  },
  getAllSync: (sql: string) => {
    const queue = JSON.parse(localStorage.getItem('sovereign_offline_db') || '[]');
    return queue.map((row: any[]) => ({
      studentId: row[0],
      status: row[1],
      date: row[2],
      schoolId: row[3],
      timestamp: row[4]
    }));
  }
};

const db = mockSqlite; 

const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS offline_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId TEXT,
      status TEXT,
      date TEXT,
      schoolId TEXT,
      timestamp INTEGER
    );
  `);
};

initDB();

const localDB = {
  save: (record: any) => {
    db.runSync(
      'INSERT INTO offline_attendance (studentId, status, date, schoolId, timestamp) VALUES (?, ?, ?, ?, ?)',
      [record.studentId, record.status, record.date, record.schoolId, Date.now()]
    );
  },
  getQueue: () => {
    return db.getAllSync('SELECT * FROM offline_attendance');
  },
  clearQueue: () => {
    db.runSync('DELETE FROM offline_attendance');
  }
};

export const useAttendance = (schoolId: string) => {
  const queryClient = useQueryClient();
  const { isLowData } = useLowDataMode();

  const mutation = useMutation({
    mutationFn: async (vars: { studentId: string; status: 'PRESENT' | 'ABSENT'; date: string }) => {
      try {
        // In Low Data Mode, we aggressively prefer offline queueing to save bandwidth overhead per request
        // We only sync when the user explicitly hits "Force Sync" or batch triggers
        if (isLowData) {
            console.log("[Sovereign Low Data] Queuing attendance locally to batch later.");
            throw new Error("Low Data Mode: Force Offline");
        }

        if (Math.random() > 0.5) throw new Error("Simulated Offline Mode");

        const response = await fetch('/api/attendance', { 
            method: 'POST', 
            body: JSON.stringify({ ...vars, schoolId }) 
        });
        if (!response.ok) throw new Error("Offline");
        return await response.json();
      } catch (error) {
        localDB.save({ ...vars, schoolId });
        return { success: true, offline: true };
      }
    },
    onMutate: async (newAttendance) => {
      await queryClient.cancelQueries({ queryKey: ['attendance', schoolId] });
      const previousAttendance = queryClient.getQueryData(['attendance', schoolId]);

      // Optimistic UI Update
      queryClient.setQueryData(['attendance', schoolId], (old: any[] | undefined) => {
        if (!old) return [];
        return old.map(record => 
          record.id === newAttendance.studentId 
            ? { ...record, status: newAttendance.status, synced: false }
            : record
        );
      });

      return { previousAttendance };
    }
  });

  const syncOfflineQueue = async () => {
    const queue = localDB.getQueue();
    if (queue.length === 0) return;
    
    if (isLowData) {
        console.log(`[Sovereign Batch Sync] Compressing ${queue.length} records into single payload...`);
        // In prod: await fetch('/api/attendance/batch', { body: JSON.stringify({ records: queue }) })
    } else {
        console.log(`[Sovereign Sync] Pushing ${queue.length} records individually.`);
    }

    localDB.clearQueue();
    await queryClient.invalidateQueries({ queryKey: ['attendance', schoolId] });
  };

  return { markAttendance: mutation.mutate, isOffline: mutation.data?.offline, syncOfflineQueue };
};
