let pyodide;
let loading;

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (!loading) {
    loading = (async () => {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");
      pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
      });
      self.postMessage({ type: "ready" });
      return pyodide;
    })();
  }
  return loading;
}

self.onmessage = async (event) => {
  const { id, mode, code, resultVariable, tests, previewInputs, language } = event.data;
  try {
    const runtime = await ensurePyodide();
    self.postMessage({ type: "running", id });
    const output = [];
    runtime.setStdout({ batched: (message) => output.push(message) });
    runtime.setStderr({ batched: (message) => output.push(message) });

    if (mode === "execute") {
      const inputData = JSON.stringify(previewInputs || {});
      const executeHarness = `import json\n__student_code = ${JSON.stringify(code)}\n__preview_inputs = json.loads(${JSON.stringify(inputData)})\n__namespace = dict(__preview_inputs)\nexec(__student_code, __namespace)\n__result_value = repr(__namespace[${JSON.stringify(resultVariable)}]) if ${JSON.stringify(resultVariable)} in __namespace else None\nprint("__PYRUN__" + json.dumps({"resultVariable": ${JSON.stringify(resultVariable)}, "resultValue": __result_value}))`;
      await runtime.runPythonAsync(executeHarness);
      const marker = output.findLast((line) => line.startsWith("__PYRUN__"));
      if (!marker) throw new Error("The Python runner did not return a result.");
      const execution = JSON.parse(marker.slice("__PYRUN__".length));
      const consoleOutput = output.filter((line) => !line.startsWith("__PYRUN__")).join("\n");
      self.postMessage({ type: "execute-result", id, consoleOutput, previewInputs, ...execution });
      return;
    }

    const testData = JSON.stringify(tests);
    const harness = `import json\n__student_code = ${JSON.stringify(code)}\n__quiz_tests = json.loads(${JSON.stringify(testData)})\n__quiz_results = []\nfor __test in __quiz_tests:\n    try:\n        __namespace = dict(__test["inputs"])\n        exec(__student_code, __namespace)\n        if ${JSON.stringify(resultVariable)} not in __namespace:\n            raise NameError(${JSON.stringify(resultVariable)} + " was not created")\n        __actual = __namespace[${JSON.stringify(resultVariable)}]\n        __passed = __actual == __test["expected"]\n        __quiz_results.append({\n            "label": __test["label"][${JSON.stringify(language)}],\n            "passed": __passed,\n            "expected": repr(__test["expected"]),\n            "actual": repr(__actual)\n        })\n    except Exception as __error:\n        __quiz_results.append({\n            "label": __test["label"][${JSON.stringify(language)}],\n            "passed": False,\n            "expected": repr(__test["expected"]),\n            "actual": "—",\n            "error": f"{type(__error).__name__}: {__error}"\n        })\nprint("__PYQUIZ__" + json.dumps(__quiz_results))`;

    await runtime.runPythonAsync(harness);
    const marker = output.findLast((line) => line.startsWith("__PYQUIZ__"));
    if (!marker) throw new Error("The test runner did not return a result.");
    const results = JSON.parse(marker.slice("__PYQUIZ__".length));
    const consoleOutput = output.filter((line) => !line.startsWith("__PYQUIZ__")).join("\n");
    self.postMessage({ type: "result", id, results, consoleOutput });
  } catch (error) {
    self.postMessage({ type: "error", id, error: error?.message || String(error) });
  }
};

ensurePyodide().catch((error) => {
  self.postMessage({ type: "load-error", error: error?.message || String(error) });
});
