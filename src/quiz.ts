import { questions } from "./questions";
import type { Question, QuestionSet } from "./types";

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
};

export function createQuiz(questionSet: QuestionSet, size = 10): Question[] {
  return shuffle(questions.filter((question) => question.set === questionSet)).slice(0, size);
}

export function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isTextAnswerCorrect(question: Question, answer: string): boolean {
  const accepted = question.acceptedAnswers ?? (question.answer ? [question.answer] : []);
  return accepted.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
}
