import { Network, Database, Cpu, Server, ShieldAlert, Zap, Globe, LayoutTemplate } from 'lucide-react';

export function Architecture() {
  return (
    <div className="h-full overflow-auto p-6 bg-transparent">
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">System Architecture</h1>
          <p className="text-zinc-400 mt-1">End-to-end telemetry pipeline and AI integration.</p>
        </div>

        <div className="flex flex-col items-center w-full gap-2 text-sm font-mono tracking-widest text-zinc-500">
          
          {/* Applications Layer */}
          <div className="w-full flex justify-center gap-6 mb-4">
            <ArchitectureNode icon={Globe} label="API Gateway" color="border-zinc-700 bg-zinc-800/30 text-zinc-300" />
            <ArchitectureNode icon={Server} label="Auth Service" color="border-zinc-700 bg-zinc-800/30 text-zinc-300" />
            <ArchitectureNode icon={Database} label="User Database" color="border-zinc-700 bg-zinc-800/30 text-zinc-300" />
          </div>

          <FlowArrow label="OTLP (gRPC / HTTP)" />

          {/* Telemetry Collector */}
          <div className="w-[600px]">
            <div className="w-full border-2 border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 flex flex-col items-center shadow-[0_0_30px_rgba(16,185,129,0.05)]">
               <div className="flex items-center gap-2 mb-2 font-bold text-emerald-400 uppercase text-xs">
                 <Cpu className="w-4 h-4" /> OpenTelemetry Collector
               </div>
               <div className="grid grid-cols-3 gap-2 w-full text-[10px]">
                 <div className="bg-black/50 border border-zinc-800 py-2 text-center rounded">Receivers</div>
                 <div className="bg-black/50 border border-zinc-800 py-2 text-center rounded">Processors</div>
                 <div className="bg-black/50 border border-zinc-800 py-2 text-center rounded">Exporters</div>
               </div>
            </div>
          </div>

          <FlowArrow label="Telemetry Firehose" branching />

          {/* Storage Layer */}
          <div className="w-full flex justify-center gap-6 mb-4">
             <ArchitectureNode icon={Database} label="Distributed Traces" subLabel="(Jaeger)" color="border-blue-500/30 bg-blue-500/10 text-blue-400" />
             <ArchitectureNode icon={Database} label="Metrics" subLabel="(Prometheus)" color="border-amber-500/30 bg-amber-500/10 text-amber-400" />
             <ArchitectureNode icon={Database} label="Logs & Events" subLabel="(Loki / Elastic)" color="border-purple-500/30 bg-purple-500/10 text-purple-400" />
          </div>

          <FlowArrow label="Query API" reverse />

          {/* Ocular AI Platform */}
          <div className="w-[800px] border border-zinc-700/50 bg-[#0c0c0e] rounded-xl p-6 relative overflow-hidden shadow-2xl">
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            
            <div className="font-bold text-zinc-100 uppercase text-sm mb-6 flex items-center justify-center gap-2">
              <Network className="w-5 h-5 text-emerald-500" /> Ocular AI Platform
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 flex flex-col gap-4">
                <PlatformNode icon={Server} label="FastAPI Backend" desc="Async APIs & Data Aggr." color="text-zinc-300" />
                <PlatformNode icon={ShieldAlert} label="Anomaly Detection" desc="Statistical thresholds" color="text-amber-400" />
              </div>
              
              <div className="col-span-1 flex flex-col justify-center h-full">
                <div className="border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent p-4 rounded-xl flex flex-col items-center text-center shadow-[0_0_20px_rgba(16,185,129,0.1)] relative">
                  <div className="absolute -top-3 bg-[#0c0c0e] px-2 text-[10px] text-emerald-500 font-bold border border-emerald-500/30 rounded-full">CORE</div>
                  <Zap className="w-8 h-8 text-emerald-400 mb-2" />
                  <div className="font-bold text-zinc-100 text-xs mb-1 uppercase">AI Analysis Engine</div>
                  <div className="text-[10px] text-zinc-400 font-sans normal-case">
                    LLM-driven root-cause correlation, sequence analysis, and tool orchestration.
                  </div>
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-4 justify-center">
                 <PlatformNode icon={LayoutTemplate} label="Dashboard UI" desc="React + TailwindSPA" color="text-blue-400" />
                 <PlatformNode icon={Activity} label="Incident Replay" desc="Visual reconstruction" color="text-zinc-300" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ArchitectureNode({ icon: Icon, label, subLabel, color }: any) {
  return (
    <div className={`w-48 h-20 rounded-lg flex flex-col items-center justify-center border ${color}`}>
      <Icon className="w-5 h-5 mb-1 opacity-80" />
      <span className="font-bold text-[11px] uppercase">{label}</span>
      {subLabel && <span className="text-[9px] opacity-70 normal-case font-sans mt-0.5">{subLabel}</span>}
    </div>
  )
}

function PlatformNode({ icon: Icon, label, desc, color }: any) {
  return (
    <div className="bg-black/30 border border-zinc-800 p-3 rounded-lg flex flex-col items-center text-center">
      <Icon className={`w-4 h-4 mb-2 ${color}`} />
      <span className="font-bold text-[10px] text-zinc-200 uppercase">{label}</span>
      <span className="text-[9px] text-zinc-500 mt-1 font-sans normal-case leading-tight">{desc}</span>
    </div>
  )
}

function FlowArrow({ label, branching = false, reverse = false }: { label?: string, branching?: boolean, reverse?: boolean }) {
  return (
    <div className="flex flex-col items-center my-1 relative">
      {reverse && (
         <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-zinc-700" />
      )}
      <div className={`w-0.5 ${branching ? 'h-6' : 'h-10'} bg-zinc-700`} />
      {branching && (
         <div className="w-[380px] h-0.5 bg-zinc-700 relative">
            <div className="absolute top-0 left-0 w-0.5 h-4 bg-zinc-700" />
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-zinc-700" />
            <div className="absolute top-0 right-0 w-0.5 h-4 bg-zinc-700" />
            
            <div className="absolute top-4 left-0 w-0 h-0 -translate-x-[1px] border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-zinc-700" />
            <div className="absolute top-4 left-1/2 w-0 h-0 -translate-x-[1px] border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-zinc-700" />
            <div className="absolute top-4 right-0 w-0 h-0 translate-x-[1.5px] border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-zinc-700" />
         </div>
      )}
      {!reverse && !branching && (
        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-zinc-700" />
      )}
      {label && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 text-[9px] text-zinc-500 whitespace-nowrap bg-transparent px-1">
          {label}
        </div>
      )}
    </div>
  )
}
