export type Language = "en" | "fr";
export type Difficulty = "easy" | "medium" | "hard";
export type QuestionSet = Difficulty | "mixed";
export type Topic = "variables" | "types" | "conditions" | "loops" | "lists";
export type QuestionType = "multiple-choice" | "output" | "fill" | "code";

export type LocalizedText = Record<Language, string>;

export interface CodeTest {
  label: LocalizedText;
  inputs: Record<string, unknown>;
  expected: unknown;
}

export interface Question {
  id: string;
  set: QuestionSet;
  topic: Topic;
  difficulty: Difficulty;
  type: QuestionType;
  prompt: LocalizedText;
  codeSnippet?: string;
  choices?: string[];
  answer?: string;
  acceptedAnswers?: string[];
  explanation: LocalizedText;
  starterCode?: string;
  resultVariable?: string;
  tests?: CodeTest[];
}

export interface TestResult {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface AnswerRecord {
  questionId: string;
  topic: Topic;
  correct: boolean;
}
