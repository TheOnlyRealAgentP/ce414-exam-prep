EX.week({
  id: "w02",
  num: 2,
  exam: 1,
  title: "ModelBuilder",
  reading: "Bolstad Ch. 13",
  lab: "Lab 1",
  blurb: "Why models, reading a ModelBuilder canvas, projecting before you buffer, parameters, metadata, and cartographic models from the reading.",
  notes: [
    "**Model** = intentional simplification of the real world (globe, paper map, Manning's equation). Most models aren't computer programs.",
    "Dialog, Python window, model and script all run the *same* tool underneath. What differs is **repeatability**: the model or script *is* the analysis written down.",
    "**Canvas colors:** blue = input data, yellow = tool, green = derived data. **Gray = not ready (a required parameter is empty)**; it propagates downstream, so fix the *leftmost* gray element first. A **green check** = that step has run and its output exists.",
    { text: "**Cities Near Rivers:**", sub: [
      "Project *before* buffering, because lat/lon has no meaningful \"10 miles\". Use a projected CRS with linear units (USA Contiguous Equidistant Conic), and accept the datum transformation knowingly.",
      "**Dissolve** the buffers so a city inside two overlapping buffers isn't counted twice (256 of 678 cities).",
      "Select Layer By Location gave 257 because the distance was measured geodesically instead of on a plane. Both are defensible, so state which you used."
    ] },
    "**Parameters:** double-click runs the model as a tool; right-click → Edit opens the canvas. \"No Parameters\" means everything is baked in and the model answers one question. To let users pick a buffer distance: Create Variable ▸ From Parameter, *then* mark the variable as a parameter (the \"P\"). Lab 1 Step 10 does this on the road buffer.",
    "**Sketched models:** two tool boxes touching directly means a dataset is missing. Every tool's output must be drawn.",
    "**Metadata:** Summary and Usage hold what a future user needs; blank fields come back as \"no explanation\". An undocumented model is write-only.",
    "A smaller model is often the better model. Correct ≠ smallest ≠ easiest to explain.",
    "**Lab 1:** know the tool order that built the density field, why it had to be **Double**, and that **Erase** carries out the Boolean NOT.",
    { text: "**Reading (Ch. 13):**", sub: [
      "Classify a model as cartographic, simple spatial, or spatio-temporal.",
      "Ranking vs. weighting.",
      "Write site criteria as Boolean (AND / OR / NOT).",
      "General vs. refined criteria.",
      "Most cartographic models are temporally static."
    ] }
  ],
  questions: [
    {
      id: "w02-q01",
      from: "self-check",
      source: "Self-check quiz: Models and ModelBuilder",
      type: "mc",
      prompt: "A globe, a paper map, an aerial photograph, and Manning's equation are all models. What do they have in common?",
      choices: [
        "Each one is a computer program",
        "Each one is an intentional simplification of the real world",
        "Each one stores one number per cell",
        "Each one was built in ModelBuilder"
      ],
      answer: 1,
      explain: "A model is an idealized, simplified representation of reality — an abstraction. Nothing on today's list of model types (theory, law, hypothesis, equation, structured idea) is a computer program; we model constantly and only sometimes write code."
    },
    {
      id: "w02-q02",
      from: "self-check",
      source: "Self-check quiz: Models and ModelBuilder",
      type: "mc",
      prompt: "The Buffer step of Cities Near Rivers was shown four ways: the tool dialog, the Python window, a model, and a script. What actually differs between them?",
      choices: [
        "The geoprocessing tool each one calls",
        "The answer each one produces",
        "How repeatable the analysis is",
        "The coordinate system each one writes out"
      ],
      answer: 2,
      explain: "All four front ends call the identical geoprocessing tool underneath and give the same result. What changes is repeatability: a dialog run is gone once you close it, while a model or a script is the analysis written down and can be run again."
    },
    {
      id: "w02-q03",
      from: "self-check",
      source: "Self-check quiz: Models and ModelBuilder",
      type: "mc",
      prompt: "An element on your ModelBuilder canvas is gray instead of colored. What does that tell you?",
      choices: [
        "A required parameter is still empty",
        "That step has already run",
        "It is flagged as intermediate data",
        "The output has been added to the map"
      ],
      answer: 0,
      explain: "Gray means not ready to run, and it propagates downstream — so fix the leftmost gray element first. Colored means ready (blue input data, yellow tool, green derived data), and a green check means that step has already executed and its output exists on disk."
    },
    {
      id: "w02-q04",
      from: "self-check",
      source: "Self-check quiz: Models and ModelBuilder",
      type: "mc",
      prompt: "Cities Near Rivers projects both layers before it buffers anything. Why?",
      choices: [
        "Buffer only accepts line features",
        "The inputs are in latitude and longitude, where “10 miles” has no meaning",
        "Projecting makes the model run faster",
        "Intersect requires the two layers to be in different coordinate systems"
      ],
      answer: 1,
      explain: "A distance in miles needs a projected coordinate system with real linear units, so both layers go to USA Contiguous Equidistant Conic first — and because the datum changes, ArcGIS Pro proposes a geographic transformation you should accept knowingly."
    },
    {
      id: "w02-q05",
      from: "self-check",
      source: "Self-check quiz: Models and ModelBuilder",
      type: "mc",
      prompt: "The Buffer step of Cities Near Rivers dissolves all the river buffers into one feature. What does that dissolve prevent?",
      choices: [
        "Buffers that cross a state line",
        "The buffer distance reverting to meters",
        "The intermediate data being written to disk",
        "A city counted twice where buffers overlap"
      ],
      answer: 3,
      explain: "Without the dissolve, a city sitting inside two overlapping river buffers comes through Intersect as two records, and the count is wrong. Dissolving first is what makes “256 of 678 cities” a count of cities rather than a count of city-buffer pairs."
    },
    {
      id: "w02-q06",
      from: "self-check",
      source: "Self-check quiz: Canvas to Tool",
      type: "mc",
      prompt: "In a sketched model, one tool box feeds straight into another tool box",
      choices: [
        "It breaks a rule: a dataset has gone missing",
        "Fine — the first tool's output is obvious from its name",
        "Fine, as long as the model starts and ends with data",
        "It breaks a rule: the shapes are not consistent"
      ],
      answer: 0,
      detail: "There is no data shape between them. The arrows are solid-headed and the flow goes one way.",
      explain: "A tool's output is data. If two tools touch, an intermediate dataset exists but nobody wrote it down, and the reader cannot see where it went. The same goes for two data shapes in a row: something happened in between and it was not recorded. That is exactly what makes a real ModelBuilder canvas unreadable."
    },
    {
      id: "w02-q07",
      from: "self-check",
      source: "Self-check quiz: Canvas to Tool",
      type: "mc",
      prompt: "You double-click your model and the dialog says No Parameters",
      choices: [
        "It is broken and has to be rebuilt",
        "It will run, and give the same answer every time",
        "It will run, but only from the canvas",
        "It will run only after you write its metadata"
      ],
      answer: 1,
      detail: "It is the model you built and ran on Tuesday, and it worked.",
      explain: "Without parameters everything is baked in — which rivers, which cities, which distance — so the model is a recording of one specific analysis. It runs fine; it just answers one question, and to make it answer a different one somebody has to open the canvas. Remember which click does which: double-click runs the model as a tool, right-click and Edit opens the canvas."
    },
    {
      id: "w02-q08",
      from: "self-check",
      source: "Self-check quiz: Canvas to Tool",
      type: "mc",
      prompt: "You want whoever runs the model to choose the buffer distance",
      choices: [
        "Mark the Buffer tool itself as a parameter",
        "Rename the Buffer tool so the distance shows in its label",
        "Make Buffer's Distance a variable, then a parameter",
        "Put the distance in the model's metadata under Usage"
      ],
      answer: 2,
      detail: "Right now that distance lives inside the Buffer tool's own dialog.",
      explain: "Two separate moves. Create Variable ▸ From Parameter pulls a setting out of a tool and onto the canvas as its own element; marking that element as a parameter is the second step, the one that puts the P on it and makes it an input the user supplies. The submenu is the tool's own list of settings, so what you can expose depends on the tool. Lab 1 Step 10 is this exact move on the road buffer."
    },
    {
      id: "w02-q09",
      from: "self-check",
      source: "Self-check quiz: Canvas to Tool",
      type: "mc",
      prompt: "Buffer + Intersect found 256 cities; Select Layer By Location found 257",
      choices: [
        "One of the two models has a bug in it",
        "Select Layer By Location is the more accurate tool in every case",
        "The counts must match; rerun both and they will",
        "The 10 miles was measured two different ways, and one city sits at the edge"
      ],
      answer: 3,
      detail: "Same rivers, same cities, the same 10 miles, two models built on the same data.",
      explain: "Buffer + Intersect measured the distance on a projected plane; Select Layer By Location measured it geodesically, and one city falls on opposite sides of the line. Both answers are defensible, which is the point: correct is not the same as smallest, and neither is the same as easiest to explain. Say which you used and why."
    },
    {
      id: "w02-q10",
      from: "self-check",
      source: "Self-check quiz: Canvas to Tool",
      type: "mc",
      prompt: "A classmate is handed your model next semester and has to run it",
      choices: [
        "In the model's metadata, under Summary and Usage",
        "In the element names on the canvas",
        "In the write-up only — the model itself cannot hold text",
        "In the tool dialog, as the default values"
      ],
      answer: 0,
      detail: "Where do the sentences that say what the model does, what to supply, and when to run it belong?",
      explain: "Edit Metadata on the model gives you Title, Tags, Summary and Usage, plus one entry per parameter under Syntax, and View Metadata turns what you typed into a help page laid out like any built-in ArcGIS Pro tool's. Whatever you leave blank comes back saying there is no explanation, which is a fair list of what you still owe. Undocumented models are write-only: six months from now you will not remember which buffer mattered."
    }
  ]
});
