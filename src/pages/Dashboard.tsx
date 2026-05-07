import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Server, AlertTriangle, CheckCircle2 } from "lucide-react";

export function Dashboard() {
  const [metricsData, setMetricsData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => setMetricsData(data))
      .catch(err => console.error("Error fetching metrics:", err));
  }, []);
  return (
    <div className="h-full overflow-auto p-6 bg-transparent">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Observability Overview</h1>
            <p className="text-zinc-400 mt-1">Real-time telemetry and system health across all microservices.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              SYSTEM HEALTHY
            </Badge>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="CPU Usage" 
            value="65%" 
            change="+12%" 
            trend="up" 
            progress="65%"
            progressColor="bg-amber-500"
            valueColor="text-amber-400"
            icon={<Server className="w-4 h-4 text-zinc-400" />} 
          />
          <MetricCard 
            title="Memory Usage" 
            value="70%" 
            change="+5%" 
            trend="up" 
            progress="70%"
            progressColor="bg-amber-500"
            valueColor="text-amber-400"
            icon={<Server className="w-4 h-4 text-zinc-400" />} 
          />
          <MetricCard 
            title="Avg Latency" 
            value="150ms" 
            change="-20ms" 
            trend="down" 
            progress="40%"
            progressColor="bg-emerald-500"
            valueColor="text-emerald-400"
            icon={<Activity className="w-4 h-4 text-zinc-400" />} 
          />
          <MetricCard 
            title="Error Rate" 
            value="1.2%" 
            change="+0.5%" 
            trend="up" 
            progress="12%"
            progressColor="bg-red-500"
            valueColor="text-red-400"
            icon={<AlertTriangle className="w-4 h-4 text-zinc-400" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-zinc-100">System Performance</CardTitle>
              <CardDescription className="text-zinc-400">Latency vs Error Rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#e4e4e7' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2} dot={false} name="Latency (ms)" />
                    <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={false} name="Errors" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Service Status</CardTitle>
              <CardDescription className="text-zinc-400">Active microservices health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ServiceRow name="api-gateway" status="healthy" latency="45ms" />
                <ServiceRow name="auth-service" status="warning" latency="1200ms" />
                <ServiceRow name="user-db" status="healthy" latency="15ms" />
                <ServiceRow name="payment-service" status="healthy" latency="60ms" />
                <ServiceRow name="notification-worker" status="error" latency="Timeout" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon, trendColor = "text-emerald-500", progress, progressColor = "bg-emerald-500", valueColor = "text-zinc-100" }: any) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className={`text-2xl font-mono ${valueColor}`}>{value}</div>
        {progress ? (
          <div className="mt-2 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`${progressColor} h-full`} style={{ width: progress }}></div>
          </div>
        ) : (
          <p className={`text-xs mt-1 ${trendColor}`}>
            {change} from last hour
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ServiceRow({ name, status, latency }: { name: string, status: 'healthy' | 'warning' | 'error', latency: string }) {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-red-500';
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 text-xs text-zinc-300 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors rounded-sm">
      <span className="font-mono">{name}</span>
      <span className={`font-mono ${getStatusColor()}`}>{latency}</span>
    </div>
  );
}
