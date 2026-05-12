import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wsStatus, setWsStatus] = useState('disconnected'); // connected | disconnected | error
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // ── WebSocket ──────────────────────────────────────────────
  const connectWS = useCallback(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}://${host}/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('connected');

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'TASK_CREATED':
            setTasks((prev) => [msg.task, ...prev]);
            break;
          case 'TASK_UPDATED':
            setTasks((prev) => prev.map((t) => t.id === msg.task.id ? msg.task : t));
            break;
          case 'TASK_DELETED':
            setTasks((prev) => prev.filter((t) => t.id !== msg.taskId));
            break;
          default:
            break;
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      // Auto-reconnect after 3s
      reconnectTimer.current = setTimeout(connectWS, 3000);
    };

    ws.onerror = () => {
      setWsStatus('error');
      ws.close();
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      connectWS();
    }
    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [user, connectWS]);

  // ── API helpers ────────────────────────────────────────────
  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', { params: filters });
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats/summary');
      setStats(data.stats);
    } catch {
      // non-critical
    }
  }, []);

  const createTask = useCallback(async (payload) => {
    const { data } = await api.post('/tasks', payload);
    // WS will update state; but also update locally for instant feedback
    setTasks((prev) => [data.task, ...prev]);
    return data.task;
  }, []);

  const updateTask = useCallback(async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload);
    setTasks((prev) => prev.map((t) => t.id === id ? data.task : t));
    return data.task;
  }, []);

  const updateTaskStatus = useCallback(async (id, status) => {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    setTasks((prev) => prev.map((t) => t.id === id ? data.task : t));
    return data.task;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
      setStats(null);
    }
  }, [user, fetchTasks, fetchStats]);

  return (
    <TaskContext.Provider value={{
      tasks, stats, loading, wsStatus,
      fetchTasks, fetchStats,
      createTask, updateTask, updateTaskStatus, deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
