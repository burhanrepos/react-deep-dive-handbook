import React, { useState } from 'react';
import { Play, RotateCcw, Plus, Trash2, Layers, AlertCircle, CheckCircle } from 'lucide-react';

interface ListItem {
  id: string;
  name: string;
  color: string;
}

const INITIAL_ITEMS: ListItem[] = [
  { id: 'item-1', name: 'Learn React Hooks', color: 'bg-teal-500/10 border-teal-500' },
  { id: 'item-2', name: 'Master Reconciliation', color: 'bg-indigo-500/10 border-indigo-500' },
  { id: 'item-3', name: 'Build Awesome Demos', color: 'bg-purple-500/10 border-purple-500' },
];

export default function ReconciliationKeysAnimation() {
  const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS);
  const [lastAction, setLastAction] = useState<'idle' | 'inserted'>('idle');
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    '0': 'Draft 1',
    '1': 'Draft 2',
    '2': 'Draft 3',
    'item-1': 'Draft 1',
    'item-2': 'Draft 2',
    'item-3': 'Draft 3',
  });

  const handleInsertTop = () => {
    const newItem: ListItem = {
      id: `item-${Date.now()}`,
      name: 'Review Angular Vs React',
      color: 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400',
    };
    
    // Shift input values for index-based tracking (since index 0 shifts to index 1, etc.)
    setInputValues(prev => {
      const nextInputs: Record<string, string> = { ...prev };
      // Move values up
      nextInputs['3'] = prev['2'] || '';
      nextInputs['2'] = prev['1'] || '';
      nextInputs['1'] = prev['0'] || '';
      nextInputs['0'] = ''; // new empty draft for top index
      return nextInputs;
    });

    setItems([newItem, ...items]);
    setLastAction('inserted');
    
    // Auto-reset highlight after transition
    setTimeout(() => {
      setLastAction('idle');
    }, 2000);
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setLastAction('idle');
    setInputValues({
      '0': 'Draft 1',
      '1': 'Draft 2',
      '2': 'Draft 3',
      'item-1': 'Draft 1',
      'item-2': 'Draft 2',
      'item-3': 'Draft 3',
    });
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Stable Keys vs. Index Keys Visualizer
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Observe how React reuses DOM elements. Insert a new item at the top and look at the visual feedback.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleInsertTop}
            disabled={items.length >= 4}
            className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Prepended Item at Index 0
          </button>
          <button
            onClick={handleReset}
            className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Reset Items"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        
        {/* WRONG: INDEX KEYS */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Incorrect: key=&#123;index&#125;</h4>
            </div>
            <div className="text-[10px] font-mono bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded font-bold uppercase">
              Mutative Reuse
            </div>
          </div>

          <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
            React maps the virtual node to the real DOM using <strong>index</strong>. When prepending, index 0 becomes index 1. React matches index 0 of previous render with index 0 of current render, mutating its contents instead of moving it!
          </p>

          <div className="space-y-3">
            {items.map((item, index) => {
              const isNewTop = lastAction === 'inserted' && index === 0;
              const hasShifted = lastAction === 'inserted' && index > 0;
              
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-2 relative ${
                    isNewTop ? 'border-amber-500 bg-amber-500/10' :
                    hasShifted ? 'border-rose-400 bg-rose-400/10 text-rose-700 dark:text-rose-300' :
                    'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                  }`}
                >
                  {/* Highlight indicators */}
                  {hasShifted && (
                    <span className="absolute -top-1.5 -left-1.5 text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow">
                      <AlertCircle className="w-2.5 h-2.5" /> DOM Mutated
                    </span>
                  )}
                  {isNewTop && (
                    <span className="absolute -top-1.5 -left-1.5 text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow">
                      <AlertCircle className="w-2.5 h-2.5" /> Replaced Element 0
                    </span>
                  )}

                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-zinc-400">key={index}</span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{item.name}</span>
                  </div>

                  {/* Component state inputs to show state bug */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-mono">DOM State:</span>
                    <input
                      type="text"
                      value={inputValues[index.toString()] || ''}
                      onChange={(e) => setInputValues({ ...inputValues, [index.toString()]: e.target.value })}
                      className="px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-950 font-mono text-zinc-700 dark:text-zinc-300 w-24 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-2.5 rounded bg-rose-500/5 border border-rose-500/10 text-[11px] text-rose-500/90 font-mono flex gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>State Bug:</strong> The draft text inputs stayed locked to their indices! 'Draft 1' remained in index 0, even though the text shifted. This causes severe UI glitches with inputs, focus, and stateful widgets.
            </span>
          </div>
        </div>

        {/* RIGHT: STABLE ID KEYS */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Correct: key=&#123;item.id&#125;</h4>
            </div>
            <div className="text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
              Instance Preserved
            </div>
          </div>

          <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
            By mapping key to <strong>unique stable IDs</strong>, React identifies that existing items merely translated downward. It keeps their physical DOM elements and state inputs fully intact, only appending the new node at the top.
          </p>

          <div className="space-y-3">
            {items.map((item, index) => {
              const isNewTop = lastAction === 'inserted' && index === 0;
              
              return (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-lg border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-2 relative ${
                    isNewTop ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                  }`}
                >
                  {isNewTop && (
                    <span className="absolute -top-1.5 -left-1.5 text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow animate-bounce">
                      <CheckCircle className="w-2.5 h-2.5" /> Added Smoothly
                    </span>
                  )}

                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-zinc-400">key='{item.id}'</span>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{item.name}</span>
                  </div>

                  {/* Input state tied properly to stable IDs */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-mono">DOM State:</span>
                    <input
                      type="text"
                      value={inputValues[item.id] || ''}
                      onChange={(e) => setInputValues({ ...inputValues, [item.id]: e.target.value })}
                      className="px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-950 font-mono text-zinc-700 dark:text-zinc-300 w-24 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Perfect Sync:</strong> The drafts stayed in sync with their respective items ('Draft 1' moves along with 'Learn React Hooks'). Perfect preservation of component instances and state!
            </span>
          </div>
        </div>

      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
        <strong>💡 Key Interview Takeaway</strong>: The `key` prop is NOT a component prop; it is an instructions hint for React's diffing engine. Using stable keys ensures that React matches previous fiber nodes to the exact same physical DOM node. Never use indices, random numbers, or generated UUIDs at render time for key values!
      </div>
    </div>
  );
}
