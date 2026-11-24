EX.week({
  id: "w07",
  num: 7,
  exam: 1,
  title: "Lake Bathymetry and Iterators",
  reading: "",
  lab: "Lab 6",
  blurb: "Terminal lakes and water balance, vertical datums, elevation–area–volume tables, and For iterators in ModelBuilder.",
  notes: [
    "A **terminal lake** (no outlet, like the Great Salt Lake) has a level that records the **basin's water balance**.",
    "**Bathymetry methods:** lead line (one point per drop), single-beam sonar (a line of points), **multibeam sonar (a swath)**, LiDAR/imagery for shallow areas.",
    "**Vertical datum:** a height only means something relative to a stated datum. NAVD88 heights at the GSL are **3.48 ft larger** than NGVD29, so mixing them puts every shoreline 3.48 ft off.",
    "**Elevation–area–volume table:** turns a gage level into area and volume (USGS, every 0.01 ft). One foot of level is *not* one foot of lake: near 4,190 ft it's about 30 sq mi per foot and near 4,200 ft up to ~100, because the bowl is flatter there.",
    "**Iterators:** a For iterator runs the model once per value (start → end by step), instead of you running it 20 times by hand. In `Con(\"Lake_Surface\" <= %Value%, 1)`, **%Value% is the current run's value**. With a *fixed* output name only the last run survives (silent overwrite), so put %Value% in the output name (Lab 6 renames it `%Elevation%`). **Collect Values** gathers the outputs and **Merge** combines them into one layer, one polygon per level.",
    "**Lab 6 diagnostics:** if every shoreline is identical at every level, the surface is still in meters NAVD88 (about 955–1,441) and never got converted to feet NGVD29. Also know: how many times the For loop runs, why the model keeps only the main pool, what Simplify Polygons changes, and which field types hold an elevation and an area (numeric: Double/Float, not text)."
  ],
  questions: [
    {
      id: "w07-q01",
      from: "self-check",
      source: "Self-check quiz: Lake Bathymetry",
      type: "mc",
      prompt: "The Great Salt Lake has no outlet. What does that make its water level a record of?",
      choices: [
        "The basin's water balance",
        "Only the rain that falls on the lake itself",
        "The depth of the deepest point in the lake",
        "How much water the gage station pumps"
      ],
      answer: 0,
      explain: "Water leaves a terminal lake only by evaporation, so its level rises when inflow beats evaporation and diversions, and falls when it does not. The gage at Saltair records that balance for the whole basin, Rock Canyon included."
    },
    {
      id: "w07-q02",
      from: "self-check",
      source: "Self-check quiz: Lake Bathymetry",
      type: "mc",
      prompt: "Which method gives a full swath of depths under a boat rather than a single line of points?",
      choices: ["A lead line", "Single-beam sonar", "A tide gage", "Multibeam sonar"],
      answer: 3,
      explain: "Multibeam sonar sends a fan of beams and records a swath of the bottom on each pass. Single-beam sonar gives one point straight down, so a line along the boat's track; a lead line gives one point per drop."
    },
    {
      id: "w07-q03",
      from: "self-check",
      source: "Self-check quiz: Lake Bathymetry",
      type: "mc",
      prompt: "The gage reads the lake in NGVD29 and the lake-bottom DEM is in NAVD88. What happens if you flood the DEM at the gage's number without converting?",
      choices: [
        "Nothing — the two datums are the same",
        "Every shoreline is 3.48 ft off",
        "Only the volume is wrong, not the area",
        "The DEM refuses to load"
      ],
      answer: 1,
      explain: "A height is only meaningful above a stated datum. At the Great Salt Lake a NAVD88 height is 3.48 ft larger than the NGVD29 height of the same surface, so using one datum's number on the other's DEM floods the lake 3.48 ft wrong everywhere."
    },
    {
      id: "w07-q04",
      from: "self-check",
      source: "Self-check quiz: Lake Bathymetry",
      type: "mc",
      prompt: "Near 4,190 ft one foot of level covers about 30 sq mi of lakebed; near 4,200 ft it covers up to about 100. Why?",
      choices: [
        "The gage is less accurate at higher levels",
        "The bowl is flatter at those higher shores",
        "Evaporation is faster when the lake is high",
        "The USGS table uses a different step there"
      ],
      answer: 1,
      explain: "Area added per foot depends on how gently the shore rises. Where the bottom is nearly flat, a small rise or drop in level moves the shoreline a long way, which is why a lake falling through the 4,190s and 4,200s exposes lakebed so quickly."
    },
    {
      id: "w07-q05",
      from: "self-check",
      source: "Self-check quiz: Lake Bathymetry",
      type: "mc",
      prompt: "What does an elevation–area–volume table let you do?",
      choices: [
        "Turn a level into area and volume",
        "Measure the depth of the lake directly",
        "Convert between NGVD29 and NAVD88",
        "Find where the lake's inflow comes from"
      ],
      answer: 0,
      explain: "The USGS computed the lake's area and volume at every 0.01 ft from its lake-bottom DEM, so a level read off the gage becomes an area and a volume. In Lab 6 the same table is your check: your own areas should match it."
    },
    {
      id: "w07-q06",
      from: "self-check",
      source: "Self-check quiz: Lake Depth Explorer",
      type: "mc",
      prompt: "What does an iterator in ModelBuilder do?",
      choices: [
        "Runs the model once per value",
        "Makes every tool in the model run faster",
        "Checks the model for errors before it runs",
        "Adds a parameter to the model's dialog"
      ],
      answer: 0,
      explain: "An iterator turns one model into many runs: For counts from a start to an end by a step, and every tool after it runs once per value. You state the list once instead of running the model twenty times by hand."
    },
    {
      id: "w07-q07",
      from: "self-check",
      source: "Self-check quiz: Lake Depth Explorer",
      type: "mc",
      prompt: "In the expression Con(\"Lake_Surface\" <= %Value%, 1), what is %Value%?",
      choices: [
        "A field in the lake surface's table",
        "This run's value from the iterator",
        "A fixed number you type once",
        "The name of the output raster"
      ],
      answer: 1,
      explain: "%name% means put this variable's current value here — the same idea as %Threshold% in Lab 5. Fed by the For iterator, it is a different water level on every run."
    },
    {
      id: "w07-q08",
      from: "self-check",
      source: "Self-check quiz: Lake Depth Explorer",
      type: "mc",
      prompt: "Your loop writes every run's output to the same name, Lake. What do you get at the end?",
      choices: [
        "One feature class with every level in it",
        "An error on the second run, every time",
        "Every level, renamed automatically",
        "Only the last level survives"
      ],
      answer: 3,
      explain: "Each run of the loop writes its output; with one fixed name, each run replaces the one before, and nothing tells you. Putting %Value% in the output name (Lake_%Value%) gives every run its own dataset."
    },
    {
      id: "w07-q09",
      from: "self-check",
      source: "Self-check quiz: Lake Depth Explorer",
      type: "mc",
      prompt: "What are Collect Values and Merge for in the Lab 6 model?",
      choices: [
        "Gathering all runs into one layer",
        "Choosing which water levels the loop runs",
        "Converting the shoreline raster to polygons",
        "Checking each area against the USGS table"
      ],
      answer: 0,
      explain: "Collect Values gathers one output from every run of the loop; Merge combines them into a single feature class, one polygon per level, which is what you map and measure."
    },
    {
      id: "w07-q10",
      from: "self-check",
      source: "Self-check quiz: Lake Depth Explorer",
      type: "mc",
      prompt: "Every shoreline your Lake Powell model draws is the same, at every level from 3,500 to 3,700 ft. What is the likeliest cause?",
      choices: [
        "The For iterator ran only once",
        "The surface is still in meters",
        "The step is too large",
        "Merge combined the levels wrongly"
      ],
      answer: 1,
      explain: "The Lab 6 surface arrives in meters NAVD88, from about 955 to 1,441. Every one of those is below 3,500, so if you skip the conversion to feet NGVD29, every cell floods at every level and nothing moves. A shoreline that does not change with the elevation is the giveaway; Step 1 converts the surface first."
    },
    {
      id: "w07-q11",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A gage reads the Great Salt Lake at 4,192.00 ft NGVD29. The lake-bottom DEM is in NAVD88, which is 3.48 ft higher at the lake. What level do you flood the DEM at?",
      choices: ["4,188.52 ft", "4,192.00 ft", "4,195.48 ft", "4,195.00 ft"],
      answer: 2,
      explain: "The same water surface reads 3.48 ft higher in NAVD88: 4,192.00 + 3.48 = 4,195.48 ft. Using the gage number unconverted puts every shoreline 3.48 ft off."
    }
  ]
});
