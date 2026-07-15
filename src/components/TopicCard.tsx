import React, { useState } from 'react';
import { Topic } from '../types';
import { HighlightCode } from './HighlightCode';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, Quote, RefreshCw, Bookmark } from 'lucide-react';

// Import animations
import RenderCycleAnimation from './animations/RenderCycleAnimation';
import ReconciliationKeysAnimation from './animations/ReconciliationKeysAnimation';
import UseStateSnapshotAnimation from './animations/UseStateSnapshotAnimation';
import UseEffectTimelineAnimation from './animations/UseEffectTimelineAnimation';
import PerformanceReRenderAnimation from './animations/PerformanceReRenderAnimation';
import OneWayDataFlowAnimation from './animations/OneWayDataFlowAnimation';
import PatternsAnimation from './animations/PatternsAnimation';
import InterviewClassicsAnimation from './animations/InterviewClassicsAnimation';

interface TopicCardProps {
  topic: Topic;
  theme: 'light' | 'dark';
}

export function TopicCard({ topic, theme }: TopicCardProps) {
  const [openQuestionIds, setOpenQuestionIds] = useState<Record<string, boolean>>({});
  const [hookTab, setHookTab] = useState<'snapshot' | 'useEffect'>('snapshot');

  const toggleQuestion = (id: string) => {
    setOpenQuestionIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Map topic IDs to correct interactive animation
  const renderAnimation = () => {
    switch (topic.id) {
      case 'mental-model':
      case 'render-vs-commit':
        return <RenderCycleAnimation />;
      case 'reconciliation-keys':
        return <ReconciliationKeysAnimation />;
      case 'props-vs-state':
        return <OneWayDataFlowAnimation />;
      case 'hooks-deep-dive':
        return (
          <div className="space-y-6">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded max-w-sm border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setHookTab('snapshot')}
                className={`flex-1 py-2 text-xs font-bold rounded transition-all ${
                  hookTab === 'snapshot'
                    ? 'bg-white dark:bg-slate-950 shadow-sm text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                useState Closures
              </button>
              <button
                onClick={() => setHookTab('useEffect')}
                className={`flex-1 py-2 text-xs font-bold rounded transition-all ${
                  hookTab === 'useEffect'
                    ? 'bg-white dark:bg-slate-950 shadow-sm text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                useEffect Chronology
              </button>
            </div>
            {hookTab === 'snapshot' ? <UseStateSnapshotAnimation /> : <UseEffectTimelineAnimation />}
          </div>
        );
      case 'rendering-performance':
        return <PerformanceReRenderAnimation />;
      case 'advanced-patterns':
        return <PatternsAnimation />;
      case 'interview-classics':
        return <InterviewClassicsAnimation />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10" id={`topic-card-${topic.id}`}>
      
      {/* 1. Header and Explanation */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
          {topic.title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
          {topic.shortDescription}
        </p>

        {/* Technical breakdown block styled as modern geometric card */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4 font-sans">
          {topic.explanation.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('Key Mechanics:') || paragraph.startsWith('Core Hooks Explanations:') || paragraph.startsWith('Optimizations:')) {
              return (
                <div key={idx} className="font-extrabold text-slate-800 dark:text-slate-200 mt-2 font-mono text-xs uppercase tracking-widest text-blue-500">
                  {paragraph}
                </div>
              );
            }
            if (/^\d+\./.test(paragraph) || paragraph.startsWith('-') || paragraph.startsWith('*')) {
              // List items
              return (
                <div key={idx} className="pl-4 border-l-2 border-blue-500 space-y-2 text-xs md:text-sm">
                  {paragraph.split('\n').map((li, i) => (
                    <div key={i}>{li}</div>
                  ))}
                </div>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>
      </div>

      {/* 2. Interactive Animation/Visualization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-blue-500 rounded-sm"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Interactive Mechanism Sandbox
            </h3>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Sandbox Simulator
          </span>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          {renderAnimation()}
        </div>
      </div>

      {/* 3. Angular Reframe Comparison Callout */}
      {topic.angularReframe && (
        <div className="p-6 rounded-xl border-l-4 border-rose-500 bg-rose-500/5 dark:bg-rose-500/10 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-rose-500">Angular Reframe:</span>
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {topic.angularReframe.concept} ➔ {topic.angularReframe.angularCounterpart}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {topic.angularReframe.explanation}
          </p>
        </div>
      )}

      {/* 4. Minimal Code Snippet */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Rigorously Annotated Code Blueprint</h3>
        <HighlightCode code={topic.codeExample.code} theme={theme} />
      </div>

      {/* 5. Misconception & Interview Trap */}
      <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 flex gap-4 shadow-xs">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Common Misconception & Interview Trap</h4>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {topic.misconception}
          </p>
        </div>
      </div>

      {/* 6. Interview One-liner Quote card (Stark Slate Style) */}
      <div className="p-6 bg-slate-900 dark:bg-slate-950 rounded-xl text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
        <Quote className="w-24 h-24 text-slate-800 dark:text-slate-900/60 absolute -top-4 -left-4 -z-10 opacity-70" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block">Interview Answer Pro-Tip</span>
          <p className="text-base md:text-lg font-medium text-slate-100 italic leading-snug">
            "{topic.interviewOneLiner}"
          </p>
        </div>
      </div>

      {/* 7. Hidden Self-Tests Accordions */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          Rigorous Self-Test Questions
        </h3>
        
        <div className="space-y-3">
          {topic.selfTests.map((test) => {
            const isOpen = !!openQuestionIds[test.id];
            
            return (
              <div 
                key={test.id} 
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
              >
                <button
                  onClick={() => toggleQuestion(test.id)}
                  className="w-full p-4 text-left font-sans font-bold text-sm md:text-base flex justify-between items-center text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <span>{test.question}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 rotate-180 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 block mb-1">Answer explanation</span>
                    {test.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
