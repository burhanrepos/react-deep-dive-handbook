import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface TimelineStep {
  id: number;
  label: string;
  time: string;
  description: string;
  color: string;
  badge: string;
}

const NORMAL_STEPS: TimelineStep[] = [
  {
    id: 1,
    label: 'Render Phase',
    time: 't = 0ms',
    description: 'Component runs, calculates output, and creates virtual tree. State variable is evaluated.',
    color: 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    badge: 'Render'
  },
  {
    id: 2,
    label: 'Commit & Paint',
    time: 't = 20ms',
    description: 'React commits changes to the real DOM, and the browser paints the pixels. Users see the new UI.',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badge: 'Paint'
  },
  {
    id: 3,
    label: 'Previous Effect Cleanup',
    time: 't = 50ms',
    description: 'If dependencies changed, React executes the cleanup function returned by the previous effect run.',
    color: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    badge: 'Cleanup'
  },
  {
    id: 4,
    label: 'Active Effect Executes',
    time: 't = 80ms',
    description: 'React runs the active useEffect setup. Fetches start, subscriptions are established.',
    color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    badge: 'Setup'
  }
];

const STRICT_MODE_STEPS: TimelineStep[] = [
  {
    id: 1,
    label: 'Render Phase',
    time: 't = 0ms',
    description: 'Component renders. In dev mode, renders double-run to test for pure-function violations.',
    color: 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400',
    badge: 'Render'
  },
  {
    id: 2,
    label: 'Paint Frame',
    time: 't = 20ms',
    description: 'Browser commits nodes and paints layout on screen.',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badge: 'Paint'
  },
  {
    id: 3,
    label: 'Setup Effect (1st Run)',
    time: 't = 40ms',
    description: 'First useEffect setup runs immediately on mount.',
    color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400',
    badge: 'Setup'
  },
  {
    id: 4,
    label: 'Cleanup Effect (Simulated Unmount)',
    time: 't = 60ms',
    description: 'React unmounts the effect immediately in development to reveal if resources were fully cleaned up.',
    color: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    badge: 'Cleanup'
  },
  {
    id: 5,
    label: 'Setup Effect (2nd Run)',
    time: 't = 80ms',
    description: 'React remounts the effect setup, finalizing development lifecycle.',
    color: 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    badge: 'Setup'
  }
];

export default function UseEffectTimelineAnimation() {
  const [strictMode, setStrictMode] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = strictMode ? STRICT_MODE_STEPS : NORMAL_STEPS;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx(p => p + 1);
    }
  };

  const handlePrev = () => {
    if (stepIdx > 0) {
      setStepIdx(p => p - 1);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setIsPlaying(false);
  };

  const activeStep = steps[stepIdx];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            useEffect Timeline & StrictMode Double-Run
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Visualize the precise asynchronous timing of useEffect execution and the development-mode StrictMode double-mount behavior.
          </p>
        </div>

        {/* Toggle StrictMode */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">StrictMode:</span>
          <button
            onClick={() => { setStrictMode(!strictMode); handleReset(); }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              strictMode ? 'bg-purple-600' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                strictMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Step details panel */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-400">Chronological Phase</span>
              <span className="font-mono text-xs text-purple-500 font-bold">{activeStep.time}</span>
            </div>
            
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2 border ${activeStep.color}`}>
              {activeStep.badge}
            </span>

            <h4 className="text-md font-bold text-zinc-950 dark:text-zinc-50 mb-2">{activeStep.label}</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{activeStep.description}</p>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play Timeline'}
            </button>
            <button
              onClick={handlePrev}
              disabled={stepIdx === 0}
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={stepIdx === steps.length - 1}
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Playable Timeline Visualization */}
        <div className="lg:col-span-8 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/20 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Chronological Trace Line</h4>
            
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6 ml-3 space-y-5">
              {steps.map((step, idx) => {
                const isActive = idx === stepIdx;
                const isPassed = idx < stepIdx;
                
                return (
                  <div key={step.id} className="relative">
                    {/* Circle Node */}
                    <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-all ${
                      isActive ? 'bg-purple-500 border-purple-500 text-white ring-4 ring-purple-500/15 scale-125' :
                      isPassed ? 'bg-emerald-500 border-emerald-500 text-white' :
                      'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>

                    <div className={`transition-all duration-300 ${isActive ? 'translate-x-1.5' : ''}`}>
                      <div className="flex items-center gap-2">
                        <h5 className={`text-xs font-bold ${
                          isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'
                        }`}>
                          {step.label}
                        </h5>
                        <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.2 rounded">
                          {step.time}
                        </span>
                      </div>
                      {isActive && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 flex flex-col gap-1">
            <span>ℹ️ <strong>Timeline Rules:</strong></span>
            <span>1. Painting is synchronous; layout blocks are pushed into the layout tree and drawn.</span>
            <span>2. <strong>useEffect is completely deferred/asynchronous</strong>; it executes only AFTER painting finishes so it does not block user interactions.</span>
            {strictMode && <span className="text-purple-500 font-semibold">3. StrictMode forces mounting, unmounting, then mounting again to highlight missing cleanups (e.g. uncleared timers, web sockets).</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
