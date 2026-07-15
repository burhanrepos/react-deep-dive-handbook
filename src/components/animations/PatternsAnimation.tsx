import React, { useState, useRef } from 'react';
import { ToggleLeft, Send, Check, Code, Eye, RefreshCw } from 'lucide-react';

export default function PatternsAnimation() {
  // Controlled state
  const [controlledText, setControlledText] = useState('');
  const [controlledRenders, setControlledRenders] = useState(0);

  // Uncontrolled state (only for display when clicked)
  const uncontrolledRef = useRef<HTMLInputElement>(null);
  const [uncontrolledRetrievedValue, setUncontrolledRetrievedValue] = useState('');
  const [uncontrolledRenders, setUncontrolledRenders] = useState(0);

  const handleControlledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setControlledText(e.target.value);
    setControlledRenders(prev => prev + 1);
  };

  const handleUncontrolledKeyPress = () => {
    // Uncontrolled inputs do not trigger re-renders, but we can track typing activity
    // to prove that the component is NOT rendering!
  };

  const retrieveUncontrolledValue = () => {
    if (uncontrolledRef.current) {
      setUncontrolledRetrievedValue(uncontrolledRef.current.value);
      // Trigger a render *only* when the user retrieves the ref value
      setUncontrolledRenders(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setControlledText('');
    setControlledRenders(0);
    setUncontrolledRetrievedValue('');
    setUncontrolledRenders(0);
    if (uncontrolledRef.current) uncontrolledRef.current.value = '';
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ToggleLeft className="w-5 h-5 text-emerald-500" />
            Controlled vs. Uncontrolled Forms
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Understand state synchronization vs direct DOM querying via refs, and their performance properties.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Form
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL A: CONTROLLED INPUT */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5 mb-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">React-Controlled (Sync)</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold font-mono">
                State Sync
              </span>
            </div>

            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Every keystroke calls a handler, updates React state, and forces a re-render. React is the "single source of truth".
            </p>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase">Input Node (Typing triggers render)</label>
                <input
                  type="text"
                  value={controlledText}
                  onChange={handleControlledChange}
                  placeholder="Type anything..."
                  className="px-3.5 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition w-full"
                />
              </div>

              {/* State and Render tracking */}
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">React state value:</span>
                  <span className="text-emerald-500 font-bold">"{controlledText}"</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200/50 dark:border-zinc-800/50 pt-1.5">
                  <span className="text-zinc-400">Total Key-Renders:</span>
                  <span className="text-rose-500 font-bold">{controlledRenders}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[10px] text-zinc-400 border-t border-zinc-200/30 dark:border-zinc-800/30 pt-3">
            🎯 <strong>Use Case:</strong> Dynamic validation, live search autocomplete, custom formatting, and conditional submission blockades.
          </div>
        </div>

        {/* PANEL B: UNCONTROLLED INPUT */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2.5 mb-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">DOM-Controlled (Uncontrolled)</span>
              <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded font-bold font-mono">
                On-Demand Ref
              </span>
            </div>

            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              The physical browser DOM stores its own input value. React does not listen. Component re-renders are 0 while typing.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase">Input Node (0 typing renders!)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    ref={uncontrolledRef}
                    onKeyDown={handleUncontrolledKeyPress}
                    placeholder="Type anything..."
                    className="px-3.5 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-sky-500/30 focus:outline-none transition flex-1"
                  />
                  <button
                    onClick={retrieveUncontrolledValue}
                    className="px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Read Ref
                  </button>
                </div>
              </div>

              {/* Ref value retrieved */}
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Ref current value:</span>
                  <span className="text-sky-500 font-bold">"{uncontrolledRetrievedValue}"</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200/50 dark:border-zinc-800/50 pt-1.5">
                  <span className="text-zinc-400">Renders on Typing:</span>
                  <span className="text-emerald-500 font-bold">0 renders</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[10px] text-zinc-400 border-t border-zinc-200/30 dark:border-zinc-800/30 pt-3">
            🎯 <strong>Use Case:</strong> Simple login forms (username/password read once on submit), third-party non-React libraries, heavy performance fields.
          </div>
        </div>

      </div>
    </div>
  );
}
