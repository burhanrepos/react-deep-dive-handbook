import React, { useState } from 'react';
import { Play, RotateCcw, Cpu, Check, AlertTriangle } from 'lucide-react';

export default function PerformanceReRenderAnimation() {
  const [useMemoChildB, setUseMemoChildB] = useState(false);
  const [useCallbackChildC, setUseCallbackChildC] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  
  // Status tracking for animations
  const [animState, setAnimState] = useState<'idle' | 'rendering'>('idle');
  const [renderedNodes, setRenderedNodes] = useState<Record<string, boolean>>({});

  const triggerParentRender = () => {
    setRenderCount(prev => prev + 1);
    setAnimState('rendering');

    // Determine which nodes will render based on active optimizations
    const willRender: Record<string, boolean> = {
      parent: true,
      childA: true, // Standard child, always renders
    };

    // Child B: Wrapped in React.memo
    if (!useMemoChildB) {
      willRender['childB'] = true;
    } else {
      willRender['childB'] = false;
    }

    // Child C: Wrapped in React.memo but receives inline callback.
    // If useCallback is disabled, referential identity breaks, forcing re-render.
    if (!useCallbackChildC) {
      willRender['childC'] = true; // breaks memo because of inline function reference
    } else {
      willRender['childC'] = false; // memo is successful because callback reference is stable
    }

    setRenderedNodes(willRender);

    // Turn off animation after 1.8 seconds
    setTimeout(() => {
      setAnimState('idle');
    }, 1800);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-500" />
            Pruning the Re-render Tree
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            See which components light up (re-render) when the Parent's state updates. Toggle optimizations.
          </p>
        </div>

        <button
          onClick={triggerParentRender}
          disabled={animState === 'rendering'}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Re-render Parent (State Change)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Toggle Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Optimization Switches</h4>
            
            <div className="space-y-4">
              {/* Memo toggle */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useMemoChildB}
                  onChange={(e) => setUseMemoChildB(e.target.checked)}
                  className="mt-1 rounded text-orange-500 border-zinc-300 dark:border-zinc-700 focus:ring-orange-400 focus:ring-offset-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Wrap Child B in React.memo</span>
                  <span className="text-zinc-500 leading-relaxed block">Prevents re-render if primitive props are shallowly equal.</span>
                </div>
              </label>

              {/* Callback toggle */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useCallbackChildC}
                  onChange={(e) => setUseCallbackChildC(e.target.checked)}
                  className="mt-1 rounded text-orange-500 border-zinc-300 dark:border-zinc-700 focus:ring-orange-400 focus:ring-offset-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Wrap Child C callback in useCallback</span>
                  <span className="text-zinc-500 leading-relaxed block">Memoizes the function reference passed as prop to Child C.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 space-y-1 font-mono">
            <div>📈 Render Trigger Count: <span className="font-bold text-orange-500">{renderCount}</span></div>
            <div>Status: <span className={animState === 'rendering' ? 'text-orange-500 font-bold animate-pulse' : 'text-zinc-400'}>{animState === 'rendering' ? '⚡ Render Cycle Running...' : 'Idle'}</span></div>
          </div>
        </div>

        {/* Tree Render visualization */}
        <div className="lg:col-span-8 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/20 flex flex-col justify-center items-center relative overflow-hidden min-h-[300px]">
          
          {/* PARENT NODE */}
          <div className={`p-4 rounded-xl border-2 text-center transition-all duration-300 w-48 relative ${
            animState === 'rendering' && renderedNodes['parent']
              ? 'border-orange-500 bg-orange-500/20 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
          }`}>
            <span className="absolute -top-2.5 left-3 px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-[9px] font-mono text-zinc-500 border">
              Component
            </span>
            <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 font-mono">ParentComponent</h5>
            <span className="text-[10px] text-zinc-400 font-mono">renders: {renderCount}</span>
          </div>

          {/* Connective lines */}
          <div className="h-8 w-44 border-r-2 border-l-2 border-zinc-200 dark:border-zinc-800 relative">
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-zinc-200 dark:border-zinc-800" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 h-4 border-r-2 border-zinc-200 dark:border-zinc-800" />
          </div>

          {/* CHILDREN NODES ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            
            {/* CHILD A: STANDARD NODE */}
            <div className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[110px] relative ${
              animState === 'rendering' && renderedNodes['childA']
                ? 'border-orange-500 bg-orange-500/25 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.35)]'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60'
            }`}>
              <div className="text-[9px] font-mono text-zinc-400">Standard Child</div>
              <h6 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">ChildA</h6>
              <p className="text-[10px] text-zinc-500 mt-1">No optimizations.</p>
              
              {animState === 'rendering' && renderedNodes['childA'] && (
                <div className="text-[9px] text-orange-500 font-bold font-mono animate-pulse mt-2">
                  ⚡ Re-rendered!
                </div>
              )}
            </div>

            {/* CHILD B: MEMOIZED NODE */}
            <div className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[110px] relative ${
              animState === 'rendering' && renderedNodes['childB']
                ? 'border-orange-500 bg-orange-500/25 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.35)]'
                : animState === 'rendering' && !renderedNodes['childB']
                ? 'border-emerald-500 bg-emerald-500/10 scale-95 opacity-90'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60'
            }`}>
              <div className="text-[9px] font-mono text-zinc-400">Memoized Child</div>
              <h6 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">ChildB</h6>
              <p className="text-[10px] text-zinc-500 mt-1">React.memo(ChildB)</p>

              {animState === 'rendering' && (
                renderedNodes['childB'] ? (
                  <div className="text-[9px] text-orange-500 font-bold font-mono animate-pulse mt-2">
                    ⚡ Re-rendered (No Memo!)
                  </div>
                ) : (
                  <div className="text-[9px] text-emerald-500 font-bold font-mono flex items-center gap-0.5 mt-2">
                    <Check className="w-3.5 h-3.5" /> Blocked (Pure Props)
                  </div>
                )
              )}
            </div>

            {/* CHILD C: MEMO + CALLBACK DEPENDENCY */}
            <div className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[110px] relative ${
              animState === 'rendering' && renderedNodes['childC']
                ? 'border-orange-500 bg-orange-500/25 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.35)]'
                : animState === 'rendering' && !renderedNodes['childC']
                ? 'border-emerald-500 bg-emerald-500/10 scale-95 opacity-90'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60'
            }`}>
              <div className="text-[9px] font-mono text-zinc-400">Memo + Callback Prop</div>
              <h6 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">ChildC</h6>
              <p className="text-[10px] text-zinc-500 mt-1">Prop: onClick callback</p>

              {animState === 'rendering' && (
                renderedNodes['childC'] ? (
                  <div className="text-[9px] text-orange-500 font-bold font-mono mt-2">
                    <span className="flex items-center gap-0.5 text-orange-500">
                      <AlertTriangle className="w-3.5 h-3.5" /> Callback Ref Changed!
                    </span>
                  </div>
                ) : (
                  <div className="text-[9px] text-emerald-500 font-bold font-mono flex items-center gap-0.5 mt-2">
                    <Check className="w-3.5 h-3.5" /> Saved! Stable Callback Ref
                  </div>
                )
              )}
            </div>

          </div>

        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
        <strong>⚡ Referential Identity Core Truth</strong>: In standard Javascript, `() =&gt; &#123;&#125; !== () =&gt; &#123;&#125;`. If you pass a callback or an object inline (`&lt;Child onClick=&#123;() =&gt; console.log()&#125; /&gt;`), that prop reference is brand new every single render frame. Even if the Child is wrapped in `React.memo`, it is forced to completely re-render because its prop reference changed! Wrap callbacks in `useCallback` and objects/arrays in `useMemo` to keep identities identical.
      </div>
    </div>
  );
}
