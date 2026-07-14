import type { Language, Question, TestResult } from "./types";

interface PendingRun {
  resolve: (value: PythonResponse) => void;
  reject: (reason: Error) => void;
  timeout: number;
  language: Language;
}

export interface ExecutionResult {
  consoleOutput: string;
  previewInputs: Record<string, unknown>;
  resultVariable?: string;
  resultValue?: string;
}

interface PythonResponse extends ExecutionResult {
  results?: TestResult[];
}

class PythonRunner {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRun>();

  private createWorker() {
    this.worker = new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
    this.worker.onmessage = (event) => {
      const { type, id, results, consoleOutput, previewInputs, resultVariable, resultValue, error } = event.data;
      if (!id) return;
      const run = this.pending.get(id);
      if (!run) return;
      if (type === "running") {
        window.clearTimeout(run.timeout);
        run.timeout = window.setTimeout(() => this.timeoutRun(id), 6000);
        return;
      }
      window.clearTimeout(run.timeout);
      this.pending.delete(id);
      if (type === "result" || type === "execute-result") run.resolve({ results, consoleOutput, previewInputs, resultVariable, resultValue });
      if (type === "error") run.reject(new Error(error));
    };
  }

  private timeoutRun(id: string) {
    const run = this.pending.get(id);
    if (!run) return;
    this.pending.delete(id);
    this.worker?.terminate();
    this.worker = null;
    run.reject(new Error(run.language === "fr" ? "Le code a dépassé la limite de temps." : "The code exceeded the time limit."));
  }

  private request(mode: "execute" | "grade", question: Question, code: string, language: Language) {
    if (!this.worker) this.createWorker();
    const id = crypto.randomUUID();

    return new Promise<PythonResponse>((resolve, reject) => {
      const timeout = window.setTimeout(() => this.timeoutRun(id), 60000);

      this.pending.set(id, { resolve, reject, timeout, language });
      this.worker?.postMessage({
        id,
        mode,
        code,
        resultVariable: question.resultVariable,
        tests: mode === "grade" ? question.tests : undefined,
        previewInputs: mode === "execute" ? question.tests?.[0]?.inputs ?? {} : undefined,
        language,
      });
    });
  }

  execute(question: Question, code: string, language: Language): Promise<ExecutionResult> {
    return this.request("execute", question, code, language);
  }

  async grade(question: Question, code: string, language: Language) {
    const response = await this.request("grade", question, code, language);
    return { results: response.results ?? [], consoleOutput: response.consoleOutput };
  }
}

export const pythonRunner = new PythonRunner();
