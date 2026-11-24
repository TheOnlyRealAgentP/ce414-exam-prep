EX.week({
  id: "w03",
  num: 3,
  exam: 1,
  title: "Raster Analysis and Map Algebra",
  reading: "Bolstad Ch. 10",
  lab: "Lab 2",
  blurb: "Measurements versus labels, map algebra and what must line up, NDVI, local/focal/zonal/global tools, NoData and Con().",
  notes: [
    { text: "**Categorical vs. continuous** (is the number a measurement or a label?)", sub: [
      "**Categorical:** NLCD (41 = forest, 11 = water are nominal codes, so averaging is meaningless), HUC watershed ID, FEMA flood zones.",
      "**Continuous:** NDVI, slope in degrees, water-surface elevation or depth.",
      "Reclassifying a continuous raster (NDVI threshold, or gentle/moderate/steep slope) makes it categorical."
    ] },
    "**Map algebra:** math on rasters, cell by cell. Four things must line up before two rasters combine: **coordinate system, cell size, alignment (snap raster), extent** (output = intersection unless set otherwise). If a tool must resample, use **nearest neighbor for labels** and **bilinear/cubic for measurements**.",
    "**Integer division** truncates a ratio. That's why Lab 2 uses **Float** on both bands before Minus, Plus and Divide. Skip it and the NDVI is wrong.",
    "**NDVI = (NIR − Red) / (NIR + Red).** Red is absorbed by chlorophyll and NIR is reflected by leaf structure, so the two bands contrast most for healthy vegetation.",
    { text: "**Function families:**", sub: [
      "**Local**: cell in → same cell out (Reclassify, Con, Float, Plus, Minus, Divide).",
      "**Focal**: moving window (smoothing, majority filter).",
      "**Zonal**: zone stands still → one row per zone (Zonal Statistics as Table). It loses *where* inside the zone things happen.",
      "**Global**: whole raster."
    ] },
    "**Filters:** a 5×5 mean turns a sharp boundary into a ramp a few cells wide (smoothing removes noise *and* detail, so a smoothed DEM gives a worse slope map). Also know the high-pass and majority filters.",
    "**NoData ≠ 0.** Anything combined with NoData is NoData, and statistics skip it. Boolean map algebra treats 0 as false and non-zero as true. Multiplying by a 0/1 mask sets masked cells to 0 and leaves the rest unchanged.",
    "**Con():** `Con(\"NDVI\" >= 0.4, 1, 0)`. Know what it returns where the input is NoData (NoData out). Lab 2 uses Con instead of a Reclassify table because **a number in an expression can become a model parameter**, which makes a threshold sweep possible.",
    "**Threshold sweep result:** raising the threshold from 0.3 to 0.7 cut vegetated area from 1,327 to 496 sq mi (63% → 24% of the county), a fall of more than half. A recommendation must say which threshold it used.",
    "Sanity check: 6,040,284 cells with data."
  ],
  questions: [
    {
      id: "w03-q01",
      from: "self-check",
      source: "Self-check quiz: Categorical or Continuous?",
      type: "mc",
      prompt: "National Land Cover Database (NLCD)",
      choices: ["Categorical", "Continuous"],
      answer: 0,
      detail: "Cells are classified into categories like Deciduous Forest, Developed High Intensity, or Open Water.",
      explain: "The values are discrete classes. The numbers stored (41 for forest, 11 for water) are nominal codes, not quantities — the average of 41 and 11 is not a land cover type."
    },
    {
      id: "w03-q02",
      from: "self-check",
      source: "Self-check quiz: Categorical or Continuous?",
      type: "mc",
      prompt: "Watershed identifier (HUC)",
      choices: ["Categorical", "Continuous"],
      answer: 0,
      detail: "Cells tagged with the drainage basin they flow into.",
      explain: "A basin ID is a nominal label. Two adjacent cells in basins 16020202 and 16020203 are neighbors, not one unit apart in anything."
    },
    {
      id: "w03-q03",
      from: "self-check",
      source: "Self-check quiz: Categorical or Continuous?",
      type: "mc",
      prompt: "Normalized Difference Vegetation Index (NDVI)",
      choices: ["Categorical", "Continuous"],
      answer: 1,
      detail: "The Lab 2 output: (NIR − red) ÷ (NIR + red), between −1.0 and +1.0.",
      explain: "NDVI is a ratio of measurements, so it is continuous. Note what happens in Lab 2: the moment you apply the threshold table, the continuous index becomes a categorical vegetation map."
    },
    {
      id: "w03-q04",
      from: "self-check",
      source: "Self-check quiz: Categorical or Continuous?",
      type: "mc",
      prompt: "Slope in degrees, straight from the Slope tool",
      choices: ["Categorical", "Continuous"],
      answer: 1,
      detail: "Calculated from a DEM, ranging from 0° to 90°.",
      explain: "As calculated it is continuous. Reclassify it into gentle, moderate and steep for a suitability analysis and it becomes categorical — that is Lab 2 Step 3 in a different costume."
    },
    {
      id: "w03-q05",
      from: "self-check",
      source: "Self-check quiz: Categorical or Continuous?",
      type: "mc",
      prompt: "FEMA flood hazard zones",
      choices: ["Categorical", "Continuous"],
      answer: 0,
      detail: "Areas designated Zone A (100-year floodplain), Zone X (minimal hazard), or regulatory floodway.",
      explain: "A regulatory flood map sorts risk into discrete zones. Contrast it with a water-surface-elevation or depth raster from a hydraulic model, which is continuous."
    },
    {
      id: "w03-q06",
      from: "self-check",
      source: "Self-check quiz: Which Family?",
      type: "mc",
      prompt: "Reclassify",
      choices: ["Local", "Focal", "Zonal", "Global"],
      answer: 0,
      detail: "A raster of NDVI values goes in; a raster of class numbers comes out, cell for cell.",
      explain: "One cell in, one cell out: a cell's new value depends only on that same cell's old value. Every tool in the Lab 2 model — Float, Minus, Plus, Divide, Con, Reclassify — is local for the same reason."
    },
    {
      id: "w03-q07",
      from: "self-check",
      source: "Self-check quiz: Which Family?",
      type: "mc",
      prompt: "You run a 5 by 5 mean over the NDVI at the center pivots. What happens to the sharp boundary between a green field and the bare ground around it?",
      choices: [
        "The boundary shifts one cell into the field",
        "The step becomes a ramp a few cells wide",
        "The boundary sharpens, because averaging removes stray values",
        "Nothing changes at the boundary; only interior cells are averaged"
      ],
      answer: 1,
      explain: "For several positions in a row the window straddles the boundary and mixes the two populations, so an abrupt step comes out as a gradient. Smoothing removes noise, and it removes real detail with it — which is why a smoothed DEM makes a worse slope map."
    },
    {
      id: "w03-q08",
      from: "self-check",
      source: "Self-check quiz: Which Family?",
      type: "mc",
      prompt: "Zonal Statistics as Table, run with city boundaries over the NDVI",
      choices: [
        "A raster with every cell in a city replaced by that city's mean",
        "A table with one row per cell, tagged with the city it falls in",
        "A table with one row per city, which loses where inside the city the green is",
        "A raster smoothed inside each city and unchanged outside"
      ],
      answer: 2,
      detail: "What comes out of the tool, and what does it cost you?",
      explain: "A zone stands still and writes one row — that is the difference from a focal function, where the window moves and writes a value at every cell. The table joins back to the polygons and maps, but the pattern inside a zone is gone, which is why the standard deviation column is worth reading."
    },
    {
      id: "w03-q09",
      from: "self-check",
      source: "Self-check quiz: Which Family?",
      type: "mc",
      prompt: "Why does the Lab 2 model classify with a Con() expression rather than a Reclassify table?",
      choices: [
        "Con() runs faster than Reclassify on a large raster",
        "Reclassify is not part of the Spatial Analyst toolbox",
        "Con() is a focal function, so it smooths the class boundary",
        "A number in an expression can become a model parameter"
      ],
      answer: 3,
      explain: "The threshold has to be reachable from the tool dialog. Mark the variable as a parameter, exactly as in Week 2, and the sweep becomes five runs of a tool instead of five edits of an expression. Con is local, not focal, and Reclassify sits in the Reclass toolset of Spatial Analyst."
    },
    {
      id: "w03-q10",
      from: "self-check",
      source: "Self-check quiz: Which Family?",
      type: "mc",
      prompt: "In the sweep, as the threshold is raised from 0.3 to 0.7, the area classified as vegetated...",
      choices: [
        "changes by only a few percent, so the choice hardly matters",
        "rises, because a higher threshold admits more cells",
        "falls at first, then levels off above 0.5",
        "falls by more than half"
      ],
      answer: 3,
      explain: "1,327 square miles at 0.3 down to 496 at 0.7 — 63 percent of the county down to 24 percent. That is why a recommendation that does not say which threshold it used is not a recommendation, and why the sweep is a Lab 2 deliverable rather than a footnote."
    },
    {
      id: "w03-q11",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A row of a raster reads 3, NoData, 7, 5. You run Con(\"grid\" >= 5, 1, 0). What comes out?",
      choices: ["0, 0, 1, 1", "0, NoData, 1, 1", "0, 1, 1, 1", "NoData, NoData, 1, 1"],
      answer: 1,
      explain: "Con is a local function, so each cell is evaluated on its own. The NoData cell stays NoData (anything combined with NoData is NoData). It does not become 0 or 1."
    },
    {
      id: "w03-q12",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Landsat bands are stored as integers. A cell has NIR = 200 and Red = 50. After Float on both bands, what is its NDVI?",
      choices: ["0.25", "0.60", "0.75", "1.50"],
      answer: 1,
      explain: "NDVI = (NIR − Red) / (NIR + Red) = (200 − 50) / (200 + 50) = 150 / 250 = 0.60. Skip Float and integer division would truncate the ratio."
    },
    {
      id: "w03-q13",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Which of these is NOT one of the four things that must line up before two rasters can be combined?",
      choices: ["Coordinate system", "Cell size", "Alignment (snap raster)", "Color ramp"],
      answer: 3,
      explain: "The four are coordinate system, cell size, alignment and extent. Symbology has no effect on map algebra."
    }
  ]
});
