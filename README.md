# ce414-exam-prep

Study page for BYU CE 414 (Engineering Applications of GIS), Fall 2026: a study guide for each midterm and full practice exams in the real format. Plain HTML, CSS and JavaScript with no build step, built the same way as the GIS study hub on [My-Page](https://github.com/TheOnlyRealAgentP/My-Page) (`teach/gis/`) and using the same theme.

Live at https://theonlyrealagentp.github.io/ce414-exam-prep/. It's kept separate from harrisonpstewart.com on purpose: My-Page doesn't link to it, and the page asks search engines not to index it (`noindex` in `index.html`). It includes quiz questions from Dr. Ames's course site and the course's Learning Suite reading quizzes, shared with permission.

## Structure

```
index.html                  page shell: loads core, content, then the app
css/style.css               theme tokens (top of file) and base, same tokens as harrisonpstewart.com
css/exam.css                hub, guide and test styles from the GIS study hub, plus the exam pieces at the bottom
js/exam-core.js             EX.week()/EX.exam() registry, seeded random, buildExam(), buildDrill(), grade()
js/exam-app.js              hub, study guide, full exam, results and drill views

data/exam1.js, exam2.js     one file per midterm: format, dates, facts, hand-calc list, traps, questions per week
data/wNN.js                 one file per week: notes for the guide and that week's questions (see below)
validate.py / validate.mjs  check every content file: python validate.py   (or node validate.mjs)
favicon.svg                 same icon as harrisonpstewart.com
```

## What's on the page

- **Study guides** (`#/guide/1`, `#/guide/2`): exam facts, a section of notes per week, a hand-calculation list and the likely traps. `#/guide/1/w06` jumps to Week 6.
- **Full practice exam** (`#/exam/1`, `#/exam/2`): matches what the course says about the midterms: **100 multiple-choice questions, 1 point each, grouped by week, 3 hours, closed book.** One question at a time, a countdown clock, a question grid and flags. Answers show only after you submit. The exam in progress is saved in this browser, so a reload or a closed tab picks up where you left off, with the clock still running. When time runs out it submits itself.
- **Results** (`#/results/1`): score by week, every question with the right answer and explanation, and a drill of the ones I missed.
- **Drills** (`#/drill?w=6,7&n=20&seed=123456&instant=1`): any weeks, 10 to 50 questions, from all sources or one (`only=self-check`, `reading` or `hand-calc`), with answers as you go or at the end. Same seed, same drill. Drills print with or without an answer key.

## How the full exam picks questions

The course gives the format but not how many questions come from each week, so each exam file has a `target` per week that adds to 100 (Exam 1: 12–16 per week; Exam 2: 20 per week). A week with too few questions gives its extra places to the other weeks, one at a time, so the total stays at 100. Questions with four choices are picked first, since every real question has four. Some quiz questions have two or three.

## Question sources

Every question has `from` and `source`:

- `self-check`: Dr. Ames's self-check quizzes on the course site (byu-hydroinformatics.github.io/ce414-gis-applications), with his explanations.
- `reading`: my Learning Suite reading quizzes, from my own submitted attempts (Quizzes 1, 4, 6, 7, 9 and 10). Quizzes 2, 3 and 5 had no attempt to review, and Quiz 8's review isn't available.
- `hand-calc`: hand calculations written for this guide.

## Editing content

Each week is one file in `data/` that calls `EX.week({...})`:

```js
EX.week({
  id: "w06", num: 6, exam: 1,
  title: "Watersheds", reading: "Ch. 10 review", lab: "Lab 5",
  blurb: "One line for the week card.",
  notes: ["A guide bullet", { text: "A bullet with children", sub: ["child", "child"] }],
  questions: [
    { id: "w06-q01", from: "self-check", source: "Self-check quiz: Which Way Does Water Go?",
      type: "mc", prompt: "...", detail: "optional context line", choices: ["...", "..."], answer: 1, explain: "..." },
    { id: "w06-q20", from: "reading", source: "Learning Suite Reading Quiz 6",
      type: "tf", prompt: "...", answer: false, explain: "..." }
  ]
});
```

- `answer` is the index of the right choice for `mc`, or `true`/`false` for `tf`. Choices are shuffled on every test, so don't write "all of the above".
- Notes and prompts take `**bold**`, `*italic*` and `` `code` ``.
- After editing, run `python validate.py`.

## Run locally

Open `index.html` in a browser, or:

```bash
python -m http.server 8000
# open http://localhost:8000
```

Saved progress (the exam in progress, last results, drill scores) lives in the browser's local storage under `ce414:` keys, so it stays on the machine and browser you used.

## Deploy to GitHub Pages

1. Push to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site appears at `https://theonlyrealagentp.github.io/ce414-exam-prep/`. `.nojekyll` makes Pages serve the files as they are.

## License

Not licensed for reuse. Shared with permission; the self-check quiz questions and explanations belong to Dr. Ames's CE 414 course, and the reading-quiz questions come from the course's Learning Suite quizzes. My own notes and code are © 2026 Harrison Stewart.
