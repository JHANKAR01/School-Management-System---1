
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Singleton Pattern)
// In a real deployment, these env vars are injected by the cloud provider (e.g. Vercel/AWS)
if (!admin.apps.length) {
  try {
    // Only attempt init if credentials exist to prevent crash in dev mode
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log("[FCM] Firebase Admin Initialized");
    } else {
      console.warn("[FCM] Missing Credentials. Running in Simulation Mode.");
    }
  } catch (error) {
    console.error('[FCM] Initialization Failed:', error);
  }
}

interface NotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class NotificationService {
  
  static async sendPush(payload: NotificationPayload) {
    // 1. Simulation Mode (Dev)
    if (!admin.apps.length) {
      console.log(`[FCM-SIM] To: ${payload.token.slice(0, 10)}... | ${payload.title}`);
      return { success: true, simulated: true };
    }

    // 2. Real FCM Send
    try {
      const response = await admin.messaging().send({
        token: payload.token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      });
      return { success: true, messageId: response };
    } catch (error) {
      console.error('[FCM] Send Error:', error);
      // Don't crash the main thread if push fails
      return { success: false, error };
    }
  }

  static async sendFeeReminder(studentName: string, amount: number, parentToken: string) {
    return this.sendPush({
      token: parentToken,
      title: "Fee Payment Reminder",
      body: `Dear Parent, fee of ₹${amount} for ${studentName} is due. Pay via UPI to avoid late fines.`,
      data: { type: 'FEE_REMINDER', amount: amount.toString() }
    });
  }

  static async sendAttendanceAlert(studentName: string, parentToken: string) {
    return this.sendPush({
      token: parentToken,
      title: "Absent Alert",
      body: `${studentName} has been marked ABSENT today.`,
      data: { type: 'ATTENDANCE_ABSENT' }
    });
  }
}
