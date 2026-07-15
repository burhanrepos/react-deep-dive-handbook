import { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'mental-model',
    title: '1. React Mental Model',
    shortDescription: 'Declarative rendering, UI = f(state), and the JSX Compilation pipeline.',
    explanation: `React is declarative. Instead of mutating DOM nodes directly (e.g., element.appendChild), you describe the state of your UI at any given point in time. React ensures the physical DOM matches that description.

Key Mechanics:
1. UI = f(state): Your user interface is a pure function of your state. Whenever state change occurs, the function is executed again.
2. JSX compilation: Browsers do not understand JSX. Babel or ESBuild compiles JSX tags into nested 'React.createElement()' (or modern runtime equivalent) calls.
3. Virtual DOM (VDOM): 'createElement()' returns a standard, lightweight JavaScript object representing the UI node (e.g., { type: 'div', props: { className: 'card', children: [...] } }). This node object is cheap to create and destroy in memory.`,
    codeExample: {
      title: 'JSX Compilation Output',
      code: `// This JSX code written in your IDE:
const element = <button className="btn">Click me</button>;

// Compiles down to this nested JS call:
const elementCompiled = React.createElement(
  'button',
  { className: 'btn' },
  'Click me'
);

// Which returns a plain JavaScript object (Virtual DOM Node):
// {
//   type: 'button',
//   props: {
//     className: 'btn',
//     children: 'Click me'
//   }
// }`,
      language: 'typescript',
    },
    misconception: 'Developers often assume that the Virtual DOM is a faster, miniature copy of the actual browser DOM that runs in a separate thread. In reality, the Virtual DOM is simply nested, plain JavaScript objects stored in the standard browser heap and executed synchronously in the main UI thread.',
    interviewOneLiner: 'React is a declarative library where UI is a function of state; JSX compiles to nested React.createElement calls that produce a lightweight Virtual DOM tree describing the desired view.',
    angularReframe: {
      concept: 'Declarative Templates vs. Directives',
      angularCounterpart: 'Angular HTML Templates & Directives',
      explanation: 'Unlike Angular which parses actual HTML template files with special syntax directives (*ngIf, [property]) and compiles them into a custom incremental DOM instruction set, React templates are standard JavaScript functions that return object-trees (Virtual DOM) directly via JSX.',
    },
    selfTests: [
      {
        id: 'q1-1',
        question: 'Does JSX compile to HTML or JS?',
        answer: 'JSX compiles entirely to standard JavaScript (React.createElement calls). It has no relation to HTML other than visual syntax mapping. At runtime, only plain JS objects are processed in memory.',
      },
      {
        id: 'q1-2',
        question: 'Why is Virtual DOM manipulation cheap compared to Real DOM updates?',
        answer: 'Real DOM updates trigger expensive browser processes (reflow and repaint). Virtual DOM nodes are just lightweight plain JavaScript objects. Comparing or rewriting these JS objects in memory is extremely fast; the expensive real DOM is only touched once differences are computed.',
      }
    ],
  },
  {
    id: 'render-vs-commit',
    title: '2. Render vs. DOM Update',
    shortDescription: 'The 3-step cycle: Trigger, Render (Function Runs), Reconcile, and Commit.',
    explanation: `One of the most critical interview hurdles is understanding that "re-rendering" does NOT mean updating the browser DOM. The process is strictly divided into three phases:

1. Trigger: A state change occurs (via useState's setter, useReducer, context update, or parent re-rendering).
2. Render (Function Execution): React executes your component function to obtain the new Virtual DOM tree. This is purely calculating the description of the UI (completely cheap).
3. Commit (Reconciliation & Paint): React compares (diffs) the new Virtual DOM tree with the old one. It identifies the differences and applies *only* those differences to the real DOM. The browser then paints the screen.`,
    codeExample: {
      title: 'Render vs Commit Example',
      code: `export default function Timer() {
  const [time, setTime] = useState(0);

  // Trigger: setTime triggers a new cycle
  // Render: React re-runs Timer() and generates a new <div> description.
  // Commit: React diffs the previous text "0" with "1".
  // It updates only the inner text node in the browser. 
  // The outer <div> remains completely untouched.
  return (
    <div className="container">
      <h1>Session Active</h1>
      <button onClick={() => setTime(t => t + 1)}>
        Seconds: {time}
      </button>
    </div>
  );
}`,
      language: 'typescript',
    },
    misconception: 'Thinking that a component re-rendering automatically means that the entire DOM structure of that component is destroyed and rebuilt. In reality, React completely re-runs the JavaScript function, but preserves the physical DOM nodes, changing only the specific property/text values that updated.',
    interviewOneLiner: 'Render is the execution of component functions to generate a new Virtual DOM tree description, whereas Commit is the selective reconciliation process that updates only the changed physical DOM nodes.',
    angularReframe: {
      concept: 'Change Detection',
      angularCounterpart: 'Zone.js & Change Detection Cycles',
      explanation: 'In Angular, Zone.js monkey-patches asynchronous events and triggers a top-down check of the template binding trees. React does not use Zone.js or intercept async triggers; it relies purely on explicit state change triggers (setState) to schedule component re-runs.',
    },
    selfTests: [
      {
        id: 'q2-1',
        question: 'If a component re-renders, does it guarantee a real DOM change?',
        answer: 'No. A component re-rendering just means its function ran and calculated a new Virtual DOM description. If the new Virtual DOM is identical to the previous one, the reconciliation diff finds zero differences, and the physical DOM is never touched.',
      },
      {
        id: 'q2-2',
        question: 'Which phase of the React cycle is synchronous vs. asynchronous?',
        answer: 'The Render phase (running functions and diffing) is handled in memory and can be split/paused under Concurrent Mode. However, the Commit phase (applying changes to the physical browser DOM) is strictly synchronous to prevent visual flickering or partial UI updates.',
      }
    ],
  },
  {
    id: 'reconciliation-keys',
    title: '3. Reconciliation and Keys',
    shortDescription: 'The diffing algorithm heuristic, stable identities, and index-key traps.',
    explanation: `React uses a heuristic diffing algorithm with O(n) complexity based on two assumptions:
1. Two elements of different types will produce different trees.
2. The developer can hint at which child elements are stable across renders with a 'key' prop.

The 'key' Prop is NOT a component prop. It is a critical instruction flag for React's diffing engine to track item identities across renders. 
- Using indices as keys: If items are reordered, inserted, or deleted at the top, the index of each item changes. React incorrectly matches previous indices to new items, destroying performance and causing state leak bugs in inputs or interactive widgets.`,
    codeExample: {
      title: 'Stable ID vs. Index Keys',
      code: `// ❌ THE INDEX KEY TRAP (Causes bugs if items are prepended/reordered)
items.map((item, index) => (
  <TodoItem key={index} data={item} />
));

// ✅ CORRECT: STABLE ID KEYS (Safely tracks component instance and state)
items.map((item) => (
  <TodoItem key={item.id} data={item} />
));`,
      language: 'typescript',
    },
    misconception: 'Using Math.random() or generating a UUID inside the map loop (e.g. key={Math.random()}). This is actually worse than index keys! On every single render, every item gets a brand new key. React is forced to completely destroy and re-create the DOM nodes of the entire list from scratch, wiping all focused inputs and keyboard cursors.',
    interviewOneLiner: 'Keys provide a stable identity for items in a list, allowing React to match virtual elements to physical DOM nodes correctly during reordering instead of destructively mutating stateful elements.',
    angularReframe: {
      concept: 'TrackBy Function',
      angularCounterpart: 'trackBy utility in *ngFor',
      explanation: 'React keys serve the exact same role as Angular trackBy. By default, *ngFor uses object identity; if a new list reference arrives, Angular rebuilds the entire DOM. trackBy forces identity mapping, just like React\'s key prop.',
    },
    selfTests: [
      {
        id: 'q3-1',
        question: 'Why do input fields break when using key={index} on prepending?',
        answer: 'When prepending, the new item gets index 0. React compares the previous index 0 (old first item) with the new index 0. It assumes the element is the same but props changed. It mutates the props, but any un-synced internal DOM states (like text typing in input elements or active scroll) remain on the DOM element of index 0, effectively leaking the state to the wrong item.',
      },
      {
        id: 'q3-2',
        question: 'Can you use a key outside of arrays?',
        answer: 'Yes! Placing a key on a single component (e.g., <Profile key={userId} />) tells React to completely tear down and recreate that component and its state whenever the key changes. This is a very clean pattern to reset form fields on routing.',
      }
    ],
  },
  {
    id: 'props-vs-state',
    title: '4. Props vs. State & Lifting Up',
    shortDescription: 'One-way data flow, structural immutability, and synchronization paradigms.',
    explanation: `React enforces strict one-way data flow (unidirectional data flow):

1. Props: Configuration objects passed down from the parent. They are read-only and structurally immutable in the child. A component cannot change its own props.
2. State: Private, mutable data managed internally by the component. Whenever state is updated, a re-render is scheduled for that component and its nested descendants.
3. Lifting State Up: To share state between two sibling components, you must lift the state to their closest common parent. The parent maintains the state and passes down the state value as a prop, and an update callback function (e.g., onAction) as another prop.`,
    codeExample: {
      title: 'Lifting State Up Pattern',
      code: `// Parent maintains the single source of truth
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ToggleButton checked={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <StatusPanel isOpen={isOpen} />
    </>
  );
}

// Child reads state and dispatches callbacks UP
function ToggleButton({ checked, onToggle }) {
  return (
    <button onClick={onToggle}>
      {checked ? 'Close Panel' : 'Open Panel'}
    </button>
  );
}`,
      language: 'typescript',
    },
    misconception: 'Attempting to copy props into local state to "sync" them (e.g. const [state, setState] = useState(props.value)). This creates a secondary source of truth. If props.value updates in the parent, the local state will NOT automatically update, leaving the child displaying stale data.',
    interviewOneLiner: 'Props are immutable configurations passed from above, while state is mutable local memory; to sync siblings, we lift state up to their closest common ancestor and pass callbacks down.',
    angularReframe: {
      concept: 'Two-way binding vs Callback Outputs',
      angularCounterpart: '@Input() and @Output() or [(ngModel)]',
      explanation: 'In Angular, you can establish direct two-way binding using [(ngModel)] or bananas-in-a-box syntax. React has NO built-in two-way binding. All mutations must be handled explicitly by triggering parent callback functions.',
    },
    selfTests: [
      {
        id: 'q4-1',
        question: 'What is wrong with modifying props directly?',
        answer: 'Props are read-only. Modifying a prop object directly (e.g., props.data.name = "John") bypasses React\'s state management, meaning React has no way of knowing a value changed, scheduling no re-renders and causing severe out-of-sync state bugs.',
      },
      {
        id: 'q4-2',
        question: 'How do you keep local state in sync with a prop without creating stale copies?',
        answer: 'Compute values on the fly during render rather than saving them in state, or use a "key" prop on the child to force a complete reset of the child when the prop identity changes.',
      }
    ],
  },
  {
    id: 'hooks-deep-dive',
    title: '5. Hooks Deep Dive',
    shortDescription: 'State snapshots, useEffect lifecycles, and structural references (useRef, useReducer).',
    explanation: `Hooks are the functional backbone of React, but they are built on strict rules.

Core Hooks Explanations:
1. useState Snapshot Behavior: State setters do NOT change the local state variable immediately. State is a constant snapshot tied to a specific render's execution closure. 
2. useEffect Timing: Fires asynchronously AFTER paint. Previous cleanup functions are evaluated before the new effect runs to prevent memory leaks.
3. useRef: Stashes a mutable value in ref.current that persists across renders. Mutating ref.current does NOT trigger re-renders. Great for DOM handles.
4. useReducer: A clean alternative to useState when multiple state variables are interdependent or state transitions are complex. Behaves like a mini-Redux in a single component.`,
    codeExample: {
      title: 'Hooks Nuances: Snapshot & Cleanups',
      code: `// 1. Snapshot Trap
const [count, setCount] = useState(0);
const handleClick = () => {
  setCount(count + 1); // setCount(0 + 1)
  setCount(count + 1); // setCount(0 + 1)
  setCount(count + 1); // setCount(0 + 1)
  // Value at next render will be 1, NOT 3!
  
  // To resolve, use functional updater:
  setCount(c => c + 1); // processes queued actions
};

// 2. useEffect Cleanup Sequence
useEffect(() => {
  const ws = new WebSocket('ws://api.com');
  
  return () => {
    // React triggers this BEFORE running setup again,
    // and when the component unmounts. Prevents leakage!
    ws.close();
  };
}, [url]);`,
      language: 'typescript',
    },
    misconception: 'Putting functions inside dependency arrays of useEffect without memoizing them first. Because inline functions are recreated on every render, the dependency reference is always new, causing the useEffect to run on every single render loop and defeating the purpose of the dependency array.',
    interviewOneLiner: 'useState values are frozen inside a render’s execution closure, while useEffect provides deferred post-paint side-effects that execute cleanups sequentially to maintain performance and safety.',
    angularReframe: {
      concept: 'Angular Signals & Lifecycle Hooks',
      angularCounterpart: 'ngOnInit, ngOnDestroy, and Signals',
      explanation: 'Angular Signals track updates dynamically via compiler-engineered graph dependencies, removing the need for a manually defined dependency array (like in useEffect). useEffect functions similarly to an effect() block combined with ngOnInit/ngOnDestroy.',
    },
    selfTests: [
      {
        id: 'q5-1',
        question: 'What happens if you violate the "Rules of Hooks" (e.g. call hook inside an "if" condition)?',
        answer: 'React relies on the absolute stability of Hook call orders. React matches hook values to state fibers sequentially based on the order they are called. Placing a hook inside a condition shifts the index, linking hook data to incorrect states and causing severe runtime crashes.',
      },
      {
        id: 'q5-2',
        question: 'How does useRef differ from useState in triggering component lifecycles?',
        answer: 'useRef creates a mutable object whose ref.current reference stays stable, and updating it does NOT schedule a render cycle. useState triggers a full re-render cycle whenever a new state value is dispatched.',
      }
    ],
  },
  {
    id: 'rendering-performance',
    title: '6. Performance & Re-renders',
    shortDescription: 'Triggering mechanics, React.memo, and referential equality (useMemo, useCallback).',
    explanation: `React renders top-down. If a parent component re-renders, ALL of its children re-render by default, regardless of whether their props changed!

Optimizations:
1. React.memo: Wraps a child component, performing a shallow comparison of props. If props are unchanged, React skips re-rendering the child entirely.
2. Referential Equality Trap: If you pass an object or a function inline as a prop to a memoized child, its prop reference changes on every render. This completely breaks React.memo!
3. useMemo: Memoizes the computed result of an expensive calculation, preserving its reference.
4. useCallback: Memoizes a function reference itself, preventing recreation across renders.`,
    codeExample: {
      title: 'Referential Integrity Optimization',
      code: `// Parent component
function Dashboard() {
  const [count, setCount] = useState(0);

  // ❌ Inline object breaks memo! Recreated on every render
  const config = { theme: 'dark' };

  // ❌ Inline callback breaks memo! Recreated on every render
  const handleSelect = () => console.log('Selected');

  // ✅ Fix with useMemo and useCallback
  const optimizedConfig = useMemo(() => ({ theme: 'dark' }), []);
  const optimizedSelect = useCallback(() => console.log('Selected'), []);

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Rerender</button>
      <MemoizedChild config={optimizedConfig} onSelect={optimizedSelect} />
    </>
  );
}`,
      language: 'typescript',
    },
    misconception: 'Wrapping absolutely every component in React.memo and memoizing every single primitive variable. Memoization is not free; it introduces overhead (shallow prop diffing and dependency array array-checking). Use it only when child render costs are high, or references are passed down to optimize deep structures.',
    interviewOneLiner: 'Parent re-renders trigger children re-renders by default; React.memo prevents this by shallowly diffing props, requiring stable references via useMemo and useCallback to succeed.',
    angularReframe: {
      concept: 'OnPush Change Detection',
      angularCounterpart: 'ChangeDetectionStrategy.OnPush',
      explanation: 'React.memo is the direct equivalent of Angular OnPush. OnPush instructs Angular to check a component subtree only if its @Input references change, bypassing the global change detection run.',
    },
    selfTests: [
      {
        id: 'q6-1',
        question: 'What does React.memo do when checking object references?',
        answer: 'React.memo performs a shallow comparison (Object.is) on keys of the old props and new props objects. If they refer to different objects in the heap, even if the content inside is identical, it treats them as changed and re-renders.',
      },
      {
        id: 'q6-2',
        question: 'Why does Context trigger re-renders, and how do we optimize it?',
        answer: 'When a Context value object changes, every component calling useContext(MyContext) is forced to re-render, bypassing React.memo. To optimize, split large contexts into multiple specialized contexts, or memoize the context value object.',
      }
    ],
  },
  {
    id: 'advanced-patterns',
    title: '7. Advanced Design Patterns',
    shortDescription: 'Controlled vs Uncontrolled, Compound Components, and Composition over inheritance.',
    explanation: `Senior React development is defined by proper structural design patterns:

1. Composition: Nesting components naturally via 'children' rather than writing deeply parameterized cards.
2. Compound Components: Creating a cohesive group of components that share state implicitly behind the scenes (e.g. Tabs and Tab panels). Uses Context to avoid prop-drilling.
3. Controlled vs Uncontrolled: Controlled components manage state in React; Uncontrolled components delegate state to the native browser DOM, queried via refs on-demand.`,
    codeExample: {
      title: 'Compound Components Pattern',
      code: `import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext<any>(null);

// 1. Parent manages state
export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
}

// 2. Children share context implicitly
Tabs.Trigger = function Trigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button 
      onClick={() => setActiveTab(value)}
      className={activeTab === value ? 'active font-bold' : ''}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div>{children}</div> : null;
};`,
      language: 'typescript',
    },
    misconception: 'Using Compound Components and prop drilling them through intermediate layers. The whole purpose of compound elements is that children can be placed anywhere in the layout hierarchy (thanks to implicit Context propagation), offering absolute layout freedom.',
    interviewOneLiner: 'Compound components implicitize shared context between nested children, facilitating expressive, customizable, and decluttered component APIs.',
    angularReframe: {
      concept: 'Content Projection & Child Queries',
      angularCounterpart: '<ng-content>, @ContentChildren, and Services',
      explanation: 'In Angular, compound-like behavior is built using <ng-content> and structural directives, queried via @ContentChildren. In React, this is achieved gracefully using standard JSX nesting and React Context provider wrappers.',
    },
    selfTests: [
      {
        id: 'q7-1',
        question: 'What is the main benefit of controlled components over uncontrolled ones?',
        answer: 'Controlled components give you instantaneous access to input state during typing. This is critical for active form validation, disabling buttons dynamically, autoformatting, and coordinating live input fields.',
      },
      {
        id: 'q7-2',
        question: 'Why is "Composition over Inheritance" crucial in React?',
        answer: 'React components are pure functional blocks. Composition (using props.children) provides a plug-and-play structure where containers can receive any content without relying on base class inheritance, making code modular and decoupled.',
      }
    ],
  },
  {
    id: 'interview-classics',
    title: '8. Senior Interview Classics',
    shortDescription: 'Core utility implementation: Debouncing, fetch-on-mount, and local storage state sync.',
    explanation: `These are standard, highly targeted coding prompts that distinguish juniors from seniors in live coding loops. They test:
1. Async control (race conditions, cleanup handlers).
2. Debouncing and memory leak prevention.
3. Custom hooks design (referential safety, state synchronization).`,
    codeExample: {
      title: 'Fetch-On-Mount with Cleanup (Anti-Race Condition)',
      code: `import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCurrent = true; // prevents race conditions
    setLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (isCurrent) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isCurrent) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false; // cancels stale setStates if url changes!
    };
  }, [url]);

  return { data, loading, error };
}`,
      language: 'typescript',
    },
    misconception: 'Writing a fetch operation inside useEffect without returning a cancellation or validity flag. If the component unmounts or URL changes before the API returns, React attempts to set state on an unmounted component (memory leak) or updates state with stale data (race condition).',
    interviewOneLiner: 'Robust API fetches inside useEffect require active boolean validity flags or AbortControllers to fully prevent race conditions during unmounts.',
    angularReframe: {
      concept: 'HTTP Client & RxJS',
      angularCounterpart: 'HttpClient and RxJS switchMap Observables',
      explanation: 'In Angular, race conditions are managed using RxJS operators like switchMap, which automatically cancel stale HTTP subscription streams. In React, we must explicitly write cleanup flags or AbortControllers inside our useEffect return statements.',
    },
    selfTests: [
      {
        id: 'q8-1',
        question: 'How do you handle rapid state changes in debounced search?',
        answer: 'You stash the active timeout handle inside a ref or standard useEffect return closure, making sure to call clearTimeout(timer) at the beginning of the next cycle. This fully blocks stale triggers from executing.',
      },
      {
        id: 'q8-2',
        question: 'Why should custom hooks memoize their return values?',
        answer: 'If a custom hook returns an un-memoized object or array (e.g. return [state, dispatch]), calling components receive a brand new reference on every single execution, causing intermediate dependency trees to completely break memoization.'
      }
    ],
  }
];
