# Ocular AI — AI Observability Assistant

AI-powered observability and debugging platform for modern distributed systems.

Modern distributed systems generate massive telemetry data. Debugging failures across microservices, APIs, and databases is increasingly complex. 

Ocular AI explores how LLMs can assist Site Reliability Engineers (SREs) by summarizing failures, reconstructing incidents, and accelerating root-cause analysis through intelligent telemetry correlation.

## 🚀 Features

- **Trace Visualization:** Explore OpenTelemetry spans and service dependencies.
- **AI Root Cause Analysis:** Summarize complex failures across logs, metrics, and traces.
- **Incident Replay:** Cinematics reconstruction of historical system events.
- **Infrastructure Health:** Real-time dashboards of cluster performance.
- **Distributed Context:** Automatic correlation of errors to their origin trace.

## 🏗️ Architecture

```text
  [ Microservices ]
         │ (OTLP gRPC)
         ▼
[ OpenTelemetry Collector ]
         │
         ├──► [ Traces DB (Jaeger / Tempo via API) ]
         ├──► [ Metrics DB (Prometheus via API) ]
         └──► [ Logs DB (Loki / Elastic via API) ]
         │
         ▼
  [ FastAPI / Express Backend ]
         │
   [ AI Analysis Engine (LLM) ]
         │
         ▼
[ React + Tailwind Dashboard ] -> (Ocular UI)
```

## 🛠️ Tech Stack

### Frontend
- **React + Vite:** High performance SPA
- **Tailwind CSS + shadcn/ui:** Polished, professional UI components
- **Recharts:** High-density metric visualizations
- **React Flow:** Interactive, node-based trace explorer

### Backend & AI Layer (Simulated/Mocked for Demo)
- **Express Backend:** Telemetry API endpoints `/api/traces`, `/api/metrics`
- **LLM Engine:** Log sequence analysis and bottleneck identification
- **Vector Search:** Semantic correlation of error stack traces

## 📸 Core Views

1. **Dashboard:** System health and anomaly detection at a glance.
2. **Trace Explorer:** Waterfall and graph dependencies of requests.
3. **AI Assistant:** Conversational agent connected directly to the telemetry firehose.
4. **Incidents:** Event reconstruction and timeline replay.

## 🔮 Future Roadmap

- Native OpenTelemetry (OTLP) ingestion
- Vector search for log embeddings
- Multi-agent debugging workflows
- Live streaming logs and traces via WebSockets

## 🏃‍♂️ Getting Started

This repository is designed to run out-of-the-box using the provided Node.js execution environment.

```bash
# Install dependencies
npm install

# Start the full-stack server
npm run dev
```
