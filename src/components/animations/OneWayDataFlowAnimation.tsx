import React, { useState } from 'react';
import { ArrowDown, ArrowUp, RefreshCw, Send, Radio } from 'lucide-react';

export default function OneWayDataFlowAnimation() {
  const [parentVolume, setParentVolume] = useState(50);
  const [flowDirection, setFlowDirection] = useState<'idle' | 'up' | 'down'>('idle');
  const [pulseNode, setPulseNode] = useState<string | null>(null);

  const handleChildAction = (newVol: number) => {
    // 1. Trigger event flowing UP
    setFlowDirection('up');
    setPulseNode('child');
    
    setTimeout(() => {
      // 2. State updates in parent
      setParentVolume(newVol);
      setFlowDirection('down');
      setPulseNode('parent');

      setTimeout(() => {
        setFlowDirection('idle');
        setPulseNode(null);
      }, 800);
    }, 800);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Radio className="w-5 h-5 text-teal-500 animate-pulse" />
          One-Way Data Flow & Lifting State Up
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          State belongs to the parent. Children dispatch callback actions UP. Updated state flows back DOWN as read-only props.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State explanation column */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Unidirectional Circuit</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              React is strictly single-directional. Siblings cannot speak to each other directly (e.g., Component B cannot talk to Component C). 
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              To synchronize them, we <strong>"lift state"</strong> to their nearest common ancestor. The controller component triggers callbacks; parent changes state, re-rendering both.
            </p>
          </div>

          <div className="mt-4 p-2 rounded bg-zinc-100 dark:bg-zinc-800 border font-mono text-[10px] space-y-1">
            <div className="flex justify-between">
              <span>Active flow:</span>
              <span className={`font-bold uppercase ${
                flowDirection === 'up' ? 'text-amber-500' :
                flowDirection === 'down' ? 'text-sky-500' : 'text-zinc-400'
              }`}>
                {flowDirection === 'idle' ? '● Idle' : flowDirection === 'up' ? '▲ callback() flowing UP' : '▼ props flowing DOWN'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Parent State:</span>
              <span className="text-teal-500 font-bold">volume = {parentVolume}%</span>
            </div>
          </div>
        </div>

        {/* Dynamic visual architecture schema */}
        <div className="lg:col-span-8 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/20 flex flex-col items-center justify-center gap-6 relative min-h-[300px]">
          
          {/* PARENT CONTAINER */}
          <div className={`p-4 rounded-xl border-2 w-52 text-center transition-all duration-300 relative ${
            pulseNode === 'parent' ? 'border-teal-500 bg-teal-500/10 scale-105 shadow-[0_0_12px_rgba(20,184,166,0.2)]' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
          }`}>
            <span className="absolute -top-2.5 left-3 px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[8px] font-mono text-zinc-400 border">
              Parent State Source
            </span>
            <div className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100">ParentContainer</div>
            <div className="mt-1.5 p-1 rounded bg-zinc-100 dark:bg-zinc-950 text-xs font-mono text-teal-500 font-semibold inline-block">
              const [vol, setVol] = useState({parentVolume})
            </div>
          </div>

          {/* Connection Lines / Flow Rails */}
          <div className="w-80 flex justify-between h-14 relative px-8">
            {/* Left Flow Rail (UPWARDS CALLBACK) */}
            <div className="flex flex-col items-center justify-center relative w-1/3">
              <div className="h-full border-r-2 border-dashed border-zinc-300 dark:border-zinc-700 relative flex items-center justify-center">
                <ArrowUp className={`w-4 h-4 absolute ${
                  flowDirection === 'up' ? 'text-amber-500 animate-bounce -translate-y-2' : 'text-zinc-300 dark:text-zinc-800'
                }`} />
              </div>
              <span className="text-[8px] font-mono text-amber-500 absolute -left-12 top-1/3">
                {flowDirection === 'up' ? 'onVolumeChange()' : 'callback path'}
              </span>
            </div>

            {/* Right Flow Rail (DOWNWARDS PROPS) */}
            <div className="flex flex-col items-center justify-center relative w-1/3">
              <div className="h-full border-r-2 border-dashed border-zinc-300 dark:border-zinc-700 relative flex items-center justify-center">
                <ArrowDown className={`w-4 h-4 absolute ${
                  flowDirection === 'down' ? 'text-sky-500 animate-bounce translate-y-2' : 'text-zinc-300 dark:text-zinc-800'
                }`} />
              </div>
              <span className="text-[8px] font-mono text-sky-500 absolute -right-6 top-1/3">
                {flowDirection === 'down' ? 'props.volume' : 'prop path'}
              </span>
            </div>
          </div>

          {/* SIBLINGS / CHILDREN ROW */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            
            {/* SIBLING A: THE CONTROLLER (Mutative actions) */}
            <div className={`p-3 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
              pulseNode === 'child' ? 'border-amber-400 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
            }`}>
              <span className="absolute -top-2.5 left-2 px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[8px] font-mono text-zinc-400 border">
                Sibling A: Dispatcher
              </span>
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-mono mb-2">ControllerComp</div>
              
              <div className="space-y-1.5 mt-2">
                <span className="text-[9px] text-zinc-400 font-mono block">Action Trigger:</span>
                <div className="flex gap-1 justify-center">
                  <button
                    onClick={() => handleChildAction(Math.max(0, parentVolume - 10))}
                    className="p-1 px-2 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold transition"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => handleChildAction(Math.min(100, parentVolume + 10))}
                    className="p-1 px-2 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold transition animate-pulse"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </div>

            {/* SIBLING B: THE RECEIVER (Pure display node) */}
            <div className={`p-3 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
              flowDirection === 'down' ? 'border-sky-400 bg-sky-400/5' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
            }`}>
              <span className="absolute -top-2.5 left-2 px-1 rounded bg-zinc-100 dark:bg-zinc-800 text-[8px] font-mono text-zinc-400 border">
                Sibling B: Receiver
              </span>
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-mono mb-2">AudioDisplayComp</div>
              
              <div className="mt-2 space-y-1">
                <span className="text-[9px] text-zinc-400 font-mono block">Read-Only Prop:</span>
                <div className="p-1 rounded bg-zinc-50 dark:bg-zinc-950 border text-center">
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-200">
                    🔊 Volume: {parentVolume}%
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
