/**
 * SOVEREIGN BIOMETRIC BRIDGE
 * Run this on the Windows PC connected to the Attendance Machine (Essl/Matrix).
 * 
 * Usage: API_KEY=... SCHOOL_ID=... node biometric-agent.ts
 */

import axios from 'axios';
// import net from 'net'; // Used for raw TCP connections to devices

const CONFIG = {
  SCHOOL_ID: process.env.SCHOOL_ID,
  API_KEY: process.env.API_KEY,
  CLOUD_URL: 'https://api.sovereign.school/api/attendance/bulk',
  DEVICE_IP: '192.168.1.201',
  DEVICE_PORT: 4370 // Standard ZKTEco Port
};

async function fetchLogsFromDevice() {
  console.log(`[BioAgent] Connecting to device at ${CONFIG.DEVICE_IP}...`);
  
  // MOCK: In production, use 'zkteco-js' or 'node-zklib' to fetch buffer
  const mockLogs = [
    { userId: '101', timestamp: new Date().toISOString() },
    { userId: '102', timestamp: new Date().toISOString() }
  ];

  return mockLogs;
}

async function syncToCloud(logs: any[]) {
  try {
    const payload = logs.map(log => ({
      studentId: log.userId, // Mapping Logic needed here
      date: log.timestamp,
      status: 'PRESENT'
    }));

    await axios.post(CONFIG.CLOUD_URL, {
      schoolId: CONFIG.SCHOOL_ID,
      records: payload
    }, {
      headers: { 'Authorization': `Bearer ${CONFIG.API_KEY}` }
    });

    console.log(`[BioAgent] Successfully synced ${logs.length} records.`);
  } catch (error) {
    console.error("[BioAgent] Sync Failed:", error.message);
  }
}

// Run Loop
const run = async () => {
  if (!CONFIG.SCHOOL_ID || !CONFIG.API_KEY) {
    console.error("Missing Config");
    (process as any).exit(1);
  }

  console.log("Starting Sovereign Biometric Bridge...");
  
  setInterval(async () => {
    const logs = await fetchLogsFromDevice();
    if (logs.length > 0) {
      await syncToCloud(logs);
    }
  }, 60000); // Run every minute
};

run();