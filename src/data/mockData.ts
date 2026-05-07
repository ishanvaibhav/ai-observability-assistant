export const metricsData = [
  { time: '10:00', cpu: 45, memory: 60, latency: 120, errors: 2 },
  { time: '10:05', cpu: 52, memory: 62, latency: 130, errors: 1 },
  { time: '10:10', cpu: 48, memory: 65, latency: 125, errors: 3 },
  { time: '10:15', cpu: 75, memory: 75, latency: 250, errors: 15 },
  { time: '10:20', cpu: 85, memory: 82, latency: 400, errors: 45 },
  { time: '10:25', cpu: 92, memory: 88, latency: 800, errors: 120 },
  { time: '10:30', cpu: 65, memory: 70, latency: 150, errors: 10 },
];

export const traceNodesData = [
  {
    id: 'api-gateway',
    position: { x: 250, y: 50 },
    data: { label: 'API Gateway', status: 'warning', latency: '24ms (Own)' },
    type: 'custom',
  },
  {
    id: 'auth-service',
    position: { x: 250, y: 200 },
    data: { label: 'Auth Service', status: 'error', latency: '400ms (Own)' },
    type: 'custom',
  },
  {
    id: 'user-db',
    position: { x: 250, y: 350 },
    data: { label: 'User Database', status: 'normal', latency: '800ms' },
    type: 'custom',
  },
];

export const traceEdgesData = [
  { 
    id: 'e1', source: 'api-gateway', target: 'auth-service', 
    label: '↓ 45ms avg', 
    animated: true, 
    style: { stroke: '#ef4444', strokeWidth: 2 },
    labelStyle: { fill: '#ef4444', fontWeight: 700 },
    labelBgStyle: { fill: '#1a1a1e', fillOpacity: 0.9 },
    markerEnd: { type: 'arrowclosed', color: '#ef4444' }
  },
  { 
    id: 'e2', source: 'auth-service', target: 'user-db', 
    label: '↓ 1200ms spike', 
    animated: true, 
    style: { stroke: '#ef4444', strokeWidth: 2 },
    labelStyle: { fill: '#ef4444', fontWeight: 700 },
    labelBgStyle: { fill: '#1a1a1e', fillOpacity: 0.9 },
    markerEnd: { type: 'arrowclosed', color: '#ef4444' }
  },
];

export const recentIncidents = [
  { id: 'INC-1042', title: 'Auth Service Latency Spike', service: 'auth-service', timestamp: '2026-05-07T10:25:00Z', status: 'active', severity: 'critical' },
  { id: 'INC-1041', title: 'Payment Gateway Timeout', service: 'payment-service', timestamp: '2026-05-06T14:10:00Z', status: 'resolved', severity: 'high' },
  { id: 'INC-1040', title: 'Database Connection Pool Exhaustion', service: 'user-db', timestamp: '2026-05-05T09:30:00Z', status: 'resolved', severity: 'medium' },
];

export const logData = [
  { id: 'l1', timestamp: '10:24:58', level: 'INFO', service: 'api-gateway', message: 'Request accepted POST /api/v1/auth' },
  { id: 'l2', timestamp: '10:25:00', level: 'WARN', service: 'auth-service', message: 'Connection retry 1 to database auth_db' },
  { id: 'l3', timestamp: '10:25:01', level: 'ERROR', service: 'auth-service', message: 'Timeout waiting for connection from pool' },
  { id: 'l4', timestamp: '10:25:01', level: 'ERROR', service: 'api-gateway', message: 'Upstream connection failed /api/v1/auth' },
];
