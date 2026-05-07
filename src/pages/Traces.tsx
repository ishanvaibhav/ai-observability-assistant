import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Custom Node Component
function ServiceNode({ data }: any) {
  const isError = data.status === 'error';
  const isWarning = data.status === 'warning';
  
  return (
    <div className={`px-4 py-2 shadow-xl rounded-md border-2 bg-zinc-900 ${
      isError ? 'border-red-500' : isWarning ? 'border-amber-500' : 'border-zinc-700'
    }`}>
      <div className="flex flex-col">
        <div className="font-bold text-sm text-zinc-100">{data.label}</div>
        <div className={`text-xs mt-1 font-mono ${
          isError ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-zinc-400'
        }`}>
          {data.latency}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = {
  custom: ServiceNode,
};

export function Traces() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedSpan, setSelectedSpan] = useState<null | any>(null);

  useEffect(() => {
    fetch('/api/traces')
      .then(res => res.json())
      .then(data => {
        setNodes(data.nodes);
        setEdges(data.edges);
      });
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedSpan(node);
  }, []);

  return (
    <div className="flex h-full bg-transparent">
      <div className="flex-1 flex flex-col relative h-full">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#0c0c0e]/80 backdrop-blur-sm z-10 absolute top-0 left-0 right-0">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Trace Explorer</h2>
            <div className="text-xs text-zinc-400 font-mono mt-1">Trace ID: 7b89f2a1-e451-4d32-90ab</div>
          </div>
          <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1 font-mono text-[10px] tracking-wider uppercase border-red-500/30">
            Status: Error (Auth Failed)
          </Badge>
        </div>

        <div className="flex-1 bg-transparent pt-20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0c0c0e]"
            colorMode="dark"
          >
            <Background color="#1f1f22" gap={16} />
            <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-400" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.data?.status === 'error') return '#ef4444';
                if (n.data?.status === 'warning') return '#f59e0b';
                return '#3f3f46';
              }} 
              maskColor="rgb(9 9 11 / 0.8)"
              className="bg-zinc-900"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-96 border-l border-zinc-800 bg-[#09090b] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
          <h3 className="text-sm font-semibold text-zinc-100">SPAN DETAILS</h3>
          <p className="text-xs text-zinc-500 mt-1">Click a node to view telemetry</p>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {selectedSpan ? (
            <div className="space-y-6">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Service</div>
                <div className="text-lg font-bold text-zinc-100">{selectedSpan.data.label}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-3">
                    <div className="text-xs text-zinc-500 mb-1">Duration</div>
                    <div className="font-mono text-zinc-200">{selectedSpan.data.latency}</div>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardContent className="p-3">
                    <div className="text-xs text-zinc-500 mb-1">Status Code</div>
                    <div className={`font-mono ${selectedSpan.data.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {selectedSpan.data.status === 'error' ? '503' : '200'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedSpan.data.status === 'error' && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-red-500">Error Details</div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 font-mono text-xs text-red-400 break-all">
                    Error: connection_pool_exhausted<br/>
                    at database.connect (/app/db.js:42:15)<br/>
                    at AuthController.login (/app/auth.js:18:22)
                  </div>
                </div>
              )}

              <Separator className="bg-zinc-800" />
              
              <div className="space-y-2">
                <div className="text-sm font-semibold text-zinc-300">Tags</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900">env: production</Badge>
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900">region: us-east-1</Badge>
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700 bg-zinc-900">version: 1.4.2</Badge>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-sm text-zinc-500 text-center mt-10">
              Select a span in the graph to view its details.
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
