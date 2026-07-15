export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface CodeExample {
  title: string;
  code: string;
  language: 'typescript' | 'javascript' | 'json';
}

export interface Topic {
  id: string;
  title: string;
  shortDescription: string;
  explanation: string; // Markdown or structured text
  codeExample: CodeExample;
  misconception: string;
  interviewOneLiner: string;
  selfTests: Question[];
  angularReframe?: {
    concept: string;
    angularCounterpart: string;
    explanation: string;
  };
}
