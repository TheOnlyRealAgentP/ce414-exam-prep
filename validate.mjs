// Checks the exam prep content in data/*.js.
// Usage: node validate.mjs   (or: python validate.py, if Node isn't installed)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ctx = { EX: { weeks: [], exams: [] } };
ctx.EX.week = (w) => ctx.EX.weeks.push(w);
ctx.EX.exam = (e) => ctx.EX.exams.push(e);
vm.createContext(ctx);
for (const f of fs.readdirSync(path.join(here, "data")).filter((f) => f.endsWith(".js")).sort()) {
  vm.runInContext(fs.readFileSync(path.join(here, "data", f), "utf8"), ctx, { filename: f });
}

const errors = [];
const err = (m) => errors.push(m);
const isStr = (s) => typeof s === "string" && s.trim().length > 0;
const ids = new Set();

for (const w of ctx.EX.weeks) {
  const at = `w${String(w.num).padStart(2, "0")}`;
  if (w.id !== at) err(`${at}: id should be "${at}"`);
  if (![1, 2].includes(w.exam)) err(`${at}: exam must be 1 or 2`);
  for (const k of ["title", "blurb"]) if (!isStr(w[k])) err(`${at}: missing ${k}`);
  if (!Array.isArray(w.notes) || !w.notes.length) err(`${at}: no notes`);
  for (const q of w.questions) {
    const where = `${at} ${q.id}`;
    if (ids.has(q.id)) err(`${where}: duplicate id`);
    ids.add(q.id);
    if (!q.id.startsWith(at + "-q")) err(`${where}: id should start with ${at}-q`);
    if (!["self-check", "reading", "hand-calc"].includes(q.from)) err(`${where}: from must be self-check, reading or hand-calc`);
    for (const k of ["prompt", "explain", "source"]) if (!isStr(q[k])) err(`${where}: missing ${k}`);
    if (q.type === "mc") {
      if (!Array.isArray(q.choices) || q.choices.length < 2) err(`${where}: needs at least two choices`);
      else if (new Set(q.choices).size !== q.choices.length) err(`${where}: repeated choice`);
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.choices || []).length) err(`${where}: answer out of range`);
    } else if (q.type === "tf") {
      if (typeof q.answer !== "boolean") err(`${where}: true/false answer must be true or false`);
    } else err(`${where}: type must be mc or tf`);
  }
}

for (const e of ctx.EX.exams) {
  const have = e.weeks.reduce((s, n) => s + (ctx.EX.weeks.find((w) => w.num === n)?.questions.length || 0), 0);
  const target = Object.values(e.target).reduce((s, n) => s + n, 0);
  if (target !== e.format.questions) err(`exam${e.id}: week targets add to ${target}, not ${e.format.questions}`);
  if (have < e.format.questions) err(`exam${e.id}: only ${have} questions for a ${e.format.questions}-question exam`);
}

const n = ctx.EX.weeks.reduce((s, w) => s + w.questions.length, 0);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${ctx.EX.weeks.length} weeks, ${n} questions, ${ctx.EX.exams.length} exams`);
