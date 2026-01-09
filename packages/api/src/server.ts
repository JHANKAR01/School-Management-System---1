import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Server } from 'socket.io';
import { authMiddleware } from './middleware/auth';
import { staffRouter } from './routes/staff';
import { academicsRouter } from './routes/academics';
import { logisticsRouter } from './routes/logistics';
import { financeRouter } from './routes/finance';
import { healthRouter } from './routes/health';
import { admissionsRouter } from './routes/admissions';
import { jitsiRouter } from './routes/jitsi';
import { operationsRouter } from './routes/operations';

const app = new Hono();

// Global Middleware
app.use('*', cors());

// Health Check
app.get('/health', (c) => c.json({ status: 'OK', uptime: (process as any).uptime() }));

// Mount Sub-Routers
app.route('/api/auth', authMiddleware as any); 
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
  
  // Real-time Bus Tracking
  socket.on('bus:location', (data) => {
    io.emit(`bus:update:${data.routeId}`, data);
  });

  // Parent-Teacher Chat
  socket.on('chat:message', (data) => {
    io.to(`room:${data.studentId}`).emit('chat:receive', data);
  });

  socket.on('disconnect', () => console.log(`[Socket] Disconnected: ${socket.id}`));
});

// Start Server (if running directly)
if (process.env.NODE_ENV !== 'test') {
    console.log("🚀 Project Sovereign API Online on port 3000");
}

export default app;