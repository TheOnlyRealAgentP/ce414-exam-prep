/* =========================================================================
   CE 414 exam prep: shared core
   - EX.week() and EX.exam(): content files in data/ register themselves here
   - seeded random numbers, so a test code reproduces the same test
   - buildExam(): the full 100-question, 3-hour practice exam
   - buildDrill(): a shorter test from chosen weeks
   Works in the browser (window.EX) and in Node (module.exports) for checks.
   ========================================================================= */
(function (root) {
  "use strict";

  const EX = root.EX || {};
  EX.weeks = EX.weeks || [];
  EX.exams = EX.exams || [];
  EX.week = (w) => EX.weeks.push(w);
  EX.exam = (e) => EX.exams.push(e);

  /* ---------- Seeded random (same generator as the GIS study hub) ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      shuffle: (arr) => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      },
    };
  }
  EX.rng = rng;
  EX.newSeed = () => Math.floor(Math.random() * 900000) + 100000;

  EX.weekById = (id) => EX.weeks.find((w) => w.id === id);
  EX.weekByNum = (n) => EX.weeks.find((w) => w.num === n);
  EX.examById = (id) => EX.exams.find((e) => e.id === id);
  EX.weeksOf = (exam) => exam.weeks.map(EX.weekByNum).filter(Boolean);

  // One test item, with choices shuffled by the test's own random sequence
  function prepare(r, week, q, n) {
    const out = { n, week: week.num, id: q.id, type: q.type, prompt: q.prompt, detail: q.detail || "", explain: q.explain, from: q.from, source: q.source || "" };
    if (q.type === "mc") {
      const order = r.shuffle(q.choices.map((_, k) => k));
      out.choices = order.map((k) => q.choices[k]);
      out.answer = order.indexOf(q.answer);
    } else {
      out.answer = q.answer;
    }
    return out;
  }

  /* ---------- The full practice exam ----------
     The course says: 100 multiple-choice questions, 1 point each, grouped by
     week, 3 hours. The course does not say how many come from each week, so
     each exam file sets a target per week. A week short of questions gives its
     extra places to the other weeks, one at a time, so the total stays at 100.
     Four-choice questions are picked first, since every real question has four. */
  EX.buildExam = function (examId, seed) {
    const exam = EX.examById(examId);
    const r = rng(seed);
    const weeks = EX.weeksOf(exam);
    const pools = {};
    weeks.forEach((w) => {
      pools[w.num] = r.shuffle(w.questions).sort((a, b) => rank(b) - rank(a));
    });
    const take = {};
    let have = 0;
    weeks.forEach((w) => {
      take[w.num] = Math.min(exam.target[w.num] || 0, pools[w.num].length);
      have += take[w.num];
    });
    let moved = true;
    while (have < exam.format.questions && moved) {
      moved = false;
      for (const w of weeks) {
        if (have < exam.format.questions && take[w.num] < pools[w.num].length) {
          take[w.num]++;
          have++;
          moved = true;
        }
      }
    }
    let n = 0;
    const qs = [];
    weeks.forEach((w) => {
      r.shuffle(pools[w.num].slice(0, take[w.num])).forEach((q) => qs.push(prepare(r, w, q, n++)));
    });
    return { qs, take };
  };
  const rank = (q) => (q.type === "mc" ? Math.min(q.choices.length, 4) : 2);

  /* ---------- A drill from chosen weeks ----------
     Round-robin across the weeks so each shows up, then grouped by week. */
  EX.buildDrill = function ({ weekNums, count, seed, only }) {
    const r = rng(seed);
    const pools = weekNums
      .map((num) => {
        const w = EX.weekByNum(num);
        if (!w) return null;
        const qs = w.questions.filter((q) => !only || q.from === only);
        return { w, items: r.shuffle(qs) };
      })
      .filter((p) => p && p.items.length);
    const picked = [];
    let i = 0;
    while (picked.length < count && pools.some((p) => p.items.length)) {
      const p = pools[i % pools.length];
      if (p.items.length) picked.push({ w: p.w, q: p.items.pop() });
      i++;
    }
    picked.sort((a, b) => a.w.num - b.w.num);
    return picked.map((it, n) => prepare(r, it.w, it.q, n));
  };

  EX.grade = function (q, response) {
    if (response === undefined || response === null || response === "") return false;
    if (q.type === "mc") return Number(response) === q.answer;
    return String(response) === String(q.answer);
  };

  if (typeof module !== "undefined" && module.exports) module.exports = EX;
  else root.EX = EX;
})(typeof window !== "undefined" ? window : globalThis);
