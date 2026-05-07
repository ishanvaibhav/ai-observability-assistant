/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Activity, LayoutDashboard, MessageSquare, AlertTriangle, Network } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Traces } from './pages/Traces';
import { Assistant } from './pages/Assistant';
import { Incidents } from './pages/Incidents';
import { Architecture } from './pages/Architecture';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'architecture', label: 'Architecture Overview', icon: Network },
    { id: 'traces', label: 'Trace Explorer', icon: Activity },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden border border-zinc-800">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-[#09090b] border-r border-zinc-800 flex flex-col gap-1 p-4">
          <div className="flex items-center gap-2 mb-6 px-3">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-zinc-950 italic">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Ocular <span className="text-zinc-500 font-normal">| Observability</span></span>
          </div>
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 px-3">Explore</div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                    isActive 
                      ? 'bg-zinc-800/50 text-zinc-100 rounded-md border-l-2 border-emerald-500' 
                      : 'text-zinc-400 hover:text-zinc-100 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0e]">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'architecture' && <Architecture />}
          {activeTab === 'traces' && <Traces />}
          {activeTab === 'assistant' && <Assistant />}
          {activeTab === 'incidents' && <Incidents />}
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-8 bg-[#09090b] border-t border-zinc-800 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono uppercase tracking-widest shrink-0">
        <div className="flex gap-6">
          <span>ENV: PRODUCTION-EAST</span>
          <span>SERVICES_COUNT: 4</span>
          <span>STORAGE: 42% FULL</span>
        </div>
        <div className="flex gap-4">
          <span className="text-emerald-500">OTEL CONNECTED</span>
          <span>SYNCING...</span>
        </div>
      </footer>
    </div>
  );
}
