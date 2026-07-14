import { useMemo, useState } from "react";
import { createQuiz, isTextAnswerCorrect } from "./quiz";
import { pythonRunner } from "./pythonRunner";
import type { ExecutionResult } from "./pythonRunner";
import type { AnswerRecord, Difficulty, Language, Question, TestResult, Topic } from "./types";

type Screen = "welcome" | "quiz" | "results";
type FeedbackState = { correct: boolean; tests?: TestResult[]; consoleOutput?: string; canRetry?: boolean };

const copy = {
  en: {
    eyebrow: "Python fundamentals",
    title: "Practice the logic.\nTrust your code.",
    intro: "A short, interactive workbook on variables, types, conditions, loops, and lists.",
    language: "Language",
    difficulty: "Choose your path",
    mixed: "Mixed practice",
    mixedHint: "A balanced set from easy to challenging",
    easy: "Foundations",
    easyHint: "Build confidence with the essentials",
    medium: "Practice",
    mediumHint: "Connect ideas and read code carefully",
    hard: "Challenge",
    hardHint: "Solve longer logic and coding tasks",
    start: "Start the workbook",
    noLogin: "No account · Results stay on this device",
    question: "Question",
    of: "of",
    run: "Run code",
    running: "Running…",
    submitCode: "Submit answer",
    submitting: "Checking answer…",
    previewRun: "Preview run",
    notGraded: "Not graded",
    previewInputs: "Preview inputs",
    noOutput: "No text was printed.",
    resultVariable: "Result variable",
    check: "Check answer",
    next: "Next question",
    results: "See my results",
    placeholder: "Type your answer",
    correct: "That’s right.",
    incorrect: "Not quite yet.",
    retryMessage: "Your answer is saved. Take another look and try once more before seeing the correction.",
    tryAgain: "Try again",
    correction: "Correction",
    expected: "Expected",
    received: "Received",
    console: "Program output",
    passed: "passed",
    scoreTitle: "Workbook complete",
    scoreLead: "You solved",
    scoreTail: "questions correctly.",
    topicBreakdown: "By topic",
    review: "Review notes",
    again: "Try another set",
    print: "Print results",
    emptyAnswer: "Add an answer before checking.",
    pythonError: "Python could not run this code",
    loadingNote: "The first run downloads Python in your browser and may take a few seconds.",
  },
  fr: {
    eyebrow: "Fondamentaux de Python",
    title: "Travaillez la logique.\nFaites confiance à votre code.",
    intro: "Un cahier interactif sur les variables, les types, les conditions, les boucles et les listes.",
    language: "Langue",
    difficulty: "Choisissez votre parcours",
    mixed: "Parcours mixte",
    mixedHint: "Un ensemble équilibré, du plus simple au plus exigeant",
    easy: "Fondations",
    easyHint: "Prenez confiance avec les notions essentielles",
    medium: "Entraînement",
    mediumHint: "Reliez les idées et lisez le code attentivement",
    hard: "Défi",
    hardHint: "Résolvez des exercices de logique plus avancés",
    start: "Commencer le cahier",
    noLogin: "Sans compte · Les résultats restent sur cet appareil",
    question: "Question",
    of: "sur",
    run: "Exécuter le code",
    running: "Exécution…",
    submitCode: "Soumettre la réponse",
    submitting: "Vérification…",
    previewRun: "Exécution d'essai",
    notGraded: "Non évalué",
    previewInputs: "Données d'essai",
    noOutput: "Aucun texte n'a été affiché.",
    resultVariable: "Variable résultat",
    check: "Vérifier la réponse",
    next: "Question suivante",
    results: "Voir mes résultats",
    placeholder: "Écrivez votre réponse",
    correct: "Bonne réponse.",
    incorrect: "Pas encore tout à fait.",
    retryMessage: "Votre réponse est conservée. Relisez la question et essayez encore une fois avant de voir la correction.",
    tryAgain: "Réessayer",
    correction: "Correction",
    expected: "Attendu",
    received: "Obtenu",
    console: "Sortie du programme",
    passed: "réussis",
    scoreTitle: "Cahier terminé",
    scoreLead: "Vous avez résolu correctement",
    scoreTail: "questions.",
    topicBreakdown: "Par notion",
    review: "Notes de révision",
    again: "Essayer une autre série",
    print: "Imprimer les résultats",
    emptyAnswer: "Ajoutez une réponse avant de vérifier.",
    pythonError: "Python n'a pas pu exécuter ce code",
    loadingNote: "Au premier lancement, Python est téléchargé dans le navigateur. Cela peut prendre quelques secondes.",
  },
} as const;

const topicLabels: Record<Topic, Record<Language, string>> = {
  variables: { en: "Variables", fr: "Variables" },
  types: { en: "Types", fr: "Types" },
  conditions: { en: "Conditions", fr: "Conditions" },
  loops: { en: "Loops", fr: "Boucles" },
  lists: { en: "Lists", fr: "Listes" },
};

const difficultyLabels: Record<Difficulty, Record<Language, string>> = {
  easy: { en: "Easy", fr: "Facile" },
  medium: { en: "Medium", fr: "Intermédiaire" },
  hard: { en: "Hard", fr: "Difficile" },
};

const typeLabels: Record<Question["type"], Record<Language, string>> = {
  "multiple-choice": { en: "Choose one", fr: "Choix unique" },
  output: { en: "Predict output", fr: "Prédire la sortie" },
  fill: { en: "Fill the blank", fr: "Compléter" },
  code: { en: "Write code", fr: "Écrire du code" },
};

function PythonMark() {
  return (
    <span className="python-mark" aria-hidden="true">
      <span>py</span>
      <i>_</i>
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function InlineCodeText({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code className="inline-question-code" key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("python-workbook-language") as Language) || "en");
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">("mixed");
  const [screen, setScreen] = useState<Screen>("welcome");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [execution, setExecution] = useState<ExecutionResult | null>(null);
  const [runningAction, setRunningAction] = useState<"execute" | "submit" | null>(null);
  const [message, setMessage] = useState("");
  const t = copy[language];

  const current = quiz[currentIndex];
  const currentAnswer = current ? (answers[current.id] ?? current.starterCode ?? "") : "";

  const chooseLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem("python-workbook-language", nextLanguage);
  };

  const startQuiz = () => {
    const nextQuiz = createQuiz(difficulty);
    setQuiz(nextQuiz);
    setCurrentIndex(0);
    setAnswers(Object.fromEntries(nextQuiz.filter((q) => q.type === "code").map((q) => [q.id, q.starterCode ?? ""])));
    setRecords([]);
    setAttempts({});
    setFeedback(null);
    setExecution(null);
    setMessage("");
    setScreen("quiz");
    window.scrollTo({ top: 0 });
  };

  const updateAnswer = (value: string) => {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
    setExecution(null);
    setMessage("");
  };

  const saveResult = (correct: boolean, tests?: TestResult[], consoleOutput?: string) => {
    const nextRecord = { questionId: current.id, topic: current.topic, correct };
    setRecords((previous) => [...previous, nextRecord]);
    setFeedback({ correct, tests, consoleOutput });
  };

  const finishAttempt = (correct: boolean, tests?: TestResult[], consoleOutput?: string) => {
    const nextAttempt = (attempts[current.id] ?? 0) + 1;
    setAttempts((previous) => ({ ...previous, [current.id]: nextAttempt }));
    const acceptsKeyboardInput = current.type === "fill" || current.type === "output" || current.type === "code";

    if (!correct && acceptsKeyboardInput && nextAttempt === 1) {
      setFeedback({ correct: false, tests, consoleOutput, canRetry: true });
      return;
    }

    saveResult(correct, tests, consoleOutput);
  };

  const runCode = async () => {
    if (!currentAnswer.trim()) {
      setMessage(t.emptyAnswer);
      return;
    }
    setMessage("");
    setExecution(null);
    setRunningAction("execute");
    try {
      setExecution(await pythonRunner.execute(current, currentAnswer, language));
    } catch (error) {
      setMessage(`${t.pythonError}: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setRunningAction(null);
    }
  };

  const checkAnswer = async () => {
    if (!currentAnswer.trim()) {
      setMessage(t.emptyAnswer);
      return;
    }
    setMessage("");

    if (current.type === "code") {
      setExecution(null);
      setRunningAction("submit");
      try {
        const result = await pythonRunner.grade(current, currentAnswer, language);
        finishAttempt(result.results.every((test) => test.passed), result.results, result.consoleOutput);
      } catch (error) {
        setMessage(`${t.pythonError}: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setRunningAction(null);
      }
      return;
    }

    finishAttempt(isTextAnswerCorrect(current, currentAnswer));
  };

  const retryAnswer = () => {
    setFeedback(null);
    setExecution(null);
    setMessage("");
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(".answer-field input, .editor-body textarea")?.focus();
    });
  };

  const continueQuiz = () => {
    if (currentIndex === quiz.length - 1) {
      const result = { completedAt: new Date().toISOString(), records };
      localStorage.setItem("python-workbook-latest-result", JSON.stringify(result));
      setScreen("results");
      window.scrollTo({ top: 0 });
      return;
    }
    setCurrentIndex((index) => index + 1);
    setFeedback(null);
    setExecution(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (screen === "welcome") {
    return (
      <main className="welcome-shell">
        <header className="welcome-nav">
          <a className="brand" href="#top" aria-label="Python Workbook home">
            <PythonMark />
            <span>Python Workbook</span>
          </a>
          <div className="language-switch" aria-label={t.language}>
            <button className={language === "en" ? "active" : ""} onClick={() => chooseLanguage("en")}>EN</button>
            <button className={language === "fr" ? "active" : ""} onClick={() => chooseLanguage("fr")}>FR</button>
          </div>
        </header>

        <section className="welcome-grid" id="top">
          <div className="intro-block">
            <p className="eyebrow"><span />{t.eyebrow}</p>
            <h1>{t.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="intro-copy">{t.intro}</p>
            <div className="lesson-line" aria-label="Topics">
              {(Object.keys(topicLabels) as Topic[]).map((topic, index) => (
                <span key={topic}><b>{String(index + 1).padStart(2, "0")}</b>{topicLabels[topic][language]}</span>
              ))}
            </div>
          </div>

          <aside className="setup-card">
            <div className="setup-heading">
              <span className="step-number">01</span>
              <div><p>{t.difficulty}</p><span>10 questions</span></div>
            </div>
            <div className="difficulty-list">
              {(["mixed", "easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  className={`difficulty-option ${difficulty === level ? "selected" : ""}`}
                  onClick={() => setDifficulty(level)}
                  aria-pressed={difficulty === level}
                >
                  <span className="radio-dot" />
                  <span><b>{t[level]}</b><small>{t[`${level}Hint`]}</small></span>
                  <span className="level-code">{level === "mixed" ? "A–C" : level === "easy" ? "A" : level === "medium" ? "B" : "C"}</span>
                </button>
              ))}
            </div>
            <button className="primary-button" onClick={startQuiz}>{t.start}<ArrowIcon /></button>
            <p className="privacy-note"><span aria-hidden="true">●</span>{t.noLogin}</p>
          </aside>
        </section>
      </main>
    );
  }

  if (screen === "results") {
    return <Results language={language} records={records} quiz={quiz} onRestart={() => setScreen("welcome")} />;
  }

  return (
    <main className="quiz-shell">
      <header className="quiz-nav">
        <div className="brand"><PythonMark /><span>Python Workbook</span></div>
        <div className="progress-label"><span>{t.question} {currentIndex + 1} {t.of} {quiz.length}</span><b>{Math.round(((currentIndex + 1) / quiz.length) * 100)}%</b></div>
      </header>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }} /></div>

      <section className="question-layout">
        <aside className="question-meta">
          <span className="question-number">{String(currentIndex + 1).padStart(2, "0")}</span>
          <div className="meta-group"><span>Topic</span><b>{topicLabels[current.topic][language]}</b></div>
          <div className="meta-group"><span>Level</span><b>{difficultyLabels[current.difficulty][language]}</b></div>
          <div className="meta-group"><span>Format</span><b>{typeLabels[current.type][language]}</b></div>
        </aside>

        <article className="question-workspace">
          <div className="question-heading">
            <p>{topicLabels[current.topic][language]} <span>/</span> {typeLabels[current.type][language]}</p>
            <h1><InlineCodeText text={current.prompt[language]} /></h1>
          </div>

          {current.codeSnippet && <pre className="code-sample"><code>{current.codeSnippet}</code></pre>}

          {current.type === "multiple-choice" && (
            <div className="choice-list">
              {current.choices?.map((choice, index) => (
                <button
                  key={choice}
                  className={`choice ${currentAnswer === choice ? "selected" : ""}`}
                  onClick={() => updateAnswer(choice)}
                  disabled={Boolean(feedback)}
                >
                  <span>{String.fromCharCode(65 + index)}</span><b>{choice}</b>
                </button>
              ))}
            </div>
          )}

          {(current.type === "output" || current.type === "fill") && (
            <label className="answer-field">
              <span>{typeLabels[current.type][language]}</span>
              <input value={currentAnswer} onChange={(event) => updateAnswer(event.target.value)} placeholder={t.placeholder} disabled={Boolean(feedback)} autoFocus />
            </label>
          )}

          {current.type === "code" && (
            <div className="editor-frame">
              <div className="editor-toolbar"><span><i /> main.py</span><small>Python 3 · Browser</small></div>
              <div className="editor-body">
                <div className="line-numbers" aria-hidden="true">{currentAnswer.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div>
                <textarea value={currentAnswer} onChange={(event) => updateAnswer(event.target.value)} disabled={Boolean(feedback) || Boolean(runningAction)} spellCheck={false} aria-label="Python code editor" />
              </div>
              {!feedback && <p className="loading-note">{t.loadingNote}</p>}
            </div>
          )}

          {execution && <RunOutputPanel execution={execution} language={language} />}

          {message && <div className="inline-error" role="alert">{message}</div>}

          {feedback && (
            <FeedbackPanel feedback={feedback} question={current} language={language} />
          )}

          <div className={`question-actions ${current.type === "code" && !feedback ? "code-actions" : ""}`}>
            {!feedback ? (
              current.type === "code" ? (
                <>
                  <button className="secondary-button code-run-button" onClick={runCode} disabled={Boolean(runningAction)}>
                    {runningAction === "execute" ? t.running : t.run}
                  </button>
                  <button className="primary-button compact" onClick={checkAnswer} disabled={Boolean(runningAction)}>
                    {runningAction === "submit" ? t.submitting : t.submitCode}
                    {!runningAction && <ArrowIcon />}
                  </button>
                </>
              ) : (
                <button className="primary-button compact" onClick={checkAnswer}>
                  {t.check}<ArrowIcon />
                </button>
              )
            ) : feedback.canRetry ? (
              <button className="primary-button compact retry-button" onClick={retryAnswer}>
                {t.tryAgain}<ArrowIcon />
              </button>
            ) : (
              <button className="primary-button compact" onClick={continueQuiz}>
                {currentIndex === quiz.length - 1 ? t.results : t.next}<ArrowIcon />
              </button>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

function RunOutputPanel({ execution, language }: { execution: ExecutionResult; language: Language }) {
  const t = copy[language];
  const inputs = Object.entries(execution.previewInputs);
  const formatValue = (value: unknown) => typeof value === "string" ? `"${value}"` : JSON.stringify(value);

  return (
    <section className="run-output-panel" aria-live="polite">
      <header className="run-output-header">
        <span><i /> {t.previewRun}</span>
        <b>{t.notGraded}</b>
      </header>
      {inputs.length > 0 && (
        <div className="preview-inputs">
          <span>{t.previewInputs}</span>
          <div>{inputs.map(([name, value]) => <code key={name}>{name} = {formatValue(value)}</code>)}</div>
        </div>
      )}
      <div className="preview-console">
        <span>{t.console}</span>
        <pre className={execution.consoleOutput ? "" : "empty"}>{execution.consoleOutput || t.noOutput}</pre>
      </div>
      {execution.resultVariable && execution.resultValue != null && (
        <div className="preview-result"><span>{t.resultVariable}</span><code>{execution.resultVariable} = {execution.resultValue}</code></div>
      )}
    </section>
  );
}

function FeedbackPanel({ feedback, question, language }: { feedback: FeedbackState; question: Question; language: Language }) {
  const t = copy[language];
  return (
    <section className={`feedback-panel ${feedback.correct ? "success" : "needs-work"}`} aria-live="polite">
      <div className="feedback-title"><span>{feedback.correct ? "✓" : "↻"}</span><h2>{feedback.correct ? t.correct : t.incorrect}</h2></div>
      {feedback.canRetry && <p className="retry-guidance">{t.retryMessage}</p>}
      {feedback.tests && (
        <div className="execution-trace">
          <div className="trace-header"><span><i /> test_trace.py</span><b>{feedback.tests.filter((test) => test.passed).length}/{feedback.tests.length} {t.passed}</b></div>
          {feedback.tests.map((test, index) => (
            <div className="trace-row" key={`${test.label}-${index}`}>
              <span className={test.passed ? "pass" : "fail"}>{test.passed ? "PASS" : "FAIL"}</span>
              <b>{test.label}</b>
              {!test.passed && (feedback.canRetry ? test.error : true) && (
                <small>{feedback.canRetry ? test.error : test.error || `${t.expected}: ${test.expected} · ${t.received}: ${test.actual}`}</small>
              )}
            </div>
          ))}
          {feedback.consoleOutput && <div className="console-output"><span>{t.console}</span><pre>{feedback.consoleOutput}</pre></div>}
        </div>
      )}
      {!feedback.canRetry && <div className="explanation"><span>{t.correction}</span><p>{question.explanation[language]}</p></div>}
    </section>
  );
}

function Results({ language, records, quiz, onRestart }: { language: Language; records: AnswerRecord[]; quiz: Question[]; onRestart: () => void }) {
  const t = copy[language];
  const correct = records.filter((record) => record.correct).length;
  const percentage = Math.round((correct / quiz.length) * 100);
  const topicScores = useMemo(() => {
    return (Object.keys(topicLabels) as Topic[]).map((topic) => {
      const topicRecords = records.filter((record) => record.topic === topic);
      return { topic, correct: topicRecords.filter((record) => record.correct).length, total: topicRecords.length };
    }).filter((score) => score.total > 0);
  }, [records]);

  return (
    <main className="results-shell">
      <header className="quiz-nav"><div className="brand"><PythonMark /><span>Python Workbook</span></div></header>
      <section className="results-grid">
        <div className="score-hero">
          <p className="eyebrow"><span />{t.scoreTitle}</p>
          <div className="score-number"><b>{percentage}</b><span>%</span></div>
          <p>{t.scoreLead} <strong>{correct} / {quiz.length}</strong> {t.scoreTail}</p>
          <div className="result-actions">
            <button className="primary-button compact" onClick={onRestart}>{t.again}<ArrowIcon /></button>
            <button className="secondary-button" onClick={() => window.print()}>{t.print}</button>
          </div>
        </div>
        <aside className="topic-results">
          <h2>{t.topicBreakdown}</h2>
          {topicScores.map(({ topic, correct: topicCorrect, total }) => {
            const width = Math.round((topicCorrect / total) * 100);
            return (
              <div className="topic-score" key={topic}>
                <div><b>{topicLabels[topic][language]}</b><span>{topicCorrect}/{total}</span></div>
                <div className="score-track"><span style={{ width: `${width}%` }} /></div>
              </div>
            );
          })}
          <div className="review-note">
            <span>{t.review}</span>
            <p>{percentage >= 80
              ? (language === "fr" ? "Très bon travail. Essayez maintenant un niveau plus difficile." : "Strong work. Try a more difficult set next.")
              : (language === "fr" ? "Relisez les corrections, puis recommencez avec les fondations." : "Review the corrections, then try the foundations again.")}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
