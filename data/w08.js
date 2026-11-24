EX.week({
  id: "w08",
  num: 8,
  exam: 2,
  title: "Flood Mapping and HAND",
  reading: "",
  lab: "Lab 7",
  blurb: "The 100-year flood, gages and rating curves, bathtub versus river, HAND, and scoring one flood map against another.",
  notes: [
    "**100-year flood = a 1% chance of being exceeded in any one year.** The probability resets every year. Two can come back to back, and a 100-year record need not contain one. A gage's record of annual peaks can top the 100-year flow.",
    "**FEMA maps as GIS:** the AE zone is the 1%-annual-chance floodplain, and shaded X marks the moderate-risk (0.2%-annual-chance) area outside it. Check these two definitions against the Week 8 slides.",
    "**Stream gage:** measures **stage** (water level). The **rating curve** (built from field flow measurements at that gage, since every channel is different) converts stage ↔ flow. A flood flow above the top of the rating is **the least certain number** in the model, because it is extrapolated.",
    "**Lab 7 Step 1** reads the rating backwards: flow → gage height → flood depth **h** above the river. Keep **gage height, gage datum and zero-flow level** apart, and know which one h is measured from.",
    "**Bathtub model** (one flat water elevation) is right for a **lake**. A river's surface slopes downhill, so a flat elevation drowns low ground near the mouth and never reaches the river upstream.",
    { text: "**HAND (Height Above Nearest Drainage)** = a cell's elevation minus the elevation of the stream cell **it drains to** (measured along the flow path). A cell floods if **HAND ≤ h**, one threshold for the whole river.", sub: [
      "Example: cell A at 22.8 m drains to a river cell at 21.8 m, so HAND = 1.0 m. Cell B at 22.0 m drains to a river cell at 20.0 m, so HAND = 2.0 m. River rises 1.5 m, so **only A floods** (what counts is height above *its* river cell, not elevation).",
      "Built from Lab 5's chain (Fill → Flow Direction → Flow Accumulation → stream) plus **Flow Distance with the vertical option**. Euclidean Distance ignores flow, and Flow Accumulation only counts cells.",
      "**The stream definition is the biggest choice.** Call every gully a stream and every cell near a gully gets a small HAND, so one river depth floods them all and the 1% flood grows.",
      "Where HAND breaks: it's one threshold with no hydraulics. 1-D and 2-D hydraulic models add the water-surface slope, structures and timing."
    ] },
    { text: "**Scoring one flood map against another** (HAND vs. FEMA):", sub: [
      "**Hit rate** = share of FEMA's floodplain you caught (a map that floods everything gets a perfect hit rate).",
      "**False-alarm ratio** = share of *your* flooded area that FEMA calls dry.",
      "**CSI** = overlap ÷ (union of both maps), so it counts both errors at once."
    ] },
    { text: "**Lab 7 is two models** (HAND Builder, Flood Loop) because an iterator reruns *every tool in its model*. One model would rebuild HAND for each flood. HAND is the one thing passed between them.", sub: [
      "The loop runs in **centimeters** (H_CM = 153) because `flood_%Value%` would become `flood_1.53`, and a geodatabase raster name can't contain a period. The expression divides back: `Con(\"HAND\" <= %Value% / 100, 1)`.",
      "If Floods has **one row instead of five**, Merge wasn't fed by **Collect Values** and kept only the last pass. An unchecked multipart box does the opposite: dozens of rows per flood.",
      "Also know what the Extent environment, Raster to Polygon's settings and Spatial Join each do."
    ] }
  ],
  questions: [
    {
      id: "w08-q01",
      from: "self-check",
      source: "Self-check quiz: How Big, How High?",
      type: "mc",
      prompt: "What does \"the 100-year flood\" mean?",
      choices: [
        "A 1% chance of being exceeded each year",
        "A flood that happens once every hundred years",
        "The largest flow measured in the last century",
        "A flood that cannot recur for another century"
      ],
      answer: 0,
      explain: "It is a probability that resets every year, which is why FEMA writes \"1% annual chance\". Two such floods can come in back-to-back years; a 100-year record need not contain one."
    },
    {
      id: "w08-q02",
      from: "self-check",
      source: "Self-check quiz: How Big, How High?",
      type: "mc",
      prompt: "A stream gage measures stage, the water level. How does that reading become a flow?",
      choices: [
        "Through the gage's rating curve, built from field measurements",
        "The gage measures the flow directly with a sensor in the water",
        "Stage times the width of the river gives the flow",
        "FEMA's flood study converts each reading to a flow"
      ],
      answer: 0,
      explain: "The USGS measures the flow by hand many times, across low and high water, and fits a stage-to-flow curve for that gage: the rating curve. Every gage has its own, because every channel is different. For a flood, Lab 7 reads it backwards: flow to stage, then stage to a depth above the river."
    },
    {
      id: "w08-q03",
      from: "self-check",
      source: "Self-check quiz: How Big, How High?",
      type: "mc",
      prompt: "When is a bathtub model (one flat water elevation) the right flood model?",
      choices: [
        "A steep mountain river",
        "Any river, if the DEM is fine enough",
        "A river just below a dam",
        "A lake with a level surface"
      ],
      answer: 3,
      explain: "A lake's surface really is flat, which is why Lab 6's shorelines were bathtubs. A river's surface slopes downhill, so one flat elevation drowns the low ground near its mouth and never reaches the river upstream."
    },
    {
      id: "w08-q04",
      from: "self-check",
      source: "Self-check quiz: How Big, How High?",
      type: "mc",
      prompt: "Your flood map and FEMA's overlap well, but yours also floods a lot of land FEMA calls dry. Which score shows that?",
      choices: ["A high false-alarm ratio", "A high hit rate", "A low number of misses"],
      answer: 0,
      explain: "The false-alarm ratio is the share of your flooded area that FEMA calls dry. The hit rate only asks how much of FEMA's floodplain you caught, so a map that floods everything scores a perfect hit rate; CSI counts both errors at once."
    },
    {
      id: "w08-q05",
      from: "self-check",
      source: "Self-check quiz: How Big, How High?",
      type: "mc",
      prompt: "Lab 7's Flood Loop iterates over H_CM, each depth in whole centimeters (153), not H_M in meters (1.53). Why?",
      choices: [
        "Iterate Field Values can only read whole numbers from a table",
        "flood_%Value% would become flood_1.53, which is not a legal raster name",
        "HAND is stored in centimeters, so the threshold has to match it",
        "Raster Calculator rounds a decimal threshold to the nearest meter"
      ],
      answer: 1,
      explain: "%Value% goes into the output name as well as the expression, and a geodatabase raster name cannot contain a period: flood_153 works, flood_1.53 does not. The expression divides it back, Con(\"HAND\" <= %Value% / 100, 1), so the flood is still measured in meters."
    },
    {
      id: "w08-q06",
      from: "self-check",
      source: "Self-check quiz: How Big, How High?",
      type: "mc",
      prompt: "Your Flood Loop runs, but Floods has one row instead of five. The stage table has five rows. What went wrong?",
      choices: [
        "Merge was not fed by Collect Values, so it kept only the last pass",
        "Create multipart features was unchecked in Raster to Polygon",
        "Raster to Polygon simplified the polygons and merged the floods together",
        "HAND was built without the Extent environment set to the DEM"
      ],
      answer: 0,
      explain: "Collect Values gathers one polygon per pass, and Merge, fed from its Output Values, combines all five at the end. Fed straight from Calculate Field, Merge sees only the current pass and keeps the last flood. An unchecked multipart box does the opposite: dozens of rows per flood."
    },
    {
      id: "w08-q07",
      from: "self-check",
      source: "Self-check quiz: Height Above What?",
      type: "mc",
      prompt: "What does a cell's HAND value measure?",
      choices: [
        "Its elevation above sea level",
        "Its straight-line distance to the river",
        "Its drop to the stream it drains to"
      ],
      answer: 2,
      explain: "HAND follows the path the water takes (the flow direction) to the stream and measures the vertical drop along it. Sea level and straight-line distance ignore where the water actually goes."
    },
    {
      id: "w08-q08",
      from: "self-check",
      source: "Self-check quiz: Height Above What?",
      type: "mc",
      prompt: "Cell A is at 22.8 m and its water runs downhill to a river cell at 21.8 m. Cell B, farther down the valley, is at 22.0 m and drains to the river at 20.0 m. The river rises 1.5 m. Which cells flood?",
      choices: ["Only B, because it is lower", "Only A", "Both, because both are within 3 m of the river", "Neither"],
      answer: 1,
      explain: "HAND is A's 22.8 − 21.8 = 1.0 m and B's 22.0 − 20.0 = 2.0 m. Only cells with HAND at most 1.5 m flood, so the higher cell floods and the lower one stays dry: what counts is the height above the river each cell drains to, not the elevation."
    },
    {
      id: "w08-q09",
      from: "self-check",
      source: "Self-check quiz: Height Above What?",
      type: "mc",
      prompt: "Which tool turns Lab 5's chain into HAND?",
      choices: [
        "Flow Distance, vertical",
        "Flow Accumulation, with a weight raster",
        "Euclidean Distance to the river",
        "Raster Calculator subtracting a constant"
      ],
      answer: 0,
      explain: "Flow Distance measures along the flow path to the stream cells, and its vertical option gives the height difference: that is HAND. Euclidean Distance is horizontal and ignores flow; Flow Accumulation counts upstream cells."
    },
    {
      id: "w08-q10",
      from: "self-check",
      source: "Self-check quiz: Height Above What?",
      type: "mc",
      prompt: "You call every cell above an accumulation threshold a stream, with no river corridor. What happens to the 1% flood?",
      choices: [
        "It shrinks, because the river is narrower",
        "It grows: every gully floods",
        "Nothing; HAND ignores the streams"
      ],
      answer: 1,
      explain: "HAND is measured to whatever you call a stream. Make every gully a stream and every cell near a gully gets a small HAND, so one river depth floods them all; the stream definition is the biggest choice in the model."
    },
    {
      id: "w08-q11",
      from: "self-check",
      source: "Self-check quiz: Height Above What?",
      type: "mc",
      prompt: "A cell has HAND = 1.2 m. The flood depth h at the gage is 1.5 m. Is the cell flooded in the model?",
      choices: [
        "No: a cell floods only when its HAND is above the flood depth",
        "Only if its elevation is below the gage",
        "It depends on its distance to the gage",
        "Yes: its HAND, 1.2 m, is below the 1.5 m flood depth"
      ],
      answer: 3,
      explain: "The water rises 1.5 m above the stream, and this cell sits only 1.2 m above it, so it is under water. The model floods every cell with HAND less than or equal to h, one threshold for the whole river. Elevation and distance to the gage play no part; that is both HAND's strength and its limit."
    },
    {
      id: "w08-q12",
      from: "self-check",
      source: "Self-check quiz: Height Above What?",
      type: "mc",
      prompt: "Why is Lab 7 two models, HAND Builder and Flood Loop, instead of one?",
      choices: [
        "A model can have only one parameter",
        "An iterator reruns every tool in its model, so one model would rebuild HAND for every flood",
        "Flow Distance cannot run inside a model with an iterator",
        "The stage table has to live in a different geodatabase"
      ],
      answer: 1,
      explain: "An iterator drives every tool in its model, not just the ones after it. Put the HAND chain in the same model as the loop and Fill, Flow Direction, Flow Accumulation and Flow Distance run five times for one identical raster. Two models build HAND once and repeat only the cheap flooding steps; HAND is the one thing that passes between them."
    },
    {
      id: "w08-q13",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Your HAND flood map covers 80 km². FEMA's floodplain covers 100 km². The two overlap by 60 km². What is the CSI?",
      choices: ["0.25", "0.50", "0.60", "0.75"],
      answer: 1,
      explain: "CSI = overlap / union. Union = 80 + 100 − 60 = 120 km², so CSI = 60/120 = 0.50. For comparison: hit rate = 60/100 = 0.60 and false-alarm ratio = 20/80 = 0.25."
    },
    {
      id: "w08-q14",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Same maps (HAND 80 km², FEMA 100 km², overlap 60 km²). What is the false-alarm ratio?",
      choices: ["0.20", "0.25", "0.40", "0.60"],
      answer: 1,
      explain: "False-alarm ratio = the share of YOUR flooded area that FEMA calls dry = (80 − 60)/80 = 0.25."
    }
  ]
});
