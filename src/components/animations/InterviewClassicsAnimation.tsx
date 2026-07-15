import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Zap, Trash2, CheckCircle } from 'lucide-react';

export default function InterviewClassicsAnimation() {
  const [inputText, setInputText] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [timerProgress, setTimerProgress] = useState(0); // 0 to 100%
  const [activeTimer, setActiveTimer] = useState(false);
  const [eventsLog, setEventsLog] = useState<{ id: string; type: 'keypress' | 'cancel' | 'api'; text: string; time: string }[]>([]);

  // Simulation of rapid typing
  const simulateTyping = () => {
    const chars = ['R', 'e', 'a', 'c', 't'];
    let delay = 0;
    
    // Clear logs
    setEventsLog([]);
    setInputText('');
    setDebouncedValue('');
    setTimerProgress(0);
    setActiveTimer(false);

    chars.forEach((char, idx) => {
      setTimeout(() => {
        const textSoFar = chars.slice(0, idx + 1).join('');
        setInputText(textSoFar);
        
        // Add keystroke event log
        setEventsLog(prev => [
          {
            id: `${Date.now()}-${idx}`,
            type: 'keypress',
            text: `Typed "${char}" (Value: "${textSoFar}")`,
            time: new Date().toLocaleTimeString().split(' ')[0],
          },
          ...prev.slice(0, 5)
        ]);

        // Start or reset debounce timer simulation
        setActiveTimer(true);
        setTimerProgress(0); // reset timer progress bar on keystroke
        
        // Log cancellation of previous timer if not the first keystroke
        if (idx > 0) {
          setEventsLog(prev => [
            {
              id: `${Date.now()}-cancel-${idx}`,
              type: 'cancel',
              text: `⚠️ Previous debounce timer CANCELLED!`,
              time: new Date().toLocaleTimeString().split(' ')[0],
            },
            ...prev
          ]);
        }
      }, delay);
      delay += 300; // Keystroke every 300ms (less than 500ms debounce window!)
    });
  };

  // Debounce timing progress animation loop
  useEffect(() => {
    let interval: any;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setActiveTimer(false);
            setDebouncedValue(inputText);
            setEventsLog(prevLogs => [
              {
                id: `api-${Date.now()}`,
                type: 'api',
                text: `🚀 Success! Debounce completed. Triggered API search for "${inputText}"`,
                time: new Date().toLocaleTimeString().split(' ')[0],
              },
              ...prevLogs
            ]);
            return 100;
          }
          return prev + 10; // fills in 10 steps (50ms increments for 500ms)
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeTimer, inputText]);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-500" />
            Debounce Mechanism Visualizer
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            A visual trace of keystrokes cancelling previous scheduled execution timers during a 500ms debounce window.
          </p>
        </div>

        <button
          onClick={simulateTyping}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 fill-current" /> Run Rapid Typing Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timing and Visual gauges */}
        <div className="lg:col-span-6 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950/40 space-y-5">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Debounce Gauges</h4>

          {/* Simulated Input Field Display */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Interactive Input Value</span>
            <div className="relative">
              <input
                type="text"
                value={inputText}
                readOnly
                placeholder="Simulating keystrokes..."
                className="px-3.5 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-mono w-full focus:outline-none"
              />
              {activeTimer && (
                <span className="absolute right-3 top-3 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
          </div>

          {/* Delay Countdown gauge */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase">
              <span>Debounce Delay Progress (500ms Window)</span>
              <span className="text-indigo-500 font-bold">{timerProgress}%</span>
            </div>
            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
              <div 
                className={`h-full transition-all duration-75 ${
                  timerProgress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${timerProgress}%` }}
              />
            </div>
          </div>

          {/* Finalized Query */}
          <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Resulting Query Dispatched to API</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-zinc-500">query =</span>
              {debouncedValue ? (
                <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> "{debouncedValue}"
                </span>
              ) : (
                <span className="text-xs italic text-zinc-400">Waiting for typing to pause for &gt; 500ms...</span>
              )}
            </div>
          </div>
        </div>

        {/* Logs console */}
        <div className="lg:col-span-6 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-950/20 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Internal Event Logs (Console trace)</h4>
            
            <div className="space-y-2 h-[200px] overflow-y-auto font-mono text-[11px] border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 p-3 leading-5">
              {eventsLog.length === 0 ? (
                <div className="text-zinc-400 text-center py-12 italic">
                  Press "Run Rapid Typing Simulation" above to trace debounce events...
                </div>
              ) : (
                eventsLog.map(log => {
                  let badgeColor = 'text-zinc-500';
                  if (log.type === 'keypress') badgeColor = 'text-sky-500 font-semibold';
                  else if (log.type === 'cancel') badgeColor = 'text-amber-500 font-semibold';
                  else if (log.type === 'api') badgeColor = 'text-emerald-500 font-bold';

                  return (
                    <div key={log.id} className="border-b border-zinc-100 dark:border-zinc-900/50 pb-1 flex justify-between items-start gap-2">
                      <span className={badgeColor}>{log.text}</span>
                      <span className="text-[9px] text-zinc-400 shrink-0">{log.time}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 border-t border-zinc-200/30 dark:border-zinc-800/30 pt-3 mt-4">
            ℹ️ <strong>Interview Classic:</strong> Debouncing wraps function dispatch inside a `setTimeout`. Every keystroke calls `clearTimeout(timerId)` to cancel previous timers. This blocks API endpoints from being hammered during typing.
          </div>
        </div>
      </div>
    </div>
  );
}
