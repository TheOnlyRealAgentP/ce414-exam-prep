EX.week({
  id: "w05",
  num: 5,
  exam: 1,
  title: "Elevation Data and Terrain Analysis",
  reading: "Bolstad Ch. 11",
  lab: "Lab 4",
  blurb: "DEMs and LiDAR, cell size, contours, slope by two methods, aspect, curvature, hillshade and viewsheds.",
  notes: [
    "**DEM** = a model of the elevation surface (the grid is just one way to model it: TIN, contours and points are others). A DEM has rows/columns, cell size, origin and NoData cells.",
    "**LiDAR** measures the **time of flight** (range = time × c ÷ 2). A range becomes an (x, y, z) point only after adding GPS + IMU position and orientation.",
    "**Multiple returns:** the **ground return arrives last** (farthest, longest trip). That's how bare-earth surfaces are built under canopy.",
    "Bare-earth = ground returns only. Use building returns for line-of-sight, solar and urban flood work.",
    "**Cell size** sets the finest feature the grid can resolve. At 100 m the small drainages vanish and parcel-scale slope is meaningless. Choose cell size for the job.",
    "**Contours** run at right angles to slope, and the interval is fixed. **Crowded contours = steeper ground.** A contour crossing is found by linear interpolation: 440 m between 436 and 445 sits 4/9 of the way.",
    "**Hillshade** = a picture lit from an *assumed* sun (azimuth and altitude are your choice), not a physical quantity.",
    { text: "**Slope** = rise/run. Degrees: rise/run = 1 is 45°. Percent = (rise/run) × 100.", sub: [
      "**Four-nearest-cells:** dZ/dx = (Z_E − Z_W)/2C and dZ/dy = (Z_N − Z_S)/2C. Diagonals get zero weight. Slope = arctan √(dZ/dx² + dZ/dy²).",
      "**3rd-order finite difference (Horn):** all eight neighbors are used, with the cardinal four weighted ×2 and the center unused: dZ/dx = [(Z₃ + 2Z₆ + Z₉) − (Z₁ + 2Z₄ + Z₇)]/8C (and likewise for dZ/dy). **This is what ArcGIS Pro's Slope tool uses.**",
      "Class example, same nine cells, C = 10 m: **25.4° vs. 22.8°**. The method alone changes the answer. Report the method, cell size and vertical units with the number."
    ] },
    "**Aspect:** downhill direction of steepest slope, azimuth clockwise from north (0/360 N, 90 E, 180 S, **270 W**). It's circular data (359° and 1° are 2° apart), and flat cells have no aspect. It's noisiest where slope is smallest.",
    "**Curvature:** profile = parallel to slope direction (picture skiing down the hill: speeds up or slows down); plan = perpendicular (flow converging or spreading).",
    "**Viewshed** = seen / not seen per cell. A line of sight sweeps out and cells below the running maximum angle are hidden. It says nothing about distance or signal strength. Because line of sight is symmetric, to find which stops see the most temples, **run a viewshed from each temple (at spire height), add the rasters, and read the count at each stop.**",
    { text: "**Lab 4:**", sub: [
      "Know the mosaic's pixel type.",
      "Resampling for elevation is a measurement, so use bilinear/cubic, not nearest neighbor.",
      "Degrees vs. percent slope.",
      "Towers are clipped to a buffer before Kernel Density.",
      "Know the units of the search radius.",
      "Multiplying two 1/0 rasters = AND (1 only where both are 1)."
    ] }
  ],
  questions: [
    {
      id: "w05-q01",
      from: "self-check",
      source: "Self-check quiz: Surfaces and Returns",
      type: "mc",
      prompt: "The elevation surface itself, or a model of it?",
      choices: ["A DEM — a model of it", "The real elevation surface"],
      answer: 0,
      detail: "A grid of square cells in a coordinate system, each cell holding one land surface elevation, downloaded this morning from The National Map.",
      explain: "The elevation surface is the real ground elevation at each point; a Digital Elevation Model is a digital representation of it. The square grid is only one way to build that representation — a triangular irregular network, a set of contours, or a scatter of points model the same surface differently, and the grid you downloaded also carries a row and column count, a cell size, an origin, and NODATA cells where it has no value."
    },
    {
      id: "w05-q02",
      from: "self-check",
      source: "Self-check quiz: Surfaces and Returns",
      type: "mc",
      prompt: "What does a LiDAR sensor measure directly with each pulse?",
      choices: [
        "The elevation of the ground below",
        "The slope of the surface below",
        "How long the pulse takes to return",
        "The color of whatever the pulse hit"
      ],
      answer: 2,
      explain: "Time of flight times the speed of light, divided by two, is the range from the sensor to whatever the pulse struck. A range is not yet a point: it becomes an (x, y, z) only once it is combined with the sensor's own position and orientation from GPS and an IMU — which is why LiDAR accuracy leans on the positioning system as hard as it leans on the laser."
    },
    {
      id: "w05-q03",
      from: "self-check",
      source: "Self-check quiz: Surfaces and Returns",
      type: "mc",
      prompt: "One pulse over forest comes back more than once — treetop, branch, ground. Which of those echoes reaches the sensor last?",
      choices: ["The treetop return", "The branch return", "They arrive together", "The ground return"],
      answer: 3,
      explain: "The ground is the farthest thing the pulse reaches, so its echo makes the longest round trip and arrives last. That ordering is the whole trick: because some energy gets all the way through the gaps in a canopy and back, ground returns can be picked out and a bare-earth surface built under a forest."
    },
    {
      id: "w05-q04",
      from: "self-check",
      source: "Self-check quiz: Surfaces and Returns",
      type: "mc",
      prompt: "Bare-earth model, or a surface off the buildings?",
      choices: ["The bare-earth terrain model", "A surface off the buildings"],
      answer: 1,
      detail: "You need a surface that includes rooftops, for a line-of-sight study in a downtown core.",
      explain: "A bare-earth model is classified to ground returns only, with vegetation and structures removed — so it discards exactly the rooftops the study needs. The city surface in this lecture is extracted from the building returns in an airborne point cloud, and it is the input to line-of-sight, solar potential, view analysis and flood modeling in an urban core."
    },
    {
      id: "w05-q05",
      from: "self-check",
      source: "Self-check quiz: Surfaces and Returns",
      type: "mc",
      prompt: "The same terrain, symbolized identically, at 30 meter cells and at 100 meter cells. What did the coarser grid cost you?",
      choices: [
        "Nothing — the elevation numbers are unchanged",
        "The coordinate system, which has to be redefined",
        "The small drainages, and slope at parcel scale",
        "The vertical datum the elevations refer to"
      ],
      answer: 2,
      explain: "Cell size sets the finest thing the grid can resolve. At 100 meters the small drainages vanish and a parcel spans only a handful of cells, so a slope computed there describes a footprint far bigger than the parcel. Every surface derived from a DEM inherits that choice, which is why cell size is something you pick for a job rather than accept."
    },
    {
      id: "w05-q06",
      from: "self-check",
      source: "Self-check quiz: Slope, Aspect, Viewshed",
      type: "mc",
      prompt: "Contour lines crowd together on one side of a map and spread far apart on the other. What is the spacing telling you?",
      choices: [
        "Steeper ground where they crowd",
        "Higher elevation where they crowd",
        "A smaller contour interval where they crowd",
        "More accurate survey data where they crowd"
      ],
      answer: 0,
      explain: "Contours are connected lines of uniform elevation that run at right angles to local slope, and the interval is chosen once for the whole map. With the vertical step fixed, tight spacing means the same rise happens over a shorter run — steeper ground. That is why a contour map carries slope information a flat color ramp does not."
    },
    {
      id: "w05-q07",
      from: "self-check",
      source: "Self-check quiz: Slope, Aspect, Viewshed",
      type: "mc",
      prompt: "Shaded relief (hillshade) is best described as:",
      choices: [
        "A measurement of the surface, in the same sense as slope",
        "A picture of the surface, lit from an assumed sun"
      ],
      answer: 1,
      explain: "A hillshade is a visualization effect: the surface is illuminated from an assumed sun azimuth and altitude, and the eye reads the shading as three-dimensional shape. Nothing in the output is a physical quantity you would put on a drawing — the illumination direction is a choice you made, and it decides which landforms stand out and which disappear."
    },
    {
      id: "w05-q08",
      from: "self-check",
      source: "Self-check quiz: Slope, Aspect, Viewshed",
      type: "mc",
      prompt: "The aspect raster reads 270 degrees at a cell. Which way does the ground fall away there?",
      choices: ["North", "East", "South", "West"],
      answer: 3,
      explain: "Aspect is the downhill direction of the steepest slope, reported as an azimuth clockwise from north: 0 and 360 are north, 90 is east, 180 is south, 270 is west. Note the direction is downhill — a west-facing slope at 270 degrees is the one that catches the afternoon sun."
    },
    {
      id: "w05-q09",
      from: "self-check",
      source: "Self-check quiz: Slope, Aspect, Viewshed",
      type: "mc",
      prompt: "Two standard slope methods, run on the same nine elevations, give 25.4 and 22.8 degrees. What does that tell you?",
      choices: [
        "One of the two calculations has an arithmetic error",
        "The two methods must have used different cell sizes",
        "The method alone changes the slope",
        "One answer is in degrees and the other in percent"
      ],
      answer: 2,
      explain: "Both are correct, and they disagree by 2.6 degrees. The four-nearest-cells method uses only the four cardinal neighbors and gives the diagonals zero weight; the third-order finite difference method uses all eight neighbors, weighting the cardinal ones double. Slope is not a property you read off the ground — it is what a particular window and weighting return, so record the method along with the number."
    },
    {
      id: "w05-q10",
      from: "self-check",
      source: "Self-check quiz: Slope, Aspect, Viewshed",
      type: "mc",
      prompt: "A viewshed run from a candidate tower site produces a raster. What does the cell value actually answer?",
      choices: [
        "How far each cell is from the viewpoint",
        "Whether each cell can be seen from the viewpoint",
        "How steep the ground is between the cell and the viewpoint",
        "How high above sea level each cell sits"
      ],
      answer: 1,
      detail: "The question a viewshed actually answers.",
      explain: "A viewshed is seen or not seen, cell by cell — sweep a line of sight out from the viewer and any cell that falls below the running maximum angle is hidden behind what came before it. It says nothing about distance or signal strength, so a cell can be visible and still be useless to serve."
    },
    {
      id: "w05-q11",
      from: "self-check",
      source: "Self-check quiz: Slope, Aspect, Viewshed",
      type: "mc",
      prompt: "You want to know which of five stops on a foothill hike can see the most of seven temples in the valley. What is the most efficient viewshed workflow?",
      choices: [
        "Run one viewshed from each temple, add the seven rasters, and read the count at each stop",
        "Measure the straight-line distance from each stop to each temple",
        "Compute slope along the trail and pick the steepest stop",
        "Run a hillshade lit from each temple's direction"
      ],
      answer: 0,
      detail: "The Utah County example from class.",
      explain: "Line of sight works both ways: if a stop can see a temple, the temple can see the stop. Seven viewsheds, one from each temple raised to spire height, added together give every cell a count of temples visible, so every stop on the trail is answered at once. Distance and slope say nothing about whether a ridge is in the way, and a hillshade is only a picture."
    },
    {
      id: "w05-q12",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Slope at a cell with 10 m cells, by the four-nearest-cells method: east = 108 m, west = 100 m, north = 105 m, south = 101 m. What is the slope?",
      choices: ["11.3°", "21.8°", "24.1°", "41.8°"],
      answer: 2,
      explain: "dZ/dx = (108 − 100)/(2 × 10) = 0.40 and dZ/dy = (105 − 101)/20 = 0.20. Slope = arctan √(0.40² + 0.20²) = arctan 0.447 = 24.1°. 21.8° ignores dZ/dy, 11.3° ignores dZ/dx, and 41.8° forgets the 2 in 2C."
    },
    {
      id: "w05-q13",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Elevation rises 5 m over a horizontal run of 20 m. What is the slope in percent?",
      choices: ["5%", "20%", "25%", "45%"],
      answer: 2,
      explain: "Percent slope = (rise / run) × 100 = (5/20) × 100 = 25%. Rise/run = 1 would be 100%, or 45°."
    },
    {
      id: "w05-q14",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Contour lines are drawn at a 20 m interval. Neighboring cells read 436 m and 445 m. Where does the 440 m contour cross between them?",
      choices: [
        "Halfway between them",
        "4/9 of the way from the 436 m cell",
        "5/9 of the way from the 436 m cell",
        "At the 445 m cell"
      ],
      answer: 1,
      explain: "Linear interpolation: (440 − 436) / (445 − 436) = 4/9."
    }
  ]
});
