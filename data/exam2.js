EX.exam({
  id: 2,
  title: "Exam 2",
  name: "Midterm 2",
  weeks: [8, 9, 10, 11, 12],
  window: "Opens Tue Dec 1 at 8:00 am, closes Thu Dec 3 at 9:00 pm. The Testing Center late fee starts at 2:00 pm Thursday, so go earlier.",
  status: "open",
  format: {
    questions: 100,
    minutes: 180,
    points: 1,
    choices: 4
  },
  target: {
    8: 20,
    9: 20,
    10: 20,
    11: 20,
    12: 20
  },
  facts: [
    "**Format:** 100 multiple-choice questions, 1 point each, four choices and one best answer, grouped by week (Week 8 to Week 12).",
    "**Conditions:** Testing Center, paper and pencil, closed book and closed notes, no phone or computer. Any calculator that isn't a phone. **3 hours**; most students finish in about half that.",
    "**Question kinds:** ArcGIS Pro screenshots from the labs and lectures, one compare-four-figures question, and short hand calculations.",
    "**Not on this exam:** coordinate systems, projections, datums and GPS; data standards and quality (Ch. 14); Lab 12.",
    "**Only the answer sheet is scored.** Circle answers in the booklet as you go, but leave time to copy every letter over.",
    "**How to study (Dr. Ames):** retake the Learning Suite reading quizzes, especially **Quiz 7 (Chapter 12)**; Quiz 8 came from the Week 10 slides and Quizzes 9 and 10 cover Weeks 11 and 12. Retake the self-check quizzes, reread each lab's warnings and “Check the result” boxes, and practice the hand calculations."
  ],
  drill: [
    "**IDW** at a point from 2–3 samples with exponent 1, then 2. Watch what the exponent does to the answer.",
    "**RMSE** from a handful of errors (square → mean → root). Then compute the mean error and see why it misleads.",
    "**Cut, fill and balance grade** for a small pad (mean ground height), plus the net haul at another grade.",
    "**Average end area** between two cross-sections.",
    "**Accumulated cost** along a row of cells, then the cheapest path across a small grid (a move costs the cell you enter, diagonals 1.414×).",
    "**HAND** for a cell, and which cells flood at depth h. Flood depth from a gage height.",
    "**Hit rate, false-alarm ratio and CSI** from three areas (FEMA, yours, overlap).",
    "**Minutes → buffer distance** at a speed."
  ],
  traps: [
    "A 100-year flood is a **1% chance every year**, not a once-a-century schedule.",
    "HAND is measured to the stream **a cell drains to**; the stream definition drives the answer.",
    "Flood loop in **centimeters**; **Collect Values** before Merge.",
    "Polygon to Raster Value field ≠ OBJECTID; Thiessen must keep **All fields**.",
    "Error = **truth − surface**; **square before you average**.",
    "Interpolators don't invent detail, and **realistic ≠ accurate**.",
    "Cut Fill: **positive = cut, negative = fill**. Balance grade = **mean**, not midpoint.",
    "Project the DEM before volumes. The **base** is the biggest choice in a volume.",
    "High cost = bad. **Cheapest ≠ shortest.** Back direction 90 = east.",
    "A weight only moves the route where the factor **varies** between routes.",
    "A missing junction silently breaks routes. **Solve** before you copy features.",
    "Service area (away) ≠ Closest Facility (toward). Buffers ignore roads."
  ]
});
