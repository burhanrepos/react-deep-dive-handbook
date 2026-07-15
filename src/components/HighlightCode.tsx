import React from 'react';

interface HighlightCodeProps {
  code: string;
  theme: 'light' | 'dark';
}

export function HighlightCode({ code, theme }: HighlightCodeProps) {
  // Simple but visually stunning syntax highlighter for React code snippets
  const lines = code.split('\n');

  const highlightLine = (line: string) => {
    if (!line.trim()) return <span>&nbsp;</span>;

    // Tokens matching regex
    const rules = [
      // Comments
      { regex: /(\/\/.*)$/, className: theme === 'dark' ? 'text-zinc-500 italic' : 'text-zinc-400 italic' },
      // String literals
      { regex: /(["'`].*?["'`])/, className: theme === 'dark' ? 'text-amber-300' : 'text-amber-700' },
      // Key hooks
      { regex: /\b(useState|useEffect|useRef|useMemo|useCallback|useReducer|useContext)\b/, className: 'text-sky-400 font-semibold' },
      // React keywords
      { regex: /\b(React|memo|createElement|VirtualDOM)\b/, className: 'text-indigo-400' },
      // TypeScript/JavaScript keywords
      { regex: /\b(const|let|var|function|return|export|default|import|from|class|extends|if|else|for|while|new|typeof|void|async|await|try|catch|as|interface|type)\b/g, className: 'text-purple-400 font-semibold' },
      // Primitive values
      { regex: /\b(true|false|null|undefined|count|state|props)\b/g, className: 'text-orange-400' },
      // Custom functions/Components
      { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, className: 'text-teal-400 font-medium' },
    ];

    // Split and highlight sequentially by tokenizing
    let html: React.ReactNode[] = [line];

    // For safety and simplicity, we can do keyword coloring by splitting the line into words & characters.
    // However, an elegant approach is to split the line by standard separators (spaces, parentheses, curly braces, angle brackets)
    // and style matching pieces.
    const parts = line.split(/(\s+|\(|\)|\{|\}|\[|\]|<|>|\.|,|;|:|=|\+|-|\*|\/)/);
    
    return (
      <div className="font-mono text-sm leading-6">
        {parts.map((part, idx) => {
          if (!part) return null;
          
          // Style checking
          // Comments
          if (part.startsWith('//')) {
            return <span key={idx} className={theme === 'dark' ? 'text-zinc-500 italic' : 'text-zinc-400 italic'}>{part}</span>;
          }
          // Quotes
          if (/^["'`](.*)["'`]$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}>{part}</span>;
          }
          // Keywords
          if (/^(const|let|var|function|return|export|default|import|from|class|extends|if|else|for|while|new|typeof|void|async|await|try|catch|as|interface|type)$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-rose-400 font-medium' : 'text-rose-600 font-semibold'}>{part}</span>;
          }
          // React Hooks & features
          if (/^(useState|useEffect|useRef|useMemo|useCallback|useReducer|useContext|memo)$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-sky-400 font-semibold' : 'text-sky-600 font-semibold'}>{part}</span>;
          }
          // Primitive constants
          if (/^(true|false|null|undefined)$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-amber-500' : 'text-amber-600'}>{part}</span>;
          }
          // Numbers
          if (/^\d+$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}>{part}</span>;
          }
          // React custom components/classes
          if (/^[A-Z][a-zA-Z0-9_]*$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-teal-400 font-semibold' : 'text-teal-600 font-semibold'}>{part}</span>;
          }
          // Built-in attributes or HTML tags in JSX (e.g. div, button)
          if (/^(div|button|span|h1|h2|p|ul|li|input|section|nav|header|footer|svg|path|label|form)$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>{part}</span>;
          }
          // Logical syntax symbols
          if (/^(=|\+|-|\*|\/|=>|===|==|&&|\|\|)$/.test(part)) {
            return <span key={idx} className={theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}>{part}</span>;
          }

          return <span key={idx} className={theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <pre className={`p-4 rounded-xl font-mono text-sm overflow-x-auto border ${
      theme === 'dark' 
        ? 'bg-slate-950 border-slate-800 text-slate-100' 
        : 'bg-slate-50 border-slate-200 text-slate-800'
    }`}>
      <code>
        {lines.map((line, i) => (
          <div key={i} className="flex select-none">
            <span className="w-8 inline-block text-right pr-4 text-slate-500 text-xs select-none border-r border-slate-800/10 dark:border-slate-100/10 mr-4">
              {i + 1}
            </span>
            <span className="flex-1">{highlightLine(line)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}
