import { AuditLog, UserRole } from '../../../../types';

/**
 * Sovereign Audit Logger
 * Records "High Stakes" actions to an append-only log.
 */
export class AuditLogger {
  
  static async log(
    action: AuditLog['action'], 
    actorId: string, 
    details: string,
    targetId?: string
  ) {
    // In a real app, capture actual IP via headers.
    // Here we simulate an IP hash for privacy/tracking.
    const ipHash = "a1b2c3d4"; 

    const logEntry: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      actorId,
      targetId,
      details,
      ipHash
    };

    // 1. Console Output for Dev/Debug
    console.log(`[AUDIT] [${logEntry.action}] User:${actorId} -> ${details}`);

    // 2. Persist to Secure Storage
    // In production, this would write to a separate, locked-down database table or SIEM.
    // For MVP, we simulate a secure write.
    // await prisma.auditLog.create({ data: logEntry });
    
    return logEntry;
  }

  // Rate Limiting Logic (Middleware helper)
  // Simple in-memory counter for demo purposes
  private static rateLimitMap = new Map<string, { count: number, expiry: number }>();

  static checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.expiry) {
      this.rateLimitMap.set(key, { count: 1, expiry: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      console.warn(`[SECURITY] Rate Limit Exceeded for ${key}`);
      return false;
    }

    record.count++;
    return true;
  }
}
