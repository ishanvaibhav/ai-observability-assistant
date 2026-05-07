import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'I am Ocular, your SRE AI assistant. I have analyzed the recent spike in `auth-service` errors. Would you like a root-cause summary?',
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Tool Orchestration Workflow
    let currentStepIndex = 0;
    const toolsToCall = ['fetch_metrics', 'get_logs', 'analyze_trace', 'detect_anomaly'];
    
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: "Starting analysis orchestration..." }]);

    const runTools = async () => {
      let accumulatedOutput = "### AI ANALYSIS AGENT\n\n";

      for (const tool of toolsToCall) {
        accumulatedOutput += `*Calling \`${tool}()\`...*\n`;
        setMessages(prev => {
          const newMsg = [...prev];
          const idx = newMsg.findIndex(m => m.id === aiMsgId);
          if (idx >= 0) newMsg[idx].content = accumulatedOutput;
          return newMsg;
        });

        try {
          const res = await fetch(`/api/tools/${tool}`, { method: 'POST' });
          const data = await res.json();
          accumulatedOutput += `> **Result:** ${data.result}\n\n`;
        } catch (e) {
           accumulatedOutput += `> **Error:** Failed to call tool.\n\n`;
        }

        setMessages(prev => {
          const newMsg = [...prev];
          const idx = newMsg.findIndex(m => m.id === aiMsgId);
          if (idx >= 0) newMsg[idx].content = accumulatedOutput;
          return newMsg;
        });

        // Small delay for animation effect
        await new Promise(r => setTimeout(r, 600));
      }

      // Final aggregation
      accumulatedOutput += "\n🔄 Aggregating telemetry context...\n";
      setMessages(prev => {
        const newMsg = [...prev];
        const idx = newMsg.findIndex(m => m.id === aiMsgId);
        if (idx >= 0) newMsg[idx].content = accumulatedOutput;
        return newMsg;
      });

      setTimeout(async () => {
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userMsg.content })
          });
          const data = await res.json();
          
          accumulatedOutput += `\n---\n\n### ROOT CAUSE SUMMARY\n**${data.rootCause}**\n\n**Evidence:**\n${data.analysis}\n\n**Suggested Fix:**\n\`\`\`yaml\n${data.fix}\n\`\`\``;

          setMessages(prev => {
            const newMessages = [...prev];
            const idx = newMessages.findIndex(m => m.id === aiMsgId);
            if (idx >= 0) newMessages[idx].content = accumulatedOutput;
            return newMessages;
          });
        } catch(e) {}
      }, 1000);
    };

    runTools();
  };

  return (
    <div className="h-full flex flex-col bg-transparent px-6 py-6 pb-0">
      <div className="flex-1 w-full flex flex-col bg-[#09090b] border border-zinc-800 rounded-t-xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center gap-2">
          <div className="bg-emerald-500/20 p-2 rounded-md">
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Ocular AI Analyzer</h2>
            <p className="text-xs text-zinc-400">Context: Connected to traces & logs</p>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6 pb-4 max-w-4xl mx-auto w-full">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <Avatar className={`w-8 h-8 rounded-md border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-[#0c0c0e] border-zinc-800'}`}>
                  <AvatarFallback className="bg-transparent text-zinc-400">
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-500" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-zinc-800/40 border border-zinc-700/50 text-zinc-200 rounded-lg rounded-tr-none italic' 
                    : 'bg-black/20 border border-zinc-800 text-zinc-300 rounded-lg rounded-tl-none'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                  ) : (
                    `"${msg.content}"`
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-[#09090b]">
          <form 
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 max-w-4xl mx-auto w-full relative"
          >
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about system anomalies..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-6 px-4 text-sm focus:outline-none focus:border-zinc-600 focus-visible:ring-0 shadow-none text-zinc-100 pr-16"
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold text-[10px] uppercase tracking-widest px-3 h-8 w-auto transition-colors">
              ENTER
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Simple markdown formatter just for bold/lists in our mock
function formatMarkdown(text: string) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100">$1</strong>');
  // Syntax highlighting for code blocks
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, '<div class="bg-black/40 border border-zinc-800 p-3 rounded-md my-2"><code class="text-emerald-400 font-mono text-[11px]">$1</code></div>');
  html = html.replace(/`(.*?)`/g, '<code class="bg-[#09090b] px-1 py-0.5 border border-zinc-800 rounded-sm text-emerald-400 font-mono text-[11px]">$1</code>');
  html = html.replace(/### (.*?)\n/g, '<h3 class="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2 mt-4 border-b border-zinc-800/50 pb-1">$1</h3>');
  html = html.replace(/\n1\. (.*?)\n/g, '<ol class="list-decimal pl-5 mt-2 space-y-1"><li class="mb-1">$1</li>');
  html = html.replace(/\n2\. (.*?)\n/g, '<li class="mb-1">$1</li>');
  html = html.replace(/\n3\. (.*?)(\n|$)/g, '<li class="mb-1">$1</li></ol>');
  
  // Format tool execution steps
  html = html.replace(/\*Calling `(.*?)`\.\.\.\*/g, '<div class="text-xs text-zinc-400 mt-3 mb-1 flex items-center gap-2"><div class="w-3 h-3 rounded-full border-2 border-emerald-500/50 border-t-emerald-500 animate-spin"></div> Calling Tool: <code class="text-emerald-400 font-mono bg-black/50 px-1 py-0.5 rounded">$1</code></div>');
  html = html.replace(/> \*\*Result:\*\* (.*?)\n/g, '<div class="pl-3 border-l-2 border-zinc-700 text-[11px] text-zinc-500 font-mono mb-2">$1</div>');
  html = html.replace(/🔄 Aggregating telemetry context\.\.\./g, '<div class="text-xs text-blue-400 mt-4 mb-2 flex items-center gap-2"><span>🔄</span> Aggregating telemetry context...</div>');
  html = html.replace(/---/g, '<hr class="border-zinc-800 my-4" />');

  html = html.replace(/\n\n/g, '<br/>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}
