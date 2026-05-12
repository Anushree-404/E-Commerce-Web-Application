const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

// ─── WebSocket Server ────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ server, path: '/ws' });

// Map userId -> Set of WebSocket clients
const userSockets = new Map();

wss.on('connection', (ws, req) => {
  // Authenticate via token in query string: /ws?token=<jwt>
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');

  if (!token) {
    ws.close(4001, 'Token required');
    return;
  }

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch {
    ws.close(4003, 'Invalid token');
    return;
  }

  // Register socket for this user
  if (!userSockets.has(user.id)) {
    userSockets.set(user.id, new Set());
  }
  userSockets.get(user.id).add(ws);

  ws.send(JSON.stringify({ type: 'CONNECTED', message: `Welcome, ${user.username}!` }));

  // Heartbeat
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('close', () => {
    const sockets = userSockets.get(user.id);
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) userSockets.delete(user.id);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});

// Heartbeat interval to detect dead connections
const heartbeat = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => clearInterval(heartbeat));

// Broadcast helper — sends to all sockets of a specific user
function broadcast(userId, data) {
  const sockets = userSockets.get(userId);
  if (!sockets) return;
  const message = JSON.stringify(data);
  sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

app.locals.broadcast = broadcast;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket available at ws://localhost:${PORT}/ws`);
});
