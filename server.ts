import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { metricsData, traceNodesData, traceEdgesData, recentIncidents, logData } from './src/data/mockData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/metrics', (req, res) => {
    res.json(metricsData);
  });

  app.get('/api/traces', (req, res) => {
    res.json({ nodes: traceNodesData, edges: traceEdgesData });
  });

  app.get('/api/incidents', (req, res) => {
    res.json(recentIncidents);
  });

  app.get('/api/logs', (req, res) => {
    res.json(logData);
  });

  // Tool Calling API Routes
  app.post('/api/tools/get_logs', (req, res) => {
    res.json({ result: "Retrieved 45 log entries. Identified 12 ERROR level logs spanning auth-service and database." });
  });

  app.post('/api/tools/analyze_trace', (req, res) => {
    res.json({ result: "Analyzed trace 7b89f2a1. Bottleneck identified: auth-service span took 1200ms calling user-db." });
  });

  app.post('/api/tools/fetch_metrics', (req, res) => {
    res.json({ result: "CPU and memory are nominal. Latency p99 has increased by 800% in the last 5 minutes." });
  });
  
  app.post('/api/tools/detect_anomaly', (req, res) => {
    res.json({ result: "Anomaly detected in connection pool utilization. Pool exhaustion rate is critical." });
  });

  app.post('/api/analyze', (req, res) => {
    const { query } = req.body;
    
    // Mock AI Analysis Delay
    setTimeout(() => {
      res.json({
        rootCause: "Connection pool exhaustion in auth-service",
        confidence: 0.95,
        analysis: "Traces show auth-service latency spiked to 1200ms before returning 503. Logs confirm repeated 'Timeout waiting for connection from pool' errors in auth_db.",
        fix: "Increase MAX_POOL_SIZE in auth-service configuration."
      });
    }, 2000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
