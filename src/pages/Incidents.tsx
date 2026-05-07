import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, AlertTriangle, RotateCcw, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';

const ReplayTraceNode = ({ label, active, error }: { label: string, active: boolean, error?: boolean }) => (
  <motion.div 
    animate={{ 
      borderColor: active ? (error ? '#ef4444' : '#10b981') : '#27272a',
      backgroundColor: active ? (error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)') : 'transparent',
      scale: active ? 1.05 : 1
    }}
    className={`px-4 py-2 border-2 rounded text-xs font-mono font-bold transition-colors ${active ? (error ? 'text-red-400' : 'text-emerald-400') : 'text-zinc-600'}`}
  >
    {label}
  </motion.div>
);

const ReplayTraceEdge = ({ active, error, animated = false }: { active: boolean, error?: boolean, animated?: boolean }) => (
  <div className="flex-1 h-0.5 mx-2 relative bg-zinc-800 overflow-hidden">
    <motion.div 
      initial={{ left: '-100%' }}
      animate={{ 
        left: active ? (animated ? ['-100%', '100%'] : '0%') : '-100%',
        width: active ? (animated ? '50%' : '100%') : '0%'
      }}
      transition={{ 
        duration: animated ? 1 : 0.4, 
        repeat: animated ? Infinity : 0,
        ease: animated ? "linear" : "easeOut"
      }}
      className={`absolute top-0 h-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`}
    />
  </div>
);

const TraceReconstruction = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center justify-between w-full mb-6 p-6 bg-black/40 border border-zinc-800 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-50" />
      <div className="flex items-center w-full max-w-2xl mx-auto">
        <ReplayTraceNode label="api-gateway" active={step > 0} error={step >= 4} />
        <ReplayTraceEdge active={step > 0} error={step >= 4} animated={step > 0 && step < 4} />
        
        <ReplayTraceNode label="auth-service" active={step > 1} error={step >= 3} />
        <ReplayTraceEdge active={step > 1} error={step >= 3} animated={step === 2} />
        
        <ReplayTraceNode label="user-db" active={step > 1} error={step >= 3} />
      </div>
    </div>
  )
}

export function Incidents() {
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [logData, setLogData] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [replayState, setReplayState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [visibleLogs, setVisibleLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/incidents').then(r => r.json()).then(setRecentIncidents);
    fetch('/api/logs').then(r => r.json()).then(setLogData);
  }, []);

  // Replay effect
  useEffect(() => {
    if (replayState !== 'playing') return;
    
    let timer: any;
    let currentIndex = 0;
    
    setVisibleLogs([]);

    const playNext = () => {
      if (currentIndex < logData.length) {
        // Find logs for this index
        setVisibleLogs(prev => [...prev, logData[currentIndex]]);
        currentIndex++;
        timer = setTimeout(playNext, 800); // 800ms between logs
      } else {
        setReplayState('finished');
      }
    };

    timer = setTimeout(playNext, 500);
    return () => clearTimeout(timer);
  }, [replayState]);

  const startReplay = (incident: any) => {
    setSelectedIncident(incident);
    setReplayState('playing');
  };

  return (
    <div className="h-full flex px-6 py-6 bg-transparent overflow-hidden">
      {/* Incidents List */}
      <div className="w-1/3 pr-6 flex flex-col h-full border-r border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Incidents</h2>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {recentIncidents.map((incident: any) => (
              <Card 
                key={incident.id} 
                className={`bg-zinc-900 border-zinc-800 cursor-pointer transition-all hover:border-zinc-700 rounded-xl ${selectedIncident?.id === incident.id ? 'ring-1 ring-emerald-500 border-emerald-500/50' : ''}`}
                onClick={() => setSelectedIncident(incident)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-zinc-100 text-sm">{incident.title}</CardTitle>
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0 border-transparent ${
                      incident.severity === 'critical' ? 'text-red-500 bg-red-500/10' :
                      incident.severity === 'high' ? 'text-amber-500 bg-amber-500/10' :
                      'text-yellow-500 bg-yellow-500/10'
                    }`}>
                      {incident.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
                    <span className="font-mono">{incident.id}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(incident.timestamp).toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Incident Replay View */}
      <div className="flex-1 pl-6 flex flex-col h-full overflow-hidden">
        {selectedIncident ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-zinc-100">{selectedIncident.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">Incident Replay & Reconstruction</p>
              </div>
              <div className="flex gap-3">
                {replayState === 'idle' || replayState === 'finished' ? (
                  <button 
                    onClick={() => startReplay(selectedIncident)}
                    className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-md font-medium text-xs uppercase tracking-widest hover:bg-zinc-700 transition-colors"
                  >
                    {replayState === 'finished' ? <RotateCcw className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    {replayState === 'finished' ? 'Replay Event' : 'Start Replay'}
                  </button>
                ) : (
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 bg-emerald-500/10 animate-pulse px-3 py-1 text-[10px] uppercase tracking-widest font-mono">
                    <PlayCircle className="w-4 h-4 mr-2" /> Reconstructing...
                  </Badge>
                )}
              </div>
            </div>

            <Card className="flex-1 bg-black/50 border border-zinc-800 flex flex-col overflow-hidden rounded-xl">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex gap-4 text-[10px] font-bold tracking-widest uppercase text-zinc-500 shrink-0">
                <span className="w-24">TIMESTAMP</span>
                <span className="w-24">LEVEL</span>
                <span className="w-32">SERVICE</span>
                <span>MESSAGE</span>
              </div>
              <ScrollArea className="flex-1 p-4">
                {replayState === 'idle' && (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-500 mt-20">
                    <PlayCircle className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-xs uppercase tracking-wider">Click Start Replay</p>
                  </div>
                )}
                
                {(replayState === 'playing' || replayState === 'finished') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TraceReconstruction step={visibleLogs.length} />
                  </motion.div>
                )}

                <div className="space-y-1">
                  {visibleLogs.map((log, i) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-4 text-[11px] font-mono p-2 rounded transition-all duration-300 overflow-hidden ${
                        i === visibleLogs.length - 1 ? 'bg-zinc-800/80 border border-zinc-700/50 scale-[1.01]' : 'hover:bg-zinc-800/30 opacity-70'
                      }`}
                    >
                      <span className="w-24 text-zinc-500 shrink-0">{log.timestamp}</span>
                      <span className={`w-24 shrink-0 ${
                        log.level === 'ERROR' ? 'text-red-400' :
                        log.level === 'WARN' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>{log.level}</span>
                      <span className="w-32 text-zinc-400 shrink-0">{log.service}</span>
                      <span className="text-zinc-300 truncate">{log.message}</span>
                    </motion.div>
                  ))}
                </div>

                {replayState === 'finished' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 p-4 bg-red-950/20 border border-red-900/30 rounded-lg flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-400 mb-1 text-xs uppercase tracking-widest">Root Cause Identified</h4>
                        <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                          The sequence indicates a thread pool exhaustion in <code className="bg-black border border-zinc-800 px-1 py-0.5 text-zinc-400 rounded">auth-service</code> propagating back to the API Gateway as a timeout.
                        </p>
                        
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-4">Evolution of Failure</div>
                        <div className="relative border-l border-zinc-800 pl-4 ml-2 space-y-4 font-mono text-[10px]">
                            <div className="relative">
                                <div className="absolute w-2 h-2 rounded-full bg-zinc-600 -left-[21px] top-1"></div>
                                <span className="text-zinc-500">T-0:</span> <span className="text-zinc-400">Normal operations. Latency 45ms.</span>
                            </div>
                            <div className="relative">
                                <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[21px] top-1"></div>
                                <span className="text-amber-500">T+1:</span> <span className="text-zinc-400">Auth DB connection retry rate increases by 400%.</span>
                            </div>
                            <div className="relative">
                                <div className="absolute w-2 h-2 rounded-full bg-red-500 -left-[21px] top-1 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                <span className="text-red-500">T+2:</span> <span className="text-zinc-300">Cascading failure: Gateway registers 504 Timeouts.</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </ScrollArea>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <AlertTriangle className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm">Select an incident to view details and replay the timeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
