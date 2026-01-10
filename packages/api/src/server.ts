// packages/api/src/server.ts
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Server } from 'socket.io';
import { authMiddleware } from './middleware/auth.ts';
import { authRouter } from './routes/auth.ts'; // Import the new router
import { staffRouter } from './routes/staff.ts';
import { academicsRouter } from './routes/academics.ts';
import { logisticsRouter } from './routes/logistics.ts';
import { financeRouter } from './routes/finance.ts';
import { healthRouter } from './routes/health.ts';
import { admissionsRouter } from './routes/admissions.ts';
import { jitsiRouter } from './routes/jitsi.ts';
import { operationsRouter } from './routes/operations.ts';

const app = new Hono();

// Global Middleware
app.use('*', cors());

// Health Check
app.get('/health', (c) => c.json({ status: 'OK', uptime: (process as any).uptime() }));

// --- MOUNT ROUTERS ---

// 1. PUBLIC ROUTES (No Token Needed)
app.route('/api/auth', authRouter); // FIXED: Mounts the router, not the middleware

// 2. PROTECTED ROUTES (Middleware Guard)
// This ensures any request to /api/staff, /api/finance, etc., requires a token
app.use('/api/staff/*', authMiddleware);
app.use('/api/academics/*', authMiddleware);
app.use('/api/logistics/*', authMiddleware);
app.use('/api/finance/*', authMiddleware);
app.use('/api/health/*', authMiddleware);
app.use('/api/admissions/*', authMiddleware);
app.use('/api/operations/*', authMiddleware);

app.route('/api/staff', staffRouter);
app.route('/api/academics', academicsRouter);
app.route('/api/logistics', logisticsRouter);
app.route('/api/finance', financeRouter);
app.route('/api/health', healthRouter);
app.route('/api/admissions', admissionsRouter);
app.route('/api/jitsi', jitsiRouter);
app.route('/api/operations', operationsRouter);

// --- REAL-TIME LAYER (Socket.io) ---
const httpServer = serve({ fetch: app.fetch, port: 3000 });
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('bus:location', (data) => {
    io.emit(`bus:update:${data.routeId}`, data);
  });

  socket.on('chat:message', (data) => {
    io.to(`room:${data.studentId}`).emit('chat:receive', data);
  });

  socket.on('disconnect', () => console.log(`[Socket] Disconnected: ${socket.id}`));
});

if (process.env.NODE_ENV !== 'test') {
  console.log("🚀 Project Sovereign API Online on port 3000");
}

export default app;