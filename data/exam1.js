EX.exam({
  id: 1,
  title: "Exam 1",
  name: "Midterm 1",
  weeks: [1, 2, 3, 4, 5, 6, 7],
  window: "Week 8 in the Testing Center (already taken this semester). Use it to review for the final.",
  status: "closed",
  format: {
    questions: 100,
    minutes: 180,
    points: 1,
    choices: 4
  },
  target: {
    1: 12,
    2: 14,
    3: 14,
    4: 14,
    5: 16,
    6: 16,
    7: 14
  },
  facts: [
    "**Format:** 100 multiple-choice questions, 1 point each, four choices and one best answer, grouped by week (Week 1 to Week 7).",
    "**Conditions:** Testing Center, paper and pencil, closed book and closed notes, no phone or computer. Any calculator that isn't a phone. **3 hours**; most students finish in about half that.",
    "**Question kinds:** ArcGIS Pro screenshots from the labs and lectures, compare four figures (grids, maps or triangulations) and pick the right one, and short hand calculations.",
    "**Printed on the exam:** the slope formulas and the D8 direction codes, so practice using them instead of memorizing them.",
    "**Only the answer sheet is scored.** Circle answers in the booklet as you go, but leave time to copy every letter over.",
    "**How to study (Dr. Ames):** retake the Learning Suite reading quizzes (a good number of questions come straight from them), retake the self-check quizzes, reread each lab's warnings and “Check the result” boxes, practice the hand calculations, and read all four options before you choose."
  ],
  drill: [
    "**Con() with NoData:** given a small grid with NoData cells, evaluate `Con(grid >= x, 1, 0)`. NoData cells stay NoData.",
    "**Slope at the center cell** of a 3×3 window (C = 10 m) by *both* methods. Check your arithmetic against 25.4° / 22.8° on the class example.",
    "**D8 direction:** compute drop ÷ distance for all 8 neighbors (√2 for diagonals), pick the max, write its code (1/2/4/8/16/32/64/128).",
    "**Flow accumulation (Esri):** count upstream cells excluding the cell itself, then apply a threshold to mark stream cells.",
    "**DMS → decimal degrees**, and slope percent ↔ degrees.",
    "**Linear interpolation** of a contour crossing between two cell values."
  ],
  traps: [
    "Project **before** any distance or area operation.",
    "Dissolve before counting, to avoid double counting.",
    "Float before Divide, or integer division wrecks NDVI.",
    "NoData ≠ 0.",
    "Georectify **before** digitizing, and validate with a point *not* used in the fit.",
    "RMS ≈ 0 proves nothing (Spline).",
    "The slope method, cell size and vertical units are part of the reported value.",
    "The D8 code goes in the cell the water **leaves**, and diagonals are farther.",
    "Snap the pour point.",
    "The stream threshold is a choice, not a result.",
    "Datum mismatch shifts every shoreline.",
    "A fixed iterator output name keeps only the last run.",
    "Gray canvas element = empty required parameter. Fix the leftmost one."
  ]
});
