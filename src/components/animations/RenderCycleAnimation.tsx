import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Zap, Cpu, Layers } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  phase: 'trigger' | 'render' | 'reconcile' | 'commit';
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    id: 0,
    name: 'Idle',
    phase: 'trigger',
    title: 'Idle State (Initial Paint)',
    desc: 'The UI is painted and matches the current state (count = 0). Click "Increment Count" to trigger a state update.',
  },
  {
    id: 1,
    name: 'Trigger',
    phase: 'trigger',
    title: 'State Change Triggered',
    desc: 'The user triggers an action. setCount(1) is called. React schedules a re-render for this component branch.',
  },
  {
    id: 2,
    name: 'Render Function',
    phase: 'render',
    title: 'Render Phase: Function Re-runs',
    desc: 'React executes the component function App() with the new state values. JSX is compiled into React.createElement calls.',
  },
  {
    id: 3,
    name: 'VDOM Generated',
    phase: 'render',
    title: 'Render Phase: Virtual DOM Created',
    desc: 'A new Virtual DOM element tree is generated. This is a lightweight JavaScript object description of the desired UI.',
  },
  {
    id: 4,
    name: 'Diffing Tree',
    phase: 'reconcile',
    title: 'Reconciliation Phase: Tree Diffing',
    desc: 'React compares (diffs) the newly generated Virtual DOM tree with the previous Virtual DOM tree to isolate exact differences.',
  },
  {
    id: 5,
    name: 'Commit Paint',
    phase: 'commit',
    title: 'Commit Phase: Paint to Real DOM',
    desc: 'React updates ONLY the real DOM node that actually changed (the button text). Non-changing nodes are untouched, avoiding layout thrashing.',
  }
];

export default function RenderCycleAnimation() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((p) => p - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
    setCount(0);
  };

  const triggerStateChange = () => {
    setCount(1);
    setCurrentStepIdx(1);
  };

  const currentStep = STEPS[currentStepIdx];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-500 animate-pulse" />
            Interactive Render Cycle Visualizer
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Step through React's three core runtime phases: Trigger → Render (cheap) → Commit (real DOM)
          </p>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause Autoplay
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Autoplay Walkthrough
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx === STEPS.length - 1}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {STEPS.map((step, idx) => {
          let color = 'bg-zinc-200 dark:bg-zinc-800';
          if (idx <= currentStepIdx) {
            if (step.phase === 'trigger') color = 'bg-rose-500';
            else if (step.phase === 'render') color = 'bg-sky-500';
            else if (step.phase === 'reconcile') color = 'bg-indigo-500';
            else if (step.phase === 'commit') color = 'bg-emerald-500';
          }
          return (
            <div key={step.id} className="flex flex-col gap-1">
              <div className={`h-2 rounded ${color} transition-all duration-500`} />
              <span className={`text-[10px] hidden md:inline text-center font-medium ${
                idx === currentStepIdx 
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold' 
                  : 'text-zinc-400'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stage visualizer panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Left Side: Step explanation card */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                currentStep.phase === 'trigger' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400' :
                currentStep.phase === 'render' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-400' :
                currentStep.phase === 'reconcile' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400' :
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
              }`}>
                Phase: {currentStep.phase}
              </span>
              <span className="text-xs text-zinc-400">Step {currentStepIdx + 1} of 6</span>
            </div>
            <h4 className="text-md font-bold text-zinc-950 dark:text-zinc-50 mb-2">{currentStep.title}</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{currentStep.desc}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
            {currentStepIdx === 0 ? (
              <button
                onClick={triggerStateChange}
                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" /> Trigger State Change
              </button>
            ) : (
              <div className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                🚀 Current State: <span className="text-amber-500 font-bold">count = {count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Animated Schematic of memory, trees and real DOM */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/20">
          
          {/* Column 1: Component Memory & Call Stack */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Component State
            </h5>
            <div className={`flex-1 p-3 border rounded-xl flex flex-col justify-between transition-all duration-500 ${
              currentStepIdx >= 1 ? 'border-rose-400 bg-rose-500/5 dark:bg-rose-500/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
            }`}>
              <div>
                <div className="text-xs font-mono text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-1.5 mb-1.5">Function Frame: App()</div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span>const [count, setCount]</span>
                  </div>
                  <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 flex justify-between items-center font-mono text-xs">
                    <span className="text-zinc-500">Value (In Memory):</span>
                    <span className={`font-bold ${currentStepIdx >= 1 ? 'text-rose-500 scale-110 transition-transform' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 mt-4">
                {currentStepIdx === 1 && "⚠️ State changed! React marks App as 'dirty' and schedules render."}
                {currentStepIdx === 2 && "⚡ Component function executes: App() runs with count=1."}
                {currentStepIdx >= 3 && "✅ Memory state successfully computed."}
              </div>
            </div>
          </div>

          {/* Column 2: Virtual DOM Trees (Prev vs Next) */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Virtual DOM
            </h5>
            <div className={`flex-1 p-3 border rounded-xl flex flex-col justify-between transition-all duration-500 ${
              currentStep.phase === 'render' || currentStep.phase === 'reconcile' 
                ? 'border-sky-400 bg-sky-500/5 dark:bg-sky-500/10' 
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
            }`}>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {/* Previous Virtual Node */}
                <div className="p-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-100/50 dark:bg-zinc-900/50 opacity-60">
                  <div className="text-[9px] font-mono text-zinc-400">Previous Tree</div>
                  <div className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                    &lt;button&gt;<br/>
                    &nbsp;&nbsp;Count: 0<br/>
                    &lt;/button&gt;
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-center text-zinc-400">
                  <span className="text-[10px] font-bold">VS</span>
                </div>

                {/* New Virtual Node */}
                <div className={`p-2 border rounded transition-all duration-300 ${
                  currentStepIdx >= 3 
                    ? 'border-sky-400 bg-sky-500/10 dark:bg-sky-500/20 shadow-sm' 
                    : 'border-zinc-200 dark:border-zinc-800 opacity-40'
                }`}>
                  <div className="text-[9px] font-mono text-zinc-500 flex justify-between items-center">
                    <span>New Tree (Count: {count})</span>
                    {currentStepIdx === 3 && <span className="animate-ping w-1.5 h-1.5 rounded-full bg-sky-500" />}
                  </div>
                  <div className="font-mono text-[10px]">
                    &lt;button&gt;<br/>
                    &nbsp;&nbsp;<span className={currentStepIdx >= 4 ? 'bg-indigo-500/20 text-indigo-400 font-bold px-1 rounded' : ''}>Count: {count}</span><br/>
                    &lt;/button&gt;
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 mt-2">
                {currentStepIdx === 3 && "🌿 JSX returned & formatted into a new memory tree object."}
                {currentStepIdx === 4 && "🔍 Reconciliation compares elements. Diff isolated: 'Count: 0' -> 'Count: 1'."}
              </div>
            </div>
          </div>

          {/* Column 3: Browser Real DOM Paint */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Real Browser DOM
            </h5>
            <div className={`flex-1 p-3 border rounded-xl flex flex-col justify-between transition-all duration-500 ${
              currentStepIdx === 5 ? 'border-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-zinc-400 ml-1 font-mono">localhost:3000</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <div className="text-[9px] text-zinc-400 mb-2">My App Component</div>
                  <button
                    onClick={() => { if(currentStepIdx === 0) triggerStateChange(); }}
                    className={`px-3 py-1.5 rounded border text-xs font-mono transition-all duration-500 ${
                      currentStepIdx === 5
                        ? 'bg-emerald-500/30 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold scale-105 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    Count: {currentStepIdx === 5 ? 1 : 0}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 mt-4">
                {currentStepIdx === 5 ? (
                  <span className="text-emerald-500 font-semibold">✨ Painted! Only the dynamic text node was updated in the real DOM.</span>
                ) : (
                  <span>Wait for commit stage to see the real browser node light up.</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
        <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">💡 Real-world Interview Lesson:</h5>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <strong>"Render" is NOT "Paint"</strong>: React executes the render function to construct a virtual description. It does not touch the viewport yet. The DOM is touched <strong>only</strong> during the "Commit" phase, which isolates updates through fine-grained reconciliation. This is why virtual DOM updates are cheap.
        </p>
      </div>
    </div>
  );
}
