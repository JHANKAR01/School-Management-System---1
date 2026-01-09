
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import { staffRouter } from './routes/staff';
import { academicsRouter } from './routes/academics';
import { logisticsRouter } from './routes/logistics';
import { financeRouter } from './routes/finance';
import { healthRouter } from './routes/health';
import { admissionsRouter } from './routes/admissions';
import { jitsiRouter } from './routes/jitsi';

const app = new Hono();

// Global Middleware
app.use('*', cors());

// Health Check for IT Admin Dashboard
app.get('/health', (c) => c.json({ status: 'OK', uptime: (process as any).uptime ? (process as any).uptime() : 0 }));

// Mount Sub-Routers
app.route('/api/auth', authMiddleware as any); // Auth is usually handled separately or inside middleware
app.route('/api/staff', staffRouter);
app.route('/api/academics', academicsRouter);
app.route('/api/logistics', logisticsRouter);
app.route('/api/finance', financeRouter);
app.route('/api/health', healthRouter);
app.route('/api/admissions', admissionsRouter);
app.route('/api/jitsi', jitsiRouter);

export default app;