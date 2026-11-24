EX.week({
  id: "w10",
  num: 10,
  exam: 2,
  title: "Cut, Fill and Raster Volumes",
  reading: "",
  lab: "Lab 9",
  blurb: "Cut and fill by cell, balance grade, the Cut Fill sign, average end area, raster volumes and why the base surface matters.",
  notes: [
    "**Cut/fill per cell:** ground above the design surface = **cut** (dig out); below = **fill** (build up). Volume = height difference × cell area. Example: ground 2 m above design on a 10 m cell = **200 m³ of cut**.",
    "**Cut Fill tool sign:** **positive VOLUME = material removed (cut); negative = material added (fill)**; unchanged = 0. Getting the sign backwards flips the whole report.",
    { text: "**Balance grade of a level pad = the *mean* ground height** under the pad (not the midpoint of the range, which only matches on a uniform slope). Raise the grade and you get **less cut, more fill**.", sub: [
      "Example: four 10 m cells at 100, 100, 100, 112 m. Mean = 103 m. At 103: cut 9 × 100 = 900 m³, fill 3 × 3 × 100 = 900 m³, balanced. At 105: cut 700, fill 1,500, so net fill 800 m³."
    ] },
    "A grid volume of a pad **leaves out the side slopes** where the pad ties back to the ground, plus swell/shrink, unusable material and DEM error. It's a first estimate.",
    "**Road earthwork by average end area:** V = (A₁ + A₂)/2 × distance between sections. Example: 40 and 60 m² sections, 50 m apart = (40 + 60)/2 × 50 = **2,500 m³**.",
    "**Any raster volume = Σ (height × cell area).** 10 m cell standing 50 m above the base = 50 × 100 = **5,000 m³**. Divide by 1,000³ for km³.",
    "**Project the DEM first.** A DEM in lat/lon has cell size in degrees, so the cell area is wrong.",
    "**Surface Volume (3D Analyst)** does the whole job only when the **base is a flat plane**. For a curved base (Lab 9's interpolated plain), use **Raster Calculator (height) + Zonal Statistics (Sum)**.",
    "**The base surface is the biggest choice.** Three flat bases gave Big Southern Butte 4.51–5.46 km³ (about a fifth of the volume). A flat base is poor because **the plain slopes north**, so one elevation is too high on one side and too low on the other. An interpolated base follows the plain.",
    "**Lab 9:** know the units of each Raster Calculator output, what Zonal Statistics with Sum writes, why the points on the butte are erased before interpolating the base, why a wider outline changes the volume, and what a **spline** base can do that an **IDW** base can't (go beyond the range of the sample points)."
  ],
  questions: [
    {
      id: "w10-q01",
      from: "self-check",
      source: "Self-check quiz: Cut or Fill?",
      type: "mc",
      prompt: "A cell's ground is 2 m above the design surface. Cut or fill, and how much for a 10 m cell?",
      choices: ["Fill, 20 m³", "Cut, 200 m³", "Cut, 20 m³", "Fill, 200 m³"],
      answer: 1,
      explain: "Ground above the design must be dug out: cut. Its volume is the height difference times the cell's area, 2 m x 100 m² = 200 m³."
    },
    {
      id: "w10-q02",
      from: "self-check",
      source: "Self-check quiz: Cut or Fill?",
      type: "mc",
      prompt: "You raise a level pad's grade by 1 m. What happens?",
      choices: ["Cut and fill both grow", "Less cut and more fill", "More cut and less fill"],
      answer: 1,
      explain: "A higher grade leaves less ground above it to dig and more space below it to build up. The balance grade is where the two curves cross."
    },
    {
      id: "w10-q03",
      from: "self-check",
      source: "Self-check quiz: Cut or Fill?",
      type: "mc",
      prompt: "On a grid, at what grade does a level pad's cut equal its fill?",
      choices: [
        "The lowest ground cell",
        "The highest ground cell",
        "Halfway between highest and lowest",
        "The mean ground height under the pad"
      ],
      answer: 3,
      explain: "Cut minus fill is the sum of (ground minus grade) times the cell area, which is zero exactly when the grade is the mean of the ground cells. The midpoint of the range only matches the mean on a perfectly uniform slope."
    },
    {
      id: "w10-q04",
      from: "self-check",
      source: "Self-check quiz: Cut or Fill?",
      type: "mc",
      prompt: "In ArcGIS Pro's Cut Fill output, a region has VOLUME = -5,000 m³. What happened there?",
      choices: ["Material was added: fill", "Material was removed: cut", "The surfaces did not change"],
      answer: 0,
      explain: "Cut Fill reports material removed as positive and material added as negative; unchanged cells get zero. Getting the sign backwards flips a whole earthwork report."
    },
    {
      id: "w10-q05",
      from: "self-check",
      source: "Self-check quiz: Cut or Fill?",
      type: "mc",
      prompt: "Which does a simple grid volume of a level pad leave out?",
      choices: ["The cell size", "The side slopes at the pad's edges", "The ground elevation", "The pad's grade"],
      answer: 1,
      explain: "A real pad ties back to the ground with cut and fill slopes, which add earthwork. Swell and shrink, unusable material and DEM error are also left out; the grid gives a first estimate."
    },
    {
      id: "w10-q06",
      from: "self-check",
      source: "Self-check quiz: The Base Is the Answer",
      type: "mc",
      prompt: "A 10 m cell stands 50 m above the base. What is its volume?",
      choices: ["500 m³", "5,000 m³", "50,000 m³", "5 km³"],
      answer: 1,
      explain: "Height times the cell's area: 50 m x 100 m² = 5,000 m³. Sum every cell for the total, and divide by 1,000³ for cubic kilometers."
    },
    {
      id: "w10-q07",
      from: "self-check",
      source: "Self-check quiz: The Base Is the Answer",
      type: "mc",
      prompt: "You sum height x 100 on a DEM still in latitude and longitude. What goes wrong?",
      choices: ["Nothing; ArcGIS Pro converts the units", "The heights are in degrees", "Its cell area is wrong"],
      answer: 2,
      explain: "A geographic DEM's cell size is in degrees, and its cells are not 10 m squares. Project to a coordinate system in meters first, so the cell area and the heights are in the same unit."
    },
    {
      id: "w10-q08",
      from: "self-check",
      source: "Self-check quiz: The Base Is the Answer",
      type: "mc",
      prompt: "When does Surface Volume (3D Analyst) do the whole job?",
      choices: ["When the base is a flat plane", "When the base is an interpolated surface", "Only for lakes"],
      answer: 0,
      explain: "Surface Volume measures above or below one flat plane. A curved base, like Lab 9's interpolated plain, needs Raster Calculator for the height and Zonal Statistics (Sum) for the total."
    },
    {
      id: "w10-q09",
      from: "self-check",
      source: "Self-check quiz: The Base Is the Answer",
      type: "mc",
      prompt: "Three flat bases gave Big Southern Butte 4.51 to 5.46 km³. What does that spread show?",
      choices: [
        "The DEM is too coarse",
        "The outline was digitized wrong",
        "The base drives the answer",
        "Flat bases cannot give volumes"
      ],
      answer: 2,
      explain: "Same DEM, same outline: only the base changed, and the volume moved by about a fifth. That is why Lab 9 rebuilds the plain by interpolation instead of picking one elevation."
    },
    {
      id: "w10-q10",
      from: "self-check",
      source: "Self-check quiz: The Base Is the Answer",
      type: "mc",
      prompt: "Why is a flat base a poor choice under Big Southern Butte?",
      choices: [
        "The plain slopes to the north",
        "Flat bases are slower to compute",
        "The butte is not in Utah",
        "Rhyolite is too dense to measure"
      ],
      answer: 0,
      explain: "The plain around the butte is not level, so one elevation sits too high on one side and too low on the other. An interpolated base follows the plain from points sampled all around it."
    },
    {
      id: "w10-q11",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A level pad covers four 10 m cells with ground heights 100, 100, 100 and 112 m. At what grade does cut equal fill?",
      choices: ["100 m", "103 m", "106 m", "112 m"],
      answer: 1,
      explain: "Balance grade = mean ground height = (100 + 100 + 100 + 112)/4 = 103 m. The midpoint of the range (106 m) is the trap. Check: at 103 the cut is 9 × 100 = 900 m³ and the fill is 3 × 3 × 100 = 900 m³."
    },
    {
      id: "w10-q12",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Same pad (ground 100, 100, 100, 112 m on four 10 m cells), designed at a grade of 105 m. What is the earthwork?",
      choices: ["Net cut of 800 m³", "Net fill of 800 m³", "Balanced", "Net fill of 2,200 m³"],
      answer: 1,
      explain: "Cut: (112 − 105) × 100 = 700 m³. Fill: 3 cells × 5 m × 100 = 1,500 m³. Net = 800 m³ more fill than cut, so material must be imported."
    },
    {
      id: "w10-q13",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Cross-sections 50 m apart have cut areas of 40 m² and 60 m². What is the volume by average end area?",
      choices: ["2,000 m³", "2,500 m³", "5,000 m³", "100,000 m³"],
      answer: 1,
      explain: "V = (A₁ + A₂)/2 × distance = (40 + 60)/2 × 50 = 2,500 m³."
    }
  ]
});
