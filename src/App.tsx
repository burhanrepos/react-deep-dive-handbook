import React, { useState, useEffect } from 'react';
import { TOPICS } from './data';
import { TopicCard } from './components/TopicCard';
import { Topic } from './types';
import { BookOpen, Moon, Sun, Search, GraduationCap, ChevronRight, Menu, X, ArrowUp } from 'lucide-react';

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('mental-model');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync theme to root class for Tailwind CSS
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Handle scroll top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  // Filter topics by title or shortDescription
  const filteredTopics = TOPICS.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const selectTopic = (id: string) => {
    setSelectedTopicId(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedIdx = TOPICS.findIndex((t) => t.id === selectedTopic.id);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 flex flex-col ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. Header Navbar (Geometric Balance Header Style) */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors h-16 shrink-0 ${
        theme === 'dark' ? 'bg-slate-950/90 border-slate-900' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 md:hidden hover:bg-slate-100 dark:hover:bg-slate-900 rounded"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400 font-mono text-xs md:text-sm font-semibold tracking-wider">
                {selectedIdx + 1 < 10 ? `0${selectedIdx + 1}` : selectedIdx + 1} / {TOPICS.length < 10 ? `0${TOPICS.length}` : TOPICS.length}
              </span>
              <span className="text-slate-300 select-none hidden sm:inline">|</span>
              <h2 className="text-slate-800 dark:text-slate-200 font-bold font-sans text-xs sm:text-sm md:text-base tracking-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {selectedTopic.title.replace(/^\d+\.\s*/, '')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Prev / Next buttons from standard design */}
            <div className="flex gap-2">
              <button
                disabled={selectedIdx === 0}
                onClick={() => selectTopic(TOPICS[selectedIdx - 1].id)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                PREV
              </button>
              <button
                disabled={selectedIdx === TOPICS.length - 1}
                onClick={() => selectTopic(TOPICS[selectedIdx + 1].id)}
                className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 rounded text-xs font-bold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                NEXT
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded border transition-all ${
                theme === 'dark' 
                  ? 'border-slate-800 hover:bg-slate-900 text-amber-400' 
                  : 'border-slate-200 hover:bg-slate-100 text-blue-600'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Layout */}
      <div className="max-w-7xl w-full mx-auto flex flex-1 items-stretch">
        
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-80 border-r border-slate-800 bg-slate-900 flex flex-col justify-between transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div>
            {/* Sidebar header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h1 className="text-white text-base md:text-lg font-black tracking-tight uppercase">React Mechanism</h1>
                <p className="text-slate-400 text-[10px] mt-0.5 font-mono tracking-widest uppercase">Mastery for Seniors</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-slate-800 md:hidden text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter bar */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/20">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter key concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* List of topics with Geometric design */}
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)]">
              {filteredTopics.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No matching chapters found.
                </div>
              ) : (
                filteredTopics.map((topic, index) => {
                  const isActive = topic.id === selectedTopicId;
                  const displayIndex = TOPICS.findIndex(t => t.id === topic.id) + 1;
                  const numStr = displayIndex < 10 ? `0${displayIndex}` : `${displayIndex}`;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic.id)}
                      className={`w-full text-left py-3 px-4 transition flex items-center justify-between group rounded border border-transparent ${
                        isActive
                          ? 'bg-blue-600/10 border-l-4 border-l-blue-500 border-y-slate-800/40 border-r-slate-800/40 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-baseline gap-2.5 truncate">
                        <span className={`font-mono text-xs shrink-0 ${isActive ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
                          {numStr}
                        </span>
                        <div className="truncate">
                          <span className="text-xs md:text-sm font-sans block truncate">{topic.title.replace(/^\d+\.\s*/, '')}</span>
                          <span className={`text-[10px] block font-light truncate max-w-[190px] mt-0.5 ${
                            isActive ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {topic.shortDescription}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition ${
                        isActive ? 'text-blue-400' : 'text-slate-600 group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  );
                })
              )}
            </nav>
          </div>

          {/* Sidebar Footer with path details */}
          <div className="p-5 bg-slate-950 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-300 text-[10px] font-bold tracking-wider font-mono uppercase">Angular ➔ React Path</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">
              v1.0.0 • Developed for Senior Re-tooling
            </span>
          </div>
        </aside>

        {/* Mobile Overlay backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
          />
        )}

        {/* Main Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl overflow-hidden flex flex-col justify-between">
          <div>
            {/* Senior / Angular welcome banner (Geometric Balance Style) */}
            <div className="mb-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Senior Retrospective Guide
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-sans">
                  Welcome back, senior engineer. This visual playbook focuses on the hard structural truths of the React library: execution timings, closures, reconciliation, and reference identities. Perfect for solidifying mental models and senior interview prep.
                </p>
              </div>
              
              <div className="text-xs border border-slate-200 dark:border-slate-800 px-3 py-2 rounded bg-slate-50 dark:bg-slate-950 font-mono text-slate-500 flex flex-col items-center shrink-0">
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Audience Level:</span>
                <span className="font-extrabold text-blue-500 mt-0.5">4+ Years (Angular Dev)</span>
              </div>
            </div>

            {/* Selected Topic Content Rendering */}
            <TopicCard topic={selectedTopic} theme={theme} />
          </div>

          {/* Status Bar Footer from standard design */}
          <footer className="mt-16 h-12 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-1 shrink-0">
            <span>Session: React Deep Dive v4.2.1</span>
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> 
                Lesson Active
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div> 
                Quiz Unlocked
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* Scroll to top utility button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition z-50"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
