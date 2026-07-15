import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, ChevronRight, Check } from 'lucide-react';

export default function UseStateSnapshotAnimation() {
  const [activeTab, setActiveTab] = useState<'snapshot' | 'updater'>('snapshot');
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: First call, 2: Second call, 3: Third call, 4: Render resolution
  const [snapshotCount, setSnapshotCount] = useState(0);
  const [updaterCount, setUpdaterCount] = useState(0);

  // Simulation values shown dynamically
  const initialValue = 0;

  const handleStepForward = () => {
    if (simStep < 4) {
      setSimStep((p) => p + 1);
    }
  };

  const handleReset = () => {
    setSimStep(0);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            useState snapshot closure behavior
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Compare snapshot replacement vs. functional updater queuing side-by-side
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab('snapshot'); setSimStep(0); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'snapshot' 
                ? 'bg-white dark:bg-zinc-900 shadow text-zinc-900 dark:text-zinc-100' 
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Snapshot: setCount(count + 1)
          </button>
          <button
            onClick={() => { setActiveTab('updater'); setSimStep(0); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'updater' 
                ? 'bg-white dark:bg-zinc-900 shadow text-zinc-900 dark:text-zinc-100' 
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            Functional: setCount(c =&gt; c + 1)
          </button>
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left column: Controls & Stack representation */}
        <div className="lg:col-span-5 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950/40 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Simulation Controls</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
                <span className="text-zinc-400">Render Scope Local Variable:</span>
                <span className="text-rose-500 font-bold">count = {initialValue}</span>
              </div>

              {/* Step indicator list */}
              <div className="space-y-2">
                <div className={`p-2.5 rounded text-xs transition-all flex items-center gap-2 ${
                  simStep === 0 ? 'bg-indigo-500/10 text-indigo-500 font-medium border border-indigo-500/20' : 'text-zinc-400'
                }`}>
                  <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] flex items-center justify-center font-bold">0</span>
                  <span>Idle (Local variable count is locked at 0)</span>
                </div>
                
                <div className={`p-2.5 rounded text-xs transition-all flex items-center gap-2 ${
                  simStep >= 1 && simStep <= 3 ? 'bg-amber-500/10 text-amber-500 font-medium border border-amber-500/20' : 'text-zinc-400'
                }`}>
                  <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] flex items-center justify-center font-bold">1-3</span>
                  <span>Executing 3 sequential setState updates</span>
                </div>

                <div className={`p-2.5 rounded text-xs transition-all flex items-center gap-2 ${
                  simStep === 4 ? 'bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20' : 'text-zinc-400'
                }`}>
                  <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] flex items-center justify-center font-bold">4</span>
                  <span>Render commits / updates display value</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleStepForward}
              disabled={simStep === 4}
              className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" /> {simStep === 0 ? 'Start Execution' : simStep === 3 ? 'Resolve Render' : 'Step Next Call'}
            </button>
            <button
              onClick={handleReset}
              className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right column: Execution queue visualization */}
        <div className="lg:col-span-7 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/20">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            React's Internal Update Queue (Queue of closures)
          </h4>

          {activeTab === 'snapshot' ? (
            <div className="space-y-4">
              {/* Call 1 */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                simStep >= 1 ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' : 'border-dashed border-zinc-200 dark:border-zinc-800 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">Call #1: setCount(count + 1)</span>
                  {simStep >= 1 && <span className="text-[10px] font-mono text-amber-500">Queued</span>}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  Evaluates as: <span className="text-rose-500 font-bold">setCount(0 + 1)</span> → queued value: <span className="text-zinc-800 dark:text-zinc-100 font-semibold">1</span>
                </p>
              </div>

              {/* Call 2 */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                simStep >= 2 ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' : 'border-dashed border-zinc-200 dark:border-zinc-800 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">Call #2: setCount(count + 1)</span>
                  {simStep >= 2 && <span className="text-[10px] font-mono text-amber-500">Queued</span>}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  Evaluates as: <span className="text-rose-500 font-bold">setCount(0 + 1)</span> → queued value: <span className="text-zinc-800 dark:text-zinc-100 font-semibold">1</span>
                </p>
                {simStep >= 2 && (
                  <div className="text-[9px] text-rose-500 font-mono mt-1 italic">
                    ⚠️ Note: 'count' inside this render closure is STILL 0!
                  </div>
                )}
              </div>

              {/* Call 3 */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                simStep >= 3 ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' : 'border-dashed border-zinc-200 dark:border-zinc-800 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">Call #3: setCount(count + 1)</span>
                  {simStep >= 3 && <span className="text-[10px] font-mono text-amber-500">Queued</span>}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  Evaluates as: <span className="text-rose-500 font-bold">setCount(0 + 1)</span> → queued value: <span className="text-zinc-800 dark:text-zinc-100 font-semibold">1</span>
                </p>
              </div>

              {/* Queue Resolution */}
              <div className={`p-3 rounded-xl border transition-all duration-500 ${
                simStep === 4 ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800 opacity-40'
              }`}>
                <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Final Queue Processing (Re-render)
                </div>
                <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <div>Initial value: <span className="text-zinc-800 dark:text-zinc-200">0</span></div>
                  <div>Applied updates sequentially: 1 → 1 → 1</div>
                  <div className="pt-1 border-t border-zinc-200 dark:border-zinc-800 font-bold flex justify-between">
                    <span>Resulting state value:</span>
                    <span className="text-emerald-500">count = 1</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Call 1 */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                simStep >= 1 ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' : 'border-dashed border-zinc-200 dark:border-zinc-800 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">Call #1: setCount(c =&gt; c + 1)</span>
                  {simStep >= 1 && <span className="text-[10px] font-mono text-amber-500">Queued</span>}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  Queues the dynamic updater callback: <span className="text-indigo-400 font-semibold">c =&gt; c + 1</span>
                </p>
              </div>

              {/* Call 2 */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                simStep >= 2 ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' : 'border-dashed border-zinc-200 dark:border-zinc-800 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">Call #2: setCount(c =&gt; c + 1)</span>
                  {simStep >= 2 && <span className="text-[10px] font-mono text-amber-500">Queued</span>}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  Queues the dynamic updater callback: <span className="text-indigo-400 font-semibold">c =&gt; c + 1</span>
                </p>
                {simStep >= 2 && (
                  <div className="text-[9px] text-amber-500 font-mono mt-1 italic">
                    ⚡ No closure lookup needed. React passes the *previous pending value* into this function!
                  </div>
                )}
              </div>

              {/* Call 3 */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                simStep >= 3 ? 'border-amber-400 bg-amber-500/5 dark:bg-amber-500/10' : 'border-dashed border-zinc-200 dark:border-zinc-800 opacity-30'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">Call #3: setCount(c =&gt; c + 1)</span>
                  {simStep >= 3 && <span className="text-[10px] font-mono text-amber-500">Queued</span>}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  Queues the dynamic updater callback: <span className="text-indigo-400 font-semibold">c =&gt; c + 1</span>
                </p>
              </div>

              {/* Queue Resolution */}
              <div className={`p-3 rounded-xl border transition-all duration-500 ${
                simStep === 4 ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800 opacity-40'
              }`}>
                <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Final Queue Processing (Re-render)
                </div>
                <div className="font-mono text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <div>Initial value: <span className="text-zinc-800 dark:text-zinc-200">0</span></div>
                  <div>Applied functional steps:</div>
                  <div className="pl-3 space-y-0.5">
                    <div>Step 1: <span className="text-zinc-500">c =&gt; 0 + 1</span> = <span className="text-sky-500 font-bold">1</span></div>
                    <div>Step 2: <span className="text-zinc-500">c =&gt; 1 + 1</span> = <span className="text-sky-500 font-bold">2</span></div>
                    <div>Step 3: <span className="text-zinc-500">c =&gt; 2 + 1</span> = <span className="text-sky-500 font-bold">3</span></div>
                  </div>
                  <div className="pt-1 border-t border-zinc-200 dark:border-zinc-800 font-bold flex justify-between">
                    <span>Resulting state value:</span>
                    <span className="text-emerald-500">count = 3</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
        <strong>🧠 Closure Snapshot Trap</strong>: During an active render loop execution frame, the `count` state is a constant value in that scope. Each standard state-update uses this frozen value. Using a functional updater (`setCount(c =&gt; c + 1)`) passes a callback that consumes the running state accumulator, safely avoiding stale-closure bugs.
      </div>
    </div>
  );
}
