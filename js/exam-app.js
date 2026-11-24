/* =========================================================================
   CE 414 exam prep: views (hub, study guide, full exam, drill, results).
   Routes live in the URL hash, like the GIS study hub:
     #/                          hub
     #/guide/1                   Exam 1 study guide (#/guide/1/w06 jumps to Week 6)
     #/exam/1                    the full practice exam in progress (100 questions, 3 hours)
     #/results/1                 results of the last full Exam 1
     #/drill?w=6,7&n=20&seed=123456&only=reading&instant=1
   ========================================================================= */
(function () {
  "use strict";

  const EX = window.EX;
  const app = document.getElementById("app");
  const exams = () => EX.exams.slice().sort((a, b) => a.id - b.id);
  const weeks = () => EX.weeks.slice().sort((a, b) => a.num - b.num);
  const pad2 = (n) => String(n).padStart(2, "0");
  const FROM = { "self-check": "Self-check", reading: "Reading quiz", "hand-calc": "Hand calc" };

  /* ---------- Helpers ---------- */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Inline markup in content: **bold**, *italic* and `code`
  const md = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:]|$)/g, "$1<em>$2</em>");
  const icon = (n) => `<i class="ph ph-${n}" aria-hidden="true"></i>`;
  const LETTERS = "ABCDEFGHIJ";

  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem("ce414:" + k);
        return v ? JSON.parse(v) : d;
      } catch (_) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem("ce414:" + k, JSON.stringify(v));
      } catch (_) {}
    },
    del(k) {
      try {
        localStorage.removeItem("ce414:" + k);
      } catch (_) {}
    },
  };

  let toastTimer = 0;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function setTitle(t) {
    document.title = t ? `${t} · CE 414 Exam Prep` : "CE 414 Exam Prep";
  }

  const fmtTime = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 3600)}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
  };
  const weekLabel = (n) => `W${pad2(n)}`;
  const choicesOf = (q) => (q.type === "mc" ? q.choices.map((t, k) => [k, t]) : [[true, "True"], [false, "False"]]);
  const keyText = (q) => (q.type === "mc" ? `${LETTERS[q.answer]}. ${q.choices[q.answer]}` : q.answer ? "True" : "False");

  /* ---------- Router ---------- */
  let tick = 0;
  function route() {
    clearInterval(tick);
    const h = location.hash.replace(/^#\/?/, "");
    const [path, query] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(query || "");
    document.body.classList.remove("print-key");
    window.scrollTo(0, 0);
    if (!EX.weeks.length) return renderEmpty();
    const exam = EX.examById(+parts[1]);
    if (parts[0] === "guide" && exam) return renderGuide(exam, parts[2]);
    if (parts[0] === "exam" && exam) return renderExam(exam);
    if (parts[0] === "results" && exam) return renderResults(exam);
    if (parts[0] === "drill") return renderDrill(params);
    return renderHub();
  }
  window.addEventListener("hashchange", route);

  function renderEmpty() {
    app.innerHTML = `<div class="panel empty">${icon("hourglass-medium")}<p>No study content loaded.</p></div>`;
  }

  /* =======================================================================
     Hub
     ======================================================================= */
  function renderHub() {
    setTitle("");
    const active = store.get("active", null);
    const drillScores = store.get("drillScores", {});
    const total = EX.weeks.reduce((s, w) => s + w.questions.length, 0);
    const count = (from) => EX.weeks.reduce((s, w) => s + w.questions.filter((q) => q.from === from).length, 0);

    app.innerHTML = `
      <header class="hub-head">
        <div class="eyebrow">CE 414 · Engineering Applications of GIS · Fall 2026</div>
        <h1>CE 414 Exam Prep</h1>
        <p class="lede">
          Study guides for both midterms and practice exams in the real format: 100 multiple-choice questions,
          grouped by week, with a 3-hour clock. Shorter drills for any week are below.
        </p>
        <div class="meta-row">
          <span class="pill">${icon("question")}<span>${total} questions</span></span>
          <span class="pill">${icon("check-square")}<span>${count("self-check")} from Dr. Ames's self-check quizzes</span></span>
          <span class="pill">${icon("book-open-text")}<span>${count("reading")} from my Learning Suite reading quizzes</span></span>
          <span class="pill">${icon("calculator")}<span>${count("hand-calc")} hand calculations</span></span>
        </div>
        <p class="class-note">${icon("lock-simple")}<span>Private study page. It holds graded Learning Suite quiz answers, so it
          stays in a private repo and isn't published anywhere.</span></p>
      </header>

      ${active ? resumePanel(active) : ""}

      <section class="exam-grid" aria-label="Exams">
        ${exams()
          .map((e) => {
            const last = store.get("last:" + e.id, null);
            const score = last ? lastScore(e, last) : null;
            return `
          <article class="panel exam-card">
            <div class="ch-num">${icon("exam")}</div>
            <h2>${esc(e.title)} <span class="status${e.status === "open" ? " open" : ""}">${e.status === "open" ? "coming up" : "taken"}</span></h2>
            <div class="when">Weeks ${e.weeks[0]}–${e.weeks[e.weeks.length - 1]} · ${e.format.questions} questions · ${e.format.minutes / 60} hours</div>
            <p>${md(e.window)}</p>
            <div class="ch-meta"><span>${score !== null ? `Last full exam ${score}%` : "No full exam yet"}</span>${last ? `<a class="linkish" href="#/results/${e.id}">See results</a>` : ""}</div>
            <div class="ch-actions">
              <a class="act" href="#/guide/${e.id}">${icon("book-open")}Study guide</a>
              <button type="button" class="act" data-start="${e.id}">${icon("timer")}Full exam</button>
              <a class="act" href="#/drill?w=${e.weeks.join(",")}&n=20&seed=${EX.newSeed()}&instant=1">${icon("lightning")}Drill</a>
            </div>
          </article>`;
          })
          .join("")}
      </section>

      <section class="panel builder" aria-labelledby="b-h">
        <div class="builder-top">
          <h2 id="b-h">${icon("lightning")}Build a drill</h2>
          <div class="sel-links">
            ${exams().map((e) => `<button type="button" class="linkish" data-sel="${e.weeks.join(",")}">${esc(e.title)} weeks</button>`).join("")}
            <button type="button" class="linkish" data-sel="">Clear</button>
          </div>
        </div>
        <div class="chips" id="chips">
          ${weeks()
            .map(
              (w) => `
            <label class="chip">
              <input type="checkbox" value="${w.num}" />
              <span><b>${weekLabel(w.num)}</b> ${esc(w.title)}</span>
            </label>`
            )
            .join("")}
        </div>
        <div class="builder-row">
          <label class="field">Questions
            <select id="b-n">${[10, 20, 30, 50].map((n) => `<option value="${n}"${n === 20 ? " selected" : ""}>${n}</option>`).join("")}</select>
          </label>
          <label class="field">From
            <select id="b-only">
              <option value="">All sources</option>
              <option value="self-check">Self-check quizzes</option>
              <option value="reading">Reading quizzes</option>
              <option value="hand-calc">Hand calculations</option>
            </select>
          </label>
          <label class="toggle"><input type="checkbox" id="b-instant" checked /> Show answers as I go</label>
          <div class="grow"></div>
          <button type="button" class="btn primary" id="b-start">${icon("play")}Start drill</button>
        </div>
      </section>

      <h2 class="sec-title">${icon("calendar-dots")}Weeks</h2>
      <section class="ch-grid" aria-label="Weeks">
        ${weeks()
          .map((w) => {
            const by = (f) => w.questions.filter((q) => q.from === f).length;
            const best = drillScores[w.num];
            return `
            <article class="panel ch">
              <div class="ch-num">${pad2(w.num)}</div>
              <h3>${esc(w.title)}</h3>
              <p>${md(w.blurb)}</p>
              <div class="ch-stats">
                <span>${w.questions.length} questions</span>
                <span>${by("self-check")} self-check · ${by("reading")} reading · ${by("hand-calc")} calc</span>
                ${w.reading || w.lab ? `<span>${esc([w.reading, w.lab].filter(Boolean).join(" · "))}</span>` : ""}
              </div>
              <div class="meter" title="Last drill score"><i style="width:${best ?? 0}%"></i></div>
              <div class="ch-meta">
                <span>Exam ${w.exam}</span>
                <span>${best !== undefined ? `Last drill ${best}%` : "No drill yet"}</span>
              </div>
              <div class="ch-actions">
                <a class="act" href="#/guide/${w.exam}/${w.id}">${icon("book-open")}Notes</a>
                <a class="act" href="#/drill?w=${w.num}&n=15&seed=${EX.newSeed()}&instant=1">${icon("lightning")}Drill</a>
              </div>
            </article>`;
          })
          .join("")}
      </section>

      <section class="panel tip">
        ${icon("info")}
        <div>
          <strong>How the full exam is built.</strong> Each run picks 100 questions grouped by week, with four-choice
          questions first, since every real question has four. The course doesn't say how many questions come from each
          week, so the split is close to even; a week with too few questions passes its places to the others.
        </div>
      </section>`;

    const chipInputs = [...app.querySelectorAll("#chips input")];
    const saved = new Set(store.get("lastWeeks", []).map(String));
    chipInputs.forEach((i) => (i.checked = saved.has(i.value)));
    app.querySelectorAll("[data-sel]").forEach((b) =>
      b.addEventListener("click", () => {
        const on = new Set(b.dataset.sel.split(",").filter(Boolean));
        chipInputs.forEach((i) => (i.checked = on.has(i.value)));
      })
    );
    app.querySelector("#b-start").addEventListener("click", () => {
      const w = chipInputs.filter((i) => i.checked).map((i) => i.value);
      if (!w.length) return toast("Pick at least one week first.");
      store.set("lastWeeks", w);
      const only = app.querySelector("#b-only").value;
      const instant = app.querySelector("#b-instant").checked ? 1 : 0;
      location.hash = `#/drill?w=${w.join(",")}&n=${app.querySelector("#b-n").value}&seed=${EX.newSeed()}${only ? `&only=${only}` : ""}&instant=${instant}`;
    });
    app.querySelectorAll("[data-start]").forEach((b) =>
      b.addEventListener("click", () => {
        if (store.get("active", null) && !b.dataset.armed) {
          b.dataset.armed = "1";
          b.innerHTML = `${icon("warning")}Click again to replace the exam in progress`;
          return;
        }
        startExam(+b.dataset.start);
      })
    );
    app.querySelector("#r-discard")?.addEventListener("click", (e) => {
      if (!e.currentTarget.dataset.armed) {
        e.currentTarget.dataset.armed = "1";
        e.currentTarget.innerHTML = `${icon("trash")}Click again to discard`;
        return;
      }
      store.del("active");
      renderHub();
    });
  }

  function resumePanel(a) {
    const e = EX.examById(a.exam);
    const done = a.ans.filter((x) => x !== null && x !== undefined).length;
    return `
      <section class="panel resume">
        ${icon("timer")}
        <div><strong>${esc(e.title)} full exam in progress.</strong>
          <span class="muted">${done} of ${a.n} answered · ${fmtTime(a.end - Date.now())} left on the clock.</span></div>
        <div class="toolbar" style="margin:0">
          <a class="btn primary" href="#/exam/${e.id}">${icon("play")}Resume</a>
          <button type="button" class="btn" id="r-discard">${icon("trash")}Discard</button>
        </div>
      </section>`;
  }

  /* =======================================================================
     Study guide (one per exam, a section per week)
     ======================================================================= */
  function renderGuide(e, jump) {
    setTitle(`${e.title} study guide`);
    const ws = EX.weeksOf(e);
    const other = exams().find((x) => x.id !== e.id);
    const li = (b) =>
      typeof b === "string" ? `<li>${md(b)}</li>` : `<li>${md(b.text)}<ul>${b.sub.map((s) => `<li>${md(s)}</li>`).join("")}</ul></li>`;

    app.innerHTML = `
      <nav class="crumbs"><a href="#/">${icon("arrow-left")}Exam prep home</a></nav>
      <header class="g-head">
        <div class="eyebrow">${esc(e.title)} · ${esc(e.name)} · Study guide</div>
        <h1>Weeks ${e.weeks[0]}–${e.weeks[e.weeks.length - 1]}</h1>
        <p class="lede">${md(e.window)}</p>
        <div class="toolbar">
          <button type="button" class="btn primary" data-start="${e.id}">${icon("timer")}Full practice exam</button>
          <a class="btn" href="#/drill?w=${e.weeks.join(",")}&n=20&seed=${EX.newSeed()}&instant=1">${icon("lightning")}Drill these weeks</a>
          <button type="button" class="btn" id="print">${icon("printer")}Print guide</button>
        </div>
        <nav class="wk-jump" aria-label="Jump to a week">${ws.map((w) => `<a href="#/guide/${e.id}/${w.id}" data-jump="${w.id}">${weekLabel(w.num)} ${esc(w.title)}</a>`).join("")}</nav>
      </header>

      <section class="panel facts">
        <h2>${icon("target")}Exam facts</h2>
        <ul>${e.facts.map((f) => `<li>${md(f)}</li>`).join("")}</ul>
      </section>

      <div class="guide">
        ${ws
          .map(
            (w) => `
          <section class="g-sec" id="${w.id}">
            <h2><span class="idx">${weekLabel(w.num)}</span>${esc(w.title)}</h2>
            <p class="muted">${esc([w.reading, w.lab].filter(Boolean).join(" · ") || "Lecture week")} · ${w.questions.length} practice questions ·
              <a class="linkish" href="#/drill?w=${w.num}&n=15&seed=${EX.newSeed()}&instant=1">Drill this week</a></p>
            <ul>${w.notes.map(li).join("")}</ul>
          </section>`
          )
          .join("")}
      </div>

      <section class="panel drill">
        <h2>${icon("calculator")}Hand-calculation practice (do these without notes)</h2>
        <ol>${e.drill.map((d) => `<li>${md(typeof d === "string" ? d : d.text)}</li>`).join("")}</ol>
      </section>

      <section class="panel traps">
        <h2>${icon("warning")}Likely traps</h2>
        <ul>${e.traps.map(li).join("")}</ul>
      </section>

      <nav class="pager">
        <a class="btn" href="#/">${icon("arrow-left")}Home</a>
        ${other ? `<a class="btn" href="#/guide/${other.id}">${esc(other.title)} guide${icon("arrow-right")}</a>` : ""}
      </nav>`;

    app.querySelector("#print").addEventListener("click", () => window.print());
    app.querySelectorAll("[data-start]").forEach((b) => b.addEventListener("click", () => startExam(+b.dataset.start)));
    app.querySelectorAll("[data-jump]").forEach((a) =>
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        document.getElementById(a.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
      })
    );
    if (jump) setTimeout(() => document.getElementById(jump)?.scrollIntoView({ block: "start" }), 0);
  }

  /* =======================================================================
     Full practice exam: 100 questions, grouped by week, 3-hour clock.
     The exam in progress is saved in this browser, so a reload or a closed tab
     picks up where you left off, with the clock still running.
     ======================================================================= */
  function startExam(id) {
    const e = EX.examById(id);
    const seed = EX.newSeed();
    const { qs } = EX.buildExam(id, seed);
    const now = Date.now();
    store.set("active", { exam: id, seed, n: qs.length, start: now, end: now + e.format.minutes * 60000, i: 0, ans: qs.map(() => null), flags: [] });
    if (location.hash === `#/exam/${id}`) route();
    else location.hash = `#/exam/${id}`;
  }

  function renderExam(e) {
    const a = store.get("active", null);
    if (!a || a.exam !== e.id) {
      app.innerHTML = `
        <nav class="crumbs"><a href="#/">${icon("arrow-left")}Exam prep home</a></nav>
        <div class="panel empty">${icon("timer")}<p>No ${esc(e.title)} exam in progress.</p>
          <div class="toolbar center"><button type="button" class="btn primary" id="go">${icon("play")}Start the 3-hour exam</button></div></div>`;
      app.querySelector("#go").addEventListener("click", () => startExam(e.id));
      return;
    }
    const { qs } = EX.buildExam(e.id, a.seed);
    let confirming = false;
    setTitle(`${e.title} full exam`);

    function save() {
      store.set("active", a);
    }
    function submit(over) {
      clearInterval(tick);
      store.set("last:" + e.id, { seed: a.seed, ans: a.ans, start: a.start, finish: Math.min(Date.now(), a.end), over: !!over });
      store.del("active");
      location.hash = `#/results/${e.id}`;
    }
    if (Date.now() >= a.end) return submit(true);

    function draw() {
      const q = qs[a.i];
      const answered = a.ans.filter((x) => x !== null).length;
      let lastWeek = 0;
      const grid = qs
        .map((qq, k) => {
          const brk = qq.week !== lastWeek ? `<span class="wk-break">Week ${qq.week}</span>` : "";
          lastWeek = qq.week;
          const cls = [a.ans[k] !== null ? "done" : "", k === a.i ? "cur" : "", a.flags[k] ? "flag" : ""].join(" ");
          return `${brk}<button type="button" class="${cls}" data-go="${k}" aria-label="Question ${k + 1}${a.flags[k] ? ", flagged" : ""}">${k + 1}</button>`;
        })
        .join("");
      app.innerHTML = `
        <nav class="crumbs"><a href="#/">${icon("arrow-left")}Exam prep home (the clock keeps running)</a></nav>
        <div class="panel exam-bar">
          <div><div class="eyebrow" style="margin:0">${esc(e.title)} · closed book</div>
            <div class="timer${a.end - Date.now() < 600000 ? " low" : ""}" id="timer" role="timer" aria-label="Time left">${fmtTime(a.end - Date.now())}</div></div>
          <span class="muted">${answered} of ${qs.length} answered</span>
        </div>
        <p class="legend"><b>Grid:</b> blue = answered · yellow underline = flagged · outlined = this question</p>
        <div class="navgrid" role="group" aria-label="Jump to a question">${grid}</div>
        <fieldset class="panel tq">
          <legend class="sr-only">Question ${a.i + 1}</legend>
          <div class="tq-head"><span class="qn">${a.i + 1}</span><span class="tag">Week ${q.week} · ${esc(EX.weekByNum(q.week).title)}</span></div>
          <p class="qp">${md(q.prompt)}</p>
          ${q.detail ? `<p class="qdetail">${md(q.detail)}</p>` : ""}
          <div class="tq-body">${choicesOf(q)
            .map(
              ([v, t], k) => `<label class="choice"><input type="radio" name="q" value="${v}" ${String(a.ans[a.i]) === String(v) ? "checked" : ""}/><span class="letter">${q.type === "mc" ? LETTERS[k] : t[0]}</span><span>${md(t)}</span></label>`
            )
            .join("")}</div>
          <div class="nav-row">
            <button type="button" class="btn" id="prev" ${a.i === 0 ? "disabled" : ""}>${icon("arrow-left")}Back</button>
            <div class="right">
              <button type="button" class="btn" id="flag">${icon("flag")}${a.flags[a.i] ? "Unflag" : "Flag"}</button>
              ${a.i < qs.length - 1 ? `<button type="button" class="btn primary" id="next">Next${icon("arrow-right")}</button>` : ""}
              <button type="button" class="btn${a.i === qs.length - 1 ? " primary" : ""}" id="submit">${icon("check-circle")}Submit exam</button>
            </div>
          </div>
          ${
            confirming
              ? `<div class="confirm"><strong>Submit the exam?</strong> ${qs.length - answered} question${qs.length - answered === 1 ? " is" : "s are"} unanswered. Answers can't change after you submit.
                  <div class="toolbar"><button type="button" class="btn primary" id="yes">${icon("check")}Submit now</button><button type="button" class="btn" id="no">Keep working</button></div></div>`
              : ""
          }
        </fieldset>`;

      app.querySelectorAll('input[name="q"]').forEach((inp) =>
        inp.addEventListener("change", () => {
          a.ans[a.i] = q.type === "mc" ? +inp.value : inp.value === "true";
          save();
          const btn = app.querySelector(`[data-go="${a.i}"]`);
          btn?.classList.add("done");
          app.querySelector(".exam-bar .muted").textContent = `${a.ans.filter((x) => x !== null).length} of ${qs.length} answered`;
        })
      );
      const go = (i) => {
        a.i = i;
        confirming = false;
        save();
        draw();
        window.scrollTo(0, 0);
      };
      app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(+b.dataset.go)));
      app.querySelector("#prev").addEventListener("click", () => a.i > 0 && go(a.i - 1));
      app.querySelector("#next")?.addEventListener("click", () => go(a.i + 1));
      app.querySelector("#flag").addEventListener("click", () => {
        a.flags[a.i] = !a.flags[a.i];
        save();
        draw();
      });
      app.querySelector("#submit").addEventListener("click", () => {
        confirming = true;
        draw();
        app.querySelector(".confirm")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      app.querySelector("#no")?.addEventListener("click", () => {
        confirming = false;
        draw();
      });
      app.querySelector("#yes")?.addEventListener("click", () => submit(false));
    }

    draw();
    tick = setInterval(() => {
      const left = a.end - Date.now();
      const el = document.getElementById("timer");
      if (el) {
        el.textContent = fmtTime(left);
        el.classList.toggle("low", left < 600000);
      }
      if (left <= 0) submit(true);
    }, 1000);
  }

  function lastScore(e, last) {
    const { qs } = EX.buildExam(e.id, last.seed);
    const right = qs.filter((q, i) => EX.grade(q, last.ans[i])).length;
    return Math.round((right / qs.length) * 100);
  }

  /* =======================================================================
     Results of the last full exam
     ======================================================================= */
  function renderResults(e) {
    const last = store.get("last:" + e.id, null);
    if (!last) return renderHub();
    setTitle(`${e.title} results`);
    const { qs } = EX.buildExam(e.id, last.seed);
    const ok = qs.map((q, i) => EX.grade(q, last.ans[i]));
    const right = ok.filter(Boolean).length;
    const pct = Math.round((right / qs.length) * 100);
    const per = {};
    qs.forEach((q, i) => {
      per[q.week] = per[q.week] || { right: 0, total: 0 };
      per[q.week].total++;
      if (ok[i]) per[q.week].right++;
    });

    app.innerHTML = `
      <nav class="crumbs"><a href="#/">${icon("arrow-left")}Exam prep home</a></nav>
      <header class="g-head small">
        <div class="eyebrow">${esc(e.title)} · full practice exam · results</div>
        <h1>${right} of ${qs.length} correct</h1>
        <p class="muted">Time used ${fmtTime(last.finish - last.start)} of ${fmtTime(e.format.minutes * 60000)}${last.over ? ". Time ran out, so the exam was submitted for you." : "."}</p>
      </header>
      <div class="panel score">
        <div class="big">${pct}%</div>
        <div>
          <h2>By week</h2>
          <table class="breakdown">
            ${Object.entries(per)
              .map(([w, v]) => {
                const p = Math.round((v.right / v.total) * 100);
                const wk = EX.weekByNum(+w);
                return `<tr><td>${weekLabel(+w)} · ${esc(wk.title)}</td><td class="num">${v.right}/${v.total}</td><td class="bar"><i style="width:${p}%"></i></td><td><a href="#/guide/${e.id}/${wk.id}">Review</a></td></tr>`;
              })
              .join("")}
          </table>
          <div class="toolbar">
            <button type="button" class="btn" id="r-missed">${icon("funnel")}Show only missed</button>
            <a class="btn" href="#/drill?ids=${qs.filter((q, i) => !ok[i]).map((q) => q.id).join(",")}&seed=${EX.newSeed()}&instant=1">${icon("arrow-counter-clockwise")}Drill the ${qs.length - right} I missed</a>
            <button type="button" class="btn primary" data-start="${e.id}">${icon("timer")}New full exam</button>
          </div>
        </div>
      </div>
      <div class="test" id="review">${qs.map((q, i) => reviewItem(q, i, last.ans[i], ok[i])).join("")}</div>`;

    app.querySelector("#r-missed").addEventListener("click", (ev) => {
      const on = app.querySelector("#review").classList.toggle("only-missed");
      ev.currentTarget.innerHTML = on ? `${icon("list")}Show all` : `${icon("funnel")}Show only missed`;
    });
    app.querySelectorAll("[data-start]").forEach((b) => b.addEventListener("click", () => startExam(+b.dataset.start)));
  }

  function reviewItem(q, i, resp, ok) {
    return `
      <fieldset class="panel tq ${ok ? "ok" : "miss"}">
        <legend class="sr-only">Question ${i + 1}</legend>
        <div class="tq-head"><span class="qn">${i + 1}</span><span class="tag">Week ${q.week} · ${esc(FROM[q.from] || "")}</span></div>
        <p class="qp">${md(q.prompt)}</p>
        ${q.detail ? `<p class="qdetail">${md(q.detail)}</p>` : ""}
        <div class="tq-body">${choicesOf(q)
          .map(
            ([v, t], k) => `<label class="choice${String(v) === String(q.answer) ? " is-answer" : ""}"><input type="radio" disabled ${resp !== null && resp !== undefined && String(resp) === String(v) ? "checked" : ""}/><span class="letter">${q.type === "mc" ? LETTERS[k] : t[0]}</span><span>${md(t)}</span></label>`
          )
          .join("")}</div>
        <div class="feedback"><strong>${ok ? icon("check-circle") + "Correct" : icon("x-circle") + (resp === null || resp === undefined ? "Left blank" : "Incorrect")}</strong>
          ${!ok ? `<span class="right-ans">Answer: ${md(keyText(q))}</span>` : ""}
          <p>${md(q.explain)}</p><p class="src" style="margin:4px 0 0">${esc(q.source)}</p></div>
      </fieldset>`;
  }

  /* =======================================================================
     Drill: a shorter test from chosen weeks (or a list of missed questions)
     ======================================================================= */
  function renderDrill(params) {
    const seed = parseInt(params.get("seed"), 10) || EX.newSeed();
    const instant = params.get("instant") === "1";
    const only = params.get("only") || "";
    let qs, nums, title;
    if (params.get("ids")) {
      const want = new Set(params.get("ids").split(","));
      const r = EX.rng(seed);
      qs = [];
      weeks().forEach((w) =>
        w.questions.filter((q) => want.has(q.id)).forEach((q) => {
          const order = q.type === "mc" ? r.shuffle(q.choices.map((_, k) => k)) : null;
          qs.push(
            q.type === "mc"
              ? { week: w.num, id: q.id, type: "mc", prompt: q.prompt, detail: q.detail || "", explain: q.explain, from: q.from, source: q.source, choices: order.map((k) => q.choices[k]), answer: order.indexOf(q.answer) }
              : { week: w.num, id: q.id, type: "tf", prompt: q.prompt, detail: q.detail || "", explain: q.explain, from: q.from, source: q.source, answer: q.answer }
          );
        })
      );
      nums = [...new Set(qs.map((q) => q.week))];
      title = "Questions I missed";
    } else {
      nums = (params.get("w") || "").split(",").map(Number).filter((n) => EX.weekByNum(n));
      if (!nums.length) return renderHub();
      const n = Math.max(1, Math.min(100, parseInt(params.get("n"), 10) || 20));
      qs = EX.buildDrill({ weekNums: nums, count: n, seed, only });
      title = nums.length <= 2 ? nums.map((w) => `${weekLabel(w)}: ${EX.weekByNum(w).title}`).join(" · ") : `Weeks ${nums.join(", ")}`;
    }
    if (!qs.length) {
      app.innerHTML = `<nav class="crumbs"><a href="#/">${icon("arrow-left")}Exam prep home</a></nav><div class="panel empty">${icon("question")}<p>No questions match that drill.</p></div>`;
      return;
    }
    setTitle("Drill");
    const again = () => {
      const p = new URLSearchParams(params);
      p.set("seed", EX.newSeed());
      location.hash = "#/drill?" + p.toString();
    };

    app.innerHTML = `
      <nav class="crumbs"><a href="#/">${icon("arrow-left")}Exam prep home</a></nav>
      <header class="g-head small">
        <div class="eyebrow">Drill · ${qs.length} questions${only ? ` · ${esc(FROM[only])} only` : ""}${instant ? " · answers as you go" : ""}</div>
        <h1>${esc(title)}</h1>
        <p class="print-only">Name: ______________________________ &nbsp; Test code: ${seed}</p>
        <div class="toolbar">
          <button type="button" class="btn" id="t-new">${icon("shuffle")}New questions</button>
          <button type="button" class="btn" id="t-print">${icon("printer")}Print</button>
          <button type="button" class="btn" id="t-print-key">${icon("key")}Print with answer key</button>
        </div>
      </header>
      <form id="test" class="test" novalidate>
        ${qs
          .map(
            (q, i) => `
          <fieldset class="panel tq" data-i="${i}">
            <legend class="sr-only">Question ${i + 1}</legend>
            <div class="tq-head"><span class="qn">${i + 1}</span><span class="tag">${weekLabel(q.week)} · ${esc(FROM[q.from] || "")}</span></div>
            <p class="qp">${md(q.prompt)}</p>
            ${q.detail ? `<p class="qdetail">${md(q.detail)}</p>` : ""}
            <div class="tq-body">${choicesOf(q)
              .map(([v, t], k) => `<label class="choice"><input type="radio" name="q${i}" value="${v}"/><span class="letter">${q.type === "mc" ? LETTERS[k] : t[0]}</span><span>${md(t)}</span></label>`)
              .join("")}</div>
            <div class="feedback" hidden></div>
          </fieldset>`
          )
          .join("")}
        <div class="submit-row">
          <span class="muted" id="answered">0 of ${qs.length} answered</span>
          <button type="submit" class="btn primary">${icon("check-circle")}${instant ? "Finish and see score" : "Submit and grade"}</button>
        </div>
      </form>
      <section id="result" hidden></section>
      <section class="answer-key">
        <h2>Answer key · test code ${seed}</h2>
        <ol>${qs.map((q) => `<li>${md(keyText(q))}</li>`).join("")}</ol>
      </section>`;

    const form = app.querySelector("#test");
    const value = (i) => {
      const el = form.querySelector(`input[name="q${i}"]:checked`);
      return el ? el.value : "";
    };
    const shown = new Set();
    function reveal(i) {
      const q = qs[i];
      const resp = value(i);
      const ok = EX.grade(q, resp);
      const box = form.querySelector(`.tq[data-i="${i}"]`);
      box.classList.remove("ok", "miss");
      box.classList.add(ok ? "ok" : "miss");
      box.querySelectorAll("input").forEach((x) => (x.disabled = true));
      box.querySelector(`input[value="${q.answer}"]`)?.closest(".choice").classList.add("is-answer");
      const fb = box.querySelector(".feedback");
      fb.hidden = false;
      fb.innerHTML = `<strong>${ok ? icon("check-circle") + "Correct" : icon("x-circle") + (resp === "" ? "Left blank" : "Incorrect")}</strong>
        ${!ok ? `<span class="right-ans">Answer: ${md(keyText(q))}</span>` : ""}
        <p>${md(q.explain)}</p><p class="src" style="margin:4px 0 0">${esc(q.source)}</p>`;
      shown.add(i);
      return ok;
    }

    form.addEventListener("change", (ev) => {
      const box = ev.target.closest(".tq");
      if (instant && box) reveal(+box.dataset.i);
      const done = qs.filter((_, i) => value(i) !== "").length;
      app.querySelector("#answered").textContent = `${done} of ${qs.length} answered`;
    });
    app.querySelector("#t-new").addEventListener("click", again);
    app.querySelector("#t-print").addEventListener("click", () => {
      document.body.classList.remove("print-key");
      window.print();
    });
    app.querySelector("#t-print-key").addEventListener("click", () => {
      document.body.classList.add("print-key");
      window.print();
      setTimeout(() => document.body.classList.remove("print-key"), 500);
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let right = 0;
      const per = {};
      qs.forEach((q, i) => {
        const ok = shown.has(i) ? EX.grade(q, value(i)) : reveal(i);
        if (ok) right++;
        per[q.week] = per[q.week] || { right: 0, total: 0 };
        per[q.week].total++;
        if (ok) per[q.week].right++;
      });
      const pct = Math.round((right / qs.length) * 100);
      const scores = store.get("drillScores", {});
      Object.entries(per).forEach(([w, v]) => (scores[w] = Math.round((v.right / v.total) * 100)));
      store.set("drillScores", scores);

      const res = app.querySelector("#result");
      res.hidden = false;
      res.innerHTML = `
        <div class="panel score">
          <div class="big">${pct}%</div>
          <div>
            <h2>${right} of ${qs.length} correct</h2>
            <table class="breakdown">
              ${Object.entries(per)
                .map(([w, v]) => {
                  const p = Math.round((v.right / v.total) * 100);
                  const wk = EX.weekByNum(+w);
                  return `<tr><td>${weekLabel(+w)} · ${esc(wk.title)}</td><td class="num">${v.right}/${v.total}</td><td class="bar"><i style="width:${p}%"></i></td><td><a href="#/guide/${wk.exam}/${wk.id}">Review</a></td></tr>`;
                })
                .join("")}
            </table>
            <div class="toolbar">
              <button type="button" class="btn" id="r-missed">${icon("funnel")}Show only missed</button>
              <button type="button" class="btn primary" id="r-new">${icon("shuffle")}New drill, same weeks</button>
            </div>
          </div>
        </div>`;
      form.querySelector(".submit-row").hidden = true;
      res.querySelector("#r-new").addEventListener("click", again);
      res.querySelector("#r-missed").addEventListener("click", (e2) => {
        const on = form.classList.toggle("only-missed");
        e2.currentTarget.innerHTML = on ? `${icon("list")}Show all` : `${icon("funnel")}Show only missed`;
      });
      form.before(res);
      res.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  route();
})();
