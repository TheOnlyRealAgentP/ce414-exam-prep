EX.week({
  id: "w11",
  num: 11,
  exam: 2,
  title: "Least Cost Paths",
  reading: "",
  lab: "Lab 10",
  blurb: "Cost surfaces, accumulated cost and back direction, hand-traced paths, barriers versus costs, what moves a route, corridors.",
  notes: [
    "**Cost surface:** each cell holds **what it costs to cross that cell**. It's not a map of distance. Reclassify every input so that **high = undesirable** (the algorithm minimizes). Get the sign backwards and you get an exact answer to the wrong question.",
    "**Shortest ≠ cheapest.** A straight line through cost-4 cells loses to a longer detour through cost-1 cells.",
    { text: "**Two outputs of Distance Accumulation:**", sub: [
      "**Accumulated cost raster** = the cheapest *total* cost to reach each cell from the source (rings spreading from the source, bulging where crossing is cheap).",
      "**Back direction raster** = which way to step next, as a **compass angle: 0 = source, 90 = east, 180 = south, 270 = west, 360 = north**. It's a direction, not a cost.",
      "**Optimal Path As Line** reads both rasters and draws the route, tracing **backward from the destination to the source**."
    ] },
    { text: "**Hand calculation (class convention):** a move costs the **cell you enter**; a cell's total = min over neighbors of (neighbor's total + this cell's cost); the source = 0. In ArcGIS Pro a **diagonal step costs 1.414 × the cell it enters**.", sub: [
      "Example 2×4 grid, source top-left, destination top-right. Top row S, 5, 5, 2 and bottom row 1, 1, 1, 1. The top route costs 5 + 5 + 2 = 12, but down, across and up costs 1 + 1 + 1 + 1 + 2 = **6**."
    ] },
    "**Barrier vs. cost:** a barrier cannot be crossed at all; a cost is a price.",
    { text: "**What moves a route** (the \"What Moved the Line?\" quiz): a weight multiplies a score, and it only moves the route if the factor **differs between candidate routes**.", sub: [
      "In Lab 10, raising Slope_Weight 1 → 5 barely moves the line because every candidate runs on flat valley floor where slope scores 1.",
      "Dropping the road score moves it a little (a road runs near every route, so it can't tell them apart), but dropping the **existing-line score** moves it kilometers (existing lines are few, and the score jumps 1 → 5 just 500 m off one). **Line_Weight = 0 is the biggest change.** Existing lines, not roads, are the key factor.",
      "A weight can matter in only one direction (the city weight). The model's form (slope *added* vs. elevation *multiplied*) can choose a different route."
    ] },
    "**Corridor map:** accumulated cost from the source + accumulated cost from the destination = the cost of the best route forced through each cell. \"Within 5% of the cheapest\" = the best route through that cell costs at most 5% more. A **wide corridor** means many nearly-as-good alternatives; a **narrow** one means the route is forced.",
    "**Lab 10:** the terrain enters as **slope**; know what each score table says; Distance Accumulation with no cost raster gives plain distance; the weights enter in the cost expression; know which weight moved the route."
  ],
  questions: [
    {
      id: "w11-q01",
      from: "self-check",
      source: "Self-check quiz: What Moved the Line?",
      type: "mc",
      prompt: "Which ArcGIS Pro tool gives you both the accumulated cost raster and the back direction raster?",
      choices: ["Distance Accumulation", "Optimal Path As Raster", "Euclidean Distance", "Raster Calculator"],
      answer: 0,
      explain: "Distance Accumulation writes the accumulated cost raster, and its Output Back Direction Raster parameter writes the back direction raster in the same run. Optimal Path As Line reads those two rasters and draws the route; Euclidean Distance ignores cost."
    },
    {
      id: "w11-q02",
      from: "self-check",
      source: "Self-check quiz: What Moved the Line?",
      type: "mc",
      prompt: "A cell of Distance Accumulation's back direction raster holds 90. What does that tell you?",
      choices: [
        "The cell is 90 cost units from the source, in the cost raster's units",
        "Head east from here to get back to the source",
        "The route turns 90 degrees here"
      ],
      answer: 1,
      explain: "The back direction is a compass angle: 0 marks the source itself, 90 is east, 180 south, 270 west, 360 north. It is a direction, not a cost; the accumulated cost raster holds the cost."
    },
    {
      id: "w11-q03",
      from: "self-check",
      source: "Self-check quiz: What Moved the Line?",
      type: "mc",
      prompt: "In Lab 10, raising Slope_Weight from 1 to 5 barely moves the route. Why so little?",
      choices: [
        "Distance Accumulation caps every weight at 1, so a weight of 5 is read as 1",
        "Every route the line could take runs on flat valley floor, where slope scores 1",
        "Slope is measured in degrees, so its scores are too small next to the others"
      ],
      answer: 1,
      explain: "A weight multiplies a score; if the score is the same along every route the line could take, multiplying it changes every route's cost alike and cannot choose between them. In mountains, slope would move the line."
    },
    {
      id: "w11-q04",
      from: "self-check",
      source: "Self-check quiz: What Moved the Line?",
      type: "mc",
      prompt: "Lab 10's route lies within 500 m of an existing transmission line for 99.7% of its length. Which change should move it most?",
      choices: ["Setting Line_Weight to 0", "Removing the lake barrier", "Setting Line_Weight to 2"],
      answer: 0,
      explain: "The existing-line score is what holds the route where it is. Remove it and the route leaves the lines and cuts across the valley, kilometers from the baseline: the biggest change of any. Weight 2 only holds it tighter, and the lakes were never in its way."
    },
    {
      id: "w11-q05",
      from: "self-check",
      source: "Self-check quiz: What Moved the Line?",
      type: "mc",
      prompt: "Dropping the road score moves Lab 10's route a little; dropping the existing-line score moves it kilometers. Why do the lines matter more here?",
      choices: [
        "A major road runs near almost every route the line could take, so the road score barely tells those routes apart",
        "Roads are a barrier in Lab 10, so the route is never allowed near them and their score never counts",
        "Distance Accumulation counts the line score twice, once from each substation, so it outweighs roads"
      ],
      answer: 0,
      explain: "A weight moves the route only where its factor differs between candidate routes. Roads are everywhere on the valley floor, so the road score is about the same along any of them; existing lines are few, and the line score jumps from 1 to 5 just 500 m off one. Roads are not the most important factor in Lab 10: the existing lines are."
    },
    {
      id: "w11-q06",
      from: "self-check",
      source: "Self-check quiz: What Moved the Line?",
      type: "mc",
      prompt: "On a corridor map, a cell is shaded “within 5% of the cheapest.” What does that mean?",
      choices: [
        "Its own cell cost is within 5% of the cheapest cell's cost",
        "It lies within 5% of the route's length from the route itself",
        "The best route through it costs at most 5% more"
      ],
      answer: 2,
      explain: "Add the accumulated cost from the source to the accumulated cost from the destination: each cell gets the cost of the best route forced through it. Cells near the minimum are where a nearly-as-good route could go; that is how an engineer finds alternatives."
    },
    {
      id: "w11-q07",
      from: "self-check",
      source: "Self-check quiz: Cheapest or Shortest?",
      type: "mc",
      prompt: "What does one cell value in a cost surface represent?",
      choices: [
        "How far the cell is from the source",
        "The cheapest route cost to that cell",
        "The elevation measured at that cell",
        "What it costs to cross that cell"
      ],
      answer: 3,
      explain: "A cost surface is not a map of distance. Each cell carries the price of crossing it, and a route's cost is the sum of what it pays cell by cell. The cheapest total cost of reaching a cell is a different raster — the accumulated cost — and elevation is only one of many things a cell's cost can be built from."
    },
    {
      id: "w11-q08",
      from: "self-check",
      source: "Self-check quiz: Cheapest or Shortest?",
      type: "mc",
      prompt: "You reclassify each input raster before combining it. Which cells should end up with the high values?",
      choices: [
        "The cells you least want to cross",
        "The cells you most want to follow",
        "The cells closest to the source point",
        "The cells closest to the destination"
      ],
      answer: 0,
      detail: "Roads, lakes, cities, existing power lines, slope — all reclassified, then combined with map algebra in the Raster Calculator.",
      explain: "In the virtual terrain, high means undesirable and low means desirable, and the algorithm looks for the smallest total. Reclassify with the sign backward and you get an exact answer to the wrong question: a route that hunts down every feature you meant to avoid."
    },
    {
      id: "w11-q09",
      from: "self-check",
      source: "Self-check quiz: Cheapest or Shortest?",
      type: "mc",
      prompt: "A straight line from A to B crosses dark cells that cost 4; a stepped route around them stays on light cells that cost 1. Which statement holds?",
      choices: [
        "The straight line is both shorter and cheaper",
        "The line is shorter; the detour is cheaper",
        "Both cost the same; they share endpoints",
        "The stepped route is both shorter and cheaper"
      ],
      answer: 1,
      explain: "Length counts cells; cost sums what those cells charge. Detouring adds cells, but at 1 each instead of 4, so the longer route wins on price. That gap between shortest and cheapest is the entire reason for the analysis — if they were the same line you would just draw it."
    },
    {
      id: "w11-q10",
      from: "self-check",
      source: "Self-check quiz: Cheapest or Shortest?",
      type: "mc",
      prompt: "What does each cell of the accumulated cost raster store?",
      choices: [
        "The cheapest total cost of reaching that cell",
        "The cost of crossing that one cell alone",
        "Which way to step next toward the source",
        "The straight-line distance to the destination"
      ],
      answer: 0,
      explain: "It is a running total, not a per-cell price: light cells are cheap to reach, dark cells are expensive. The values spread outward from the source in rough rings, bulging far where crossing is cheap and staying tight where it is expensive."
    },
    {
      id: "w11-q11",
      from: "self-check",
      source: "Self-check quiz: Cheapest or Shortest?",
      type: "mc",
      prompt: "What is the back direction raster for?",
      choices: [
        "It records what each cell cost to cross",
        "It holds the finished route as a polyline",
        "It holds the downhill direction from elevation",
        "It records which way to step next"
      ],
      answer: 3,
      explain: "The accumulated cost raster says how much; the back direction raster says which way, as a compass angle. Starting at the destination and following those directions cell by cell until you arrive at the source is the whole path-finding step — which is why the route is traced backward, destination to source."
    },
    {
      id: "w11-q12",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] At the defaults, Cost_Surface runs from 4 to 40, but Accumulated_Cost reaches 1,115,042 at the far corner. Why are the two so different in size?",
      choices: [
        "Accumulated_Cost is in square meters, because Distance Accumulation reports an area for each cell",
        "A Cost_Surface cell is the price of crossing that one cell; an Accumulated_Cost cell is the cheapest running total, in cost times meters, of getting to it from the source",
        "Raster Calculator rescales the scores to 4-40, while Distance Accumulation leaves them unscaled",
        "Accumulated_Cost adds the lake barrier's penalty to every cell beyond Utah Lake"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q13",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[Hand grid] Entry costs, moves up/down/left/right only, S is the source. Row 1 (top): 1 (S), 1, 3, 9, 1 (D). Row 2: 1, 9, 3, 9, 1. Row 3: 1, 9, 1, 1, 1. Row 4: 1, 9, 9, 9, 1. Row 5 (bottom): 2, 2, 2, 1, 1. What is the accumulated cost of the bottom-right cell?",
      choices: ["10", "11", "12", "14"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q14",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[Same hand grid] The center cell (row 3, column 3) has an accumulated cost of 8 and the cheapest path from S to D passes through it. In the back direction raster, which way does its arrow point?",
      choices: [
        "Up, to the cell holding 7: the neighbor its cheapest total came from",
        "Right, to the cell holding 9: the next cell on the path toward D",
        "Left, to the cell holding 11: the neighbor nearest S in a straight line",
        "Down, to the cell holding 17: the neighbor it costs most to leave"
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q15",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] Why does Distance Accumulation work out the accumulated cost of every cell, not only cells near the straight line from source to destination?",
      choices: [
        "Optimal Path As Line cannot read a raster that has NoData in it",
        "The accumulated cost is measured from the destination and the source at the same time",
        "The cheapest route can detour anywhere (on the hand grid it took eight moves to the straight line's four), so the destination's total is certain only once every alternative is priced",
        "It only prices the cells inside the barrier layer's extent"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q16",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] Road_Score gives 1 near a major road but City_Score gives 10 near a city. Why do the two tables run in opposite directions?",
      choices: [
        "The city table is reversed by mistake",
        "City_Distance is negative inside a city",
        "Reclassify always gives the highest new value to the first row",
        "A nearby road is cheap access to build from, while a nearby city is right-of-way you would have to buy through neighborhoods"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q17",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] The lab makes the major lakes a barrier but keeps cities as a cost. Why not make cities a barrier too?",
      choices: [
        "Both substations are inside cities and most of the valley floor between them is municipal, so a city barrier would leave the route nowhere to go",
        "A City_Score of 10 already makes city cells impassable",
        "Polygon features cannot be barriers in Distance Accumulation",
        "City cells are NoData in City_Distance, so they already act as barriers"
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q18",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] The cost surface scores slope, roads, cities and existing lines but leaves out the streams in the data package. Why?",
      choices: [
        "Streams are already inside Major_Lakes",
        "The valley's streams are narrow enough for a power line to span between towers",
        "Distance Accumulation cannot take line features as a source",
        "Every stream lies inside a city"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q19",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] Road_Score, City_Score and Line_Score each total 3,651,156 cells, but Slope_Score totals 3,643,474 (7,682 fewer). Which cells are missing?",
      choices: [
        "The cells under the seven major lakes",
        "Cells exactly on a class break, such as exactly 5 degrees",
        "The one-cell ring around the edge of the box, where Slope has no neighbors on one side and writes NoData",
        "Cells steeper than 90 degrees"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q20",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] Three 30 m cells lie in a row, the source on the left. Their costs, left to right, are 2 (the source), 6 and 2. Using Distance Accumulation's rule, what is the accumulated cost of the middle cell?",
      choices: ["6", "120", "180", "240"],
      answer: 2,
      explain: "A move costs the cell you enter times the distance: 6 x 30 = 180."
    },
    {
      id: "w11-q21",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] An older tutorial ends with Cost Path then Raster to Polyline. Lab 10's model has no Raster to Polyline. Why not?",
      choices: [
        "Optimal Path As Line writes the route as a line feature class itself",
        "Distance Accumulation writes the route line as its back direction output",
        "Raster to Polyline was deprecated with no replacement",
        "ModelBuilder turns any raster output into a line when the model runs"
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q22",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] The legacy chain gives a 58.49 km route and Distance Accumulation with Optimal Path As Line gives 55.72 km. Much of the extra 2.8 km comes from what?",
      choices: [
        "The legacy chain ran on 100 m cells",
        "Cost Back Link's codes allow only the eight neighbor directions, so the legacy path is a staircase of 45-degree steps; a back direction angle can head off between neighbors",
        "The legacy Cost Path walks from the source to the destination instead of backward",
        "Cost Distance charges every step twice the cost of the cell entered"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q23",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] Taking away the lake barrier moves Lab 10's route by at most 404 m. Which explanation fits?",
      choices: [
        "Distance Accumulation ignores barriers whenever an Input Cost Raster is supplied",
        "The straight line between the substations does not cross any lake",
        "The cheapest route already runs away from the lakes, so the barrier never had to stop it",
        "Lake cells score 10 on every factor"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q24",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] Every student's Line_Weight is 0.005 times the last two digits of the BYU ID (0 to 0.495). Why that range rather than 1 to 5?",
      choices: [
        "Raster Calculator rejects any weight greater than 1",
        "The weights of the four scores must add up to 1",
        "A Line_Weight over 0.5 would push Cost_Surface past 40",
        "The existing-line score is what moves the route, and it moves it only below about 0.5; above that, every student's route would sit almost on the baseline"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q25",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] How does the Thursday deck compute its corridor of nearly-as-good routes between the two substations?",
      choices: [
        "Run Distance Accumulation from each substation and add the two accumulation rasters, so each cell holds the cost of the best route forced through it",
        "Buffer the least cost route by 1%, 5% and 10% of its length",
        "Run Optimal Path As Line to many random destinations and overlay the lines",
        "Subtract the accumulated cost at the destination from Cost_Surface"
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q26",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] Distance Accumulation runs with Major_Roads as the source and no barrier, surface or cost raster. What does Road_Distance hold?",
      choices: [
        "The driving distance along the road network to the nearest major road",
        "The straight-line distance in meters from each cell to the nearest major road, since every cell costs 1 per meter",
        "The cost of building an access road to each cell, from its slope",
        "Nothing: the tool fails without an Input Cost Raster"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q27",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] A classmate's route is barely longer than the straight line between the substations and bends only around the lakes. What is the most likely mistake?",
      choices: [
        "Major_Lakes was given as the barrier",
        "Line_Weight was left at 1",
        "The Step 6 Distance Accumulation got no Input Cost Raster",
        "Path Type in Optimal Path As Line was left at Each zone"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q28",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] After the Step 7 run from the tool dialog, Back_Direction, Major_Lakes and the four score rasters are gone from Lab10.gdb. What happened?",
      choices: [
        "The Scratch Workspace is emptied after every session",
        "Optimal Path As Line deletes its inputs once the route is written",
        "ArcGIS Pro removes rasters that hold NoData",
        "A tool-dialog run deletes every dataset that is not a model parameter; make what you need a parameter and draw the maps from the downloaded layers with definition queries"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q29",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From class] Tuesday's deck says the simplest cost raster is a DEM. Lab 10 puts slope, not elevation, in its cost surface. Why?",
      choices: [
        "Lower ground is not cheaper to build a power line on, but steep ground is more expensive: harder access and harder tower foundations",
        "Elevation.tif is in feet",
        "Distance Accumulation cannot read a floating-point raster",
        "Reclassify accepts slope but not elevation"
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q30",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] The baseline route is 55.72 km long, against a 52.79 km straight line. What is the route buying with the extra 2.9 km?",
      choices: [
        "It avoids the cities",
        "It avoids every major stream between the substations",
        "It follows the flattest ground",
        "It goes around Utah Lake, which the straight line crosses, and stays beside existing transmission lines, where Line_Score is 1"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q31",
      from: "reading",
      source: "Learning Suite Reading Quiz 9",
      type: "mc",
      prompt: "[From Lab 10] The route is 55,720 m long and the accumulated cost at the destination is 742,670, about 13 per meter. The mean of Cost_Surface over the whole box is 23.66. What does the comparison say?",
      choices: [
        "The route crosses about 13 cells per kilometer",
        "The route is about 13% longer than the straight line",
        "The accumulated cost is wrong; it should be close to 23.66 times 55,720",
        "The route crosses cells that cost about 13 on average, far below a typical cell in the box: it found the cheap ground"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 9."
    },
    {
      id: "w11-q32",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A 2 × 4 grid of entry costs: top row is S, 5, 5, 2 (D) and bottom row is 1, 1, 1, 1. S is top-left and D is top-right. Using four neighbors, where a move costs the cell you enter, what is the accumulated cost at D?",
      choices: ["6", "8", "9", "12"],
      answer: 0,
      explain: "Straight across the top: 5 + 5 + 2 = 12. Down, across the bottom and up: 1 + 1 + 1 + 1 + 2 = 6. The cheapest route is longer in cells but cheaper in cost."
    }
  ]
});
