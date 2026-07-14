# Python Workbook

A bilingual (English/French) quiz platform for Python fundamentals. It runs entirely in the browser, including Python code evaluation through Pyodide, so it needs no backend or student accounts.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

The static site is generated in `dist/` and can be deployed free on GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

## Deploy free with GitHub Pages

1. Create a GitHub repository and push this project to its `main` branch.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. The included deployment workflow will build and publish the site. Every later push to `main` publishes updates automatically.

## Edit the question bank

Questions live in `src/questions.ts`. Every question has:

- a unique `id`;
- exactly one `set`: `easy`, `medium`, `hard`, or `mixed`;
- one of the five `topic` values;
- `easy`, `medium`, or `hard` difficulty;
- English and French prompt/explanation text;
- an answer or a list of accepted answers.

Each set contains 10 exclusive questions; questions are never borrowed from another set.

Coding questions use scripts rather than student-defined functions. Each one defines starter code, a result variable, and automated tests that provide input variables. Keep test inputs and expected values JSON-compatible.

## Deployment note

The app downloads Pyodide from jsDelivr the first time a coding exercise is run. Students therefore need an internet connection for code exercises. Quiz answers and tests are shipped to the browser; this is suitable for classroom practice, not secure examinations.
