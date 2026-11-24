EX.week({
  id: "w09",
  num: 9,
  exam: 2,
  title: "Interpolation, Kriging and Error",
  reading: "Bolstad Ch. 12",
  lab: "Lab 8",
  blurb: "Sampling designs, Thiessen, IDW, exact versus inexact methods, semivariograms and kriging, error rasters and RMSE.",
  notes: [
    "**Why interpolate:** measuring everywhere costs too much or is impossible. Interpolation fills gaps *inside* the sampled region; outside it is **extrapolation** and every method gets worse. (Reading: spatial *interpolation* vs. spatial *prediction*.)",
    "**Sampling designs:** systematic (easy, but can line up with a pattern), random (avoids that bias, ignores variation), cluster (saves travel, less representative), **adaptive** (more points where the variable changes most; needs a coarse first pass).",
    "**Thiessen** = each cell takes the nearest sample's value: flat inside each polygon, jumps at every boundary. Good for discrete variables, wrong for continuous ones.",
    { text: "**IDW:** weight = 1 / distance^exponent. A larger exponent puts more weight on the nearest points and pushes toward the nearest-sample answer. More neighbors smooths but doesn't remove bull's-eye rings. IDW **stays inside the range of the samples** (can't exceed the highest sample).", sub: [
      "Hand example: samples 10 at distance 2 and 30 at distance 4. Exponent 1 gives (10/2 + 30/4) ÷ (1/2 + 1/4) = **16.7**. Exponent 2 gives (10/4 + 30/16) ÷ (1/4 + 1/16) = **14.0**. A higher exponent moves the estimate toward the nearer sample."
    ] },
    "**Exact vs. not exact:** an exact method returns the measured values at the sample points. Thiessen and IDW are exact. A **second-order trend surface** is a regression polynomial, so it passes *near* the points and is not exact (it missed by 163 m on average in class). Kriging is exact only when the nugget is zero. A **spline** is smooth but can overshoot beyond the sample range.",
    { text: "**Kriging:** weights come from the **data's spatial structure** (the fitted semivariogram), not an exponent you chose.", sub: [
      "**Nugget** = semivariance at ~zero distance; **sill** = where it levels off; **range** = distance beyond which points are no longer related.",
      "A nugget nearly as big as the sill means near neighbors are barely related, so the surface smooths toward the mean and stops returning the measured values. A fit with a range near zero gives a flat surface (every cell = the mean).",
      "A semivariogram that never levels off signals a **trend**; remove it before kriging.",
      "One dot on a semivariogram = the average semivariance of all point pairs at about that separation. Spherical, exponential and Gaussian models differ at short distances.",
      "Kriging can only **average the samples it has**. A ridge no sample hit won't appear; more measurements, not a better model, bring it back."
    ] },
    "**Error raster = truth − surface.** A **+40** cell means the surface came out **40 m too low**. Fix the order and keep it.",
    { text: "**RMSE:** error → square → mean → square root. Squaring stops positive and negative errors from cancelling (a sum of errors is a poor accuracy measure). In ArcGIS Pro: Raster Calculator (error), Raster Calculator (square), Zonal Statistics as Table (**Mean**), Calculate Field `math.sqrt(!MEAN!)`. Taking the mean *before* squaring lets errors cancel.", sub: [
      "Hand example: errors +3, −4, 0, +5 give squares 9, 16, 0, 25, mean 12.5, **RMSE = 3.54** (the mean error is a misleading 1.0)."
    ] },
    "**Which surface to trust:** hold some points back and compare (hold-out). Smoothness isn't evidence of correctness. In class an image-generated mountain range had RMSE 367 m, close to the 372 m of putting the average in every cell, while fitted kriging got 73 m. **Realistic is not accurate.**",
    "**Where the error lives:** where the ground changes faster than the samples are spaced (the mountain front), not on flat ground.",
    { text: "**Lab 8 gotchas:**", sub: [
      "Create Thiessen Polygons with **Output Fields = All fields** (not \"Only feature ID\").",
      "Polygon to Raster's **Value field** must be the sampled elevation (RASTERVALU), not the default OBJECTID, which gives a staircase of ID numbers with no error message.",
      "Zonal Statistics as Table uses **Mean**.",
      "A short COUNT means some zones lost cells.",
      "Empty kriging boxes mean the fit failed.",
      "Know what the elevation service sent in Step 1."
    ] }
  ],
  questions: [
    {
      id: "w09-q01",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "Why do we interpolate from samples instead of measuring everywhere?",
      choices: [
        "Measuring everywhere costs too much time or money, or is impossible",
        "Interpolated values are more accurate than measured ones",
        "GIS software cannot store a value in every cell"
      ],
      answer: 0,
      explain: "A measurement beats an estimate wherever you have one. We interpolate because we cannot measure every location: it takes too long, costs too much, or is physically or legally impossible, like digging up a whole gold field to assay it. Interpolation fills the gaps inside the sampled region; outside it, it is extrapolation and every method gets worse."
    },
    {
      id: "w09-q02",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "After a first scattered pass over a gold field, you put most of your remaining samples on and around the richest spots. Which design is that?",
      choices: [
        "Systematic: a regular grid of points",
        "Random: points placed by chance",
        "Cluster: groups of points around a few centers",
        "Adaptive: more points where the variable varies most"
      ],
      answer: 3,
      detail: "The four designs from class: systematic, random, cluster, adaptive.",
      explain: "Adaptive sampling puts more points where the variable changes fastest, which is where interpolation errors are largest, and few in large uniform areas. Its catch is that it needs some prior idea of where that is, so in practice it is a coarse pass followed by infill. Systematic is easy but can line up with a pattern in the landscape, random avoids that bias but ignores variation, and cluster saves travel at the cost of less representative samples."
    },
    {
      id: "w09-q03",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "A Thiessen surface is flat inside each polygon and jumps at every boundary. Why?",
      choices: [
        "Each cell takes the mean of all of the samples",
        "Each cell blends nearby samples by inverse distance",
        "One polynomial is fit through all of the samples at once",
        "Each cell takes the value of the nearest sample point"
      ],
      answer: 3,
      explain: "Thiessen is the zero-weighting case: the nearest point takes all of the weight and every other point takes none, so the estimate cannot change until you cross into another point's polygon. That suits a discrete variable such as soil type, and misrepresents a continuous one such as elevation or temperature."
    },
    {
      id: "w09-q04",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "You raise the IDW exponent from 1 to 3 and change nothing else",
      choices: [
        "All sample points move toward equal weight",
        "More sample points are pulled into each estimate",
        "Closer sample points take more of the weight"
      ],
      answer: 2,
      explain: "The weights are one over distance raised to that exponent, so a larger exponent concentrates weight on the nearest points and pushes the surface toward the nearest-sample answer. The number of neighbors is a separate knob: using more of them smooths the surface but does not remove the bull's-eye rings around isolated points, because the exponent, not the neighbor count, is what concentrates the weight."
    },
    {
      id: "w09-q05",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "You run Create Thiessen Polygons, then Polygon to Raster, and leave its Value field at OBJECTID. What does the surface show?",
      choices: [
        "Elevations, because each polygon carries its point's value",
        "The polygons' ID numbers, not elevations",
        "Nothing; the tool fails without an elevation field"
      ],
      answer: 1,
      detail: "Polygon to Raster fills in the Value field by itself, and nothing reports an error.",
      explain: "Polygon to Raster writes whatever field you name into the cells. OBJECTID is just the row number of each polygon, so the result is a staircase of 1, 2, 3 … with no elevations in it, and it runs without complaint. Choose the field that holds the sampled value (RASTERVALU in Lab 8), and make sure Create Thiessen Polygons kept it: its Output Fields must be All fields, not Only feature ID."
    },
    {
      id: "w09-q06",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "Which of these could NOT return your measured values unchanged?",
      choices: ["Thiessen nearest-point polygons", "Inverse distance weighting (IDW)", "A second-order trend surface"],
      answer: 2,
      detail: "You interpolate, then sample the output raster at the locations of the input points.",
      explain: "That test is what makes a method exact: interpolate, sample the output at your input locations, and see whether the values come back unchanged. Thiessen and IDW pass it, because at a sample location the nearest point is that sample itself. A trend surface is one polynomial fit through all of the points by regression, so it passes near them rather than through them: in the six-methods test Thursday shows, a second-order trend missed the samples by 163 m on average."
    },
    {
      id: "w09-q07",
      from: "self-check",
      source: "Self-check quiz: Points Into Surfaces",
      type: "mc",
      prompt: "You have no true surface to compare against. How do you judge the interpolation?",
      choices: [
        "Hold points back and compare them to the surface",
        "Pick the surface that looks the smoothest overall",
        "Pick the method that used the most sample points"
      ],
      answer: 0,
      detail: "The Terrain Scenario slide had the true DEM beside the samples. A real project never does.",
      explain: "Withheld points are the honest check once the truth panel is gone: the difference between the measured and the interpolated value at those locations is something you can actually compute. Smoothness is a property of the method rather than evidence that it is right — a spline gives the smoothest-looking result in this deck and can still overshoot well past the range of the measured values between widely spaced points."
    },
    {
      id: "w09-q08",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "Kriging is described as similar to IDW. Where does it differ?",
      choices: [
        "It uses only the nearest sample point",
        "The data's spatial structure sets the weights",
        "It requires the samples to lie on a regular grid"
      ],
      answer: 1,
      explain: "IDW's weights come from an exponent you choose before you look at the data. Kriging first models how quickly the variable stops being similar as distance grows — that is what the fitted semivariogram model records — and then uses the minimum variance method to set the weights, so the data decide how far influence reaches."
    },
    {
      id: "w09-q09",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "A fitted semivariogram is almost all nugget: the nugget is nearly as large as the sill. What will the kriged surface do?",
      choices: [
        "Pass exactly through every sample point",
        "Treat nearby points as barely related, and smooth toward the mean",
        "Turn into the Thiessen surface"
      ],
      answer: 1,
      explain: "The nugget is the semivariance at almost zero distance. If it is nearly the whole sill, the model says even close neighbors are almost unrelated, so kriging gives no point much extra weight and the surface flattens toward the average. It also stops returning the measured values: kriging is exact only when the nugget is zero. The six-methods test in today's deck showed this happening when the variogram was fitted automatically: the dots rose and then fell, the fit settled on a flat line with a range of almost zero, and every cell got the mean."
    },
    {
      id: "w09-q10",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "Your error raster is the true DEM minus the surface. A cell reads +40. What happened there?",
      choices: [
        "The surface came out 40 m too low",
        "The surface came out 40 m too high",
        "The true DEM is 40 m in error",
        "Forty sample points fell in that cell"
      ],
      answer: 0,
      explain: "Truth minus surface is positive when the truth is bigger, so the surface fell short of the ground by 40 m. Subtract the other way and every sign, and every color on the map, flips, which is why the order is fixed once and kept."
    },
    {
      id: "w09-q11",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "Why are the errors squared before they are averaged in an RMSE?",
      choices: [
        "To turn meters into square meters",
        "So cells with no data drop out",
        "So positive and negative errors cannot cancel out",
        "Zonal Statistics cannot average negatives"
      ],
      answer: 2,
      explain: "A surface 40 m too low in one cell and 40 m too high in the next averages to zero error, which says it is perfect. Squaring gets rid of the minus signs, so every miss adds to the total; the square root at the end puts the answer back in meters."
    },
    {
      id: "w09-q12",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "ArcGIS Pro has no single RMSE tool. In what order do you chain the steps?",
      choices: [
        "Subtract, take the mean, square it, then take the square root",
        "Subtract, square each cell, take the mean, then take the square root",
        "Subtract, take the square root of each cell, then take the mean"
      ],
      answer: 1,
      explain: "Read the formula from the inside out: the error (Raster Calculator, truth minus surface), its square (Raster Calculator again), the mean over the study area (Zonal Statistics as Table, statistic Mean), and the square root (Calculate Field, math.sqrt(!MEAN!)). Taking the mean before squaring lets highs and lows cancel; the root of each cell just gives back the size of each error."
    },
    {
      id: "w09-q13",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "Kriging rebuilt Mount Timpanogos better than Tuesday's methods, yet its surface still lacks the mountain's real ridges and gullies. Why?",
      choices: [
        "Its spherical semivariogram was the wrong shape for a mountain",
        "The 150 sample elevations were measured with too much error",
        "Between samples it can only average the points it was given"
      ],
      answer: 2,
      explain: "No interpolator can fabricate data. Every kriged cell is a weighted average of nearby samples, so a ridge or gully that no sample fell on cannot show up in the surface. A better model will not bring that detail back; more measurements will."
    },
    {
      id: "w09-q14",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "On a baseline error map, where does most of the error live?",
      choices: [
        "On the flat valley floor, far from the mountain",
        "Where the ground changes faster than the samples are spaced",
        "Spread evenly over the whole map"
      ],
      answer: 1,
      detail: "Think about the Y Mountain error maps: a flat valley floor and a steep mountain front.",
      explain: "On flat ground any nearby sample is close to the truth, so every method is within a few meters there. The error piles up on the mountain front, where the elevation changes a lot between samples. That is also where Lab 8 asks you to find your best method's worst cell."
    },
    {
      id: "w09-q15",
      from: "self-check",
      source: "Self-check quiz: How Wrong Is the Surface?",
      type: "mc",
      prompt: "An image model filled in the same 150 samples with a believable mountain range. At the 60 hold-out points its RMSE was 367 m; fitted kriging's was 73 m. What does that show?",
      choices: [
        "Realistic is not accurate: only measurements place the real ridges",
        "The 60 hold-out points must have been measured in error",
        "A hold-out test is unfair to a surface an AI generates"
      ],
      answer: 0,
      explain: "The model drew ridges and canyons that look like real terrain, but not this mountain's, and it scored no better than putting the samples' average in every cell (372 m). Hold-out points are how you tell a believable surface from an accurate one, and they will judge the next interpolator too, whether it is fitted or trained."
    },
    {
      id: "w09-q16",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Estimating the number of freeway accidents at a mile marker from time of day and day of week is an example of:",
      choices: ["Spatial interpolation", "Spatial prediction"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q17",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Estimating the depth of snowpack at a location from the depth of snowpack at surrounding locations is an example of:",
      choices: ["Spatial interpolation", "Spatial prediction"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q18",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Estimating water temperature at each 1 m grid cell of a patch of ocean from solar radiation and the El Nino cycle is an example of:",
      choices: ["Spatial interpolation", "Spatial prediction"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q19",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Estimating the number of artifacts at a location from a model correlating elevation and water proximity with artifacts found elsewhere is an example of:",
      choices: ["Spatial interpolation", "Spatial prediction"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q20",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Estimating the air temperature in Provo from measurements in Orem, Lehi, and Los Angeles is an example of:",
      choices: ["Spatial interpolation", "Spatial prediction"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q21",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Which sampling pattern spends its early samples most efficiently, reaching the point of diminishing returns soonest?",
      choices: ["Systematic", "Random", "Cluster", "Adaptive"],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q22",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "A farmer measures soil nutrients at both ends and the midpoint of each of his 187 straight rows of corn. Which sampling method is this?",
      choices: ["Systematic", "Random", "Adaptive", "Cluster"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q23",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "An archeologist uses a map and a dartboard to select fourteen locations in Yellowstone to search for artifacts. Which sampling method is this?",
      choices: ["Systematic", "Random", "Adaptive", "Cluster"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q24",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "An engineer finds three radioactive hotspots in a vacant lot with a Geiger meter, then takes soil samples at those locations. Which sampling method is this?",
      choices: ["Systematic", "Random", "Adaptive", "Cluster"],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q25",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "A forest biologist randomly selects 4 locations in a 300 acre stand and examines 12 trees at each for pine beetle damage. Which sampling method is this?",
      choices: ["Systematic", "Random", "Adaptive", "Cluster"],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q26",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "tf",
      prompt: "Although every interpolation method has pros and cons, kriging is always the most accurate for all applications.",
      answer: false,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q27",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "You leave out each of 20 points in turn and compare the interpolated value with the measured one. Is the SUM of the 20 interpolation errors an appropriate measure of accuracy?",
      choices: [
        "Yes. The sum of the errors will be high for poor methods and lower for better methods.",
        "No. A poor method can have a lower total sum of errors than a better one."
      ],
      answer: 1,
      explain: "Positive and negative errors cancel, which is why RMSE squares them first."
    },
    {
      id: "w09-q28",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "What is the difference between an \"exact interpolator\" and an \"inexact interpolator\"?",
      choices: [
        "An exact interpolator requires exactly one input data point whereas an inexact one requires multiple.",
        "An exact interpolator uses the full data set (global) whereas an inexact one uses a local moving window.",
        "Exact is just GIS-speak for a more accurate method, inexact for a less accurate one.",
        "An exact interpolator exactly reproduces input values at their locations whereas an inexact interpolator may generate different values there."
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q29",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "IDW is an exact interpolator. Does changing the power term n (to any positive value) make IDW less exact?",
      choices: ["Yes", "No"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q30",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "With IDW, a power term n = 0 makes it behave like which method?",
      choices: ["Take the average of several nearest neighbors.", "Thiessen polygons", "Kriging", "Trend surface"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q31",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "With IDW, using only k = 1 point makes it behave like which method?",
      choices: ["Take the average of several nearest neighbors.", "Thiessen polygons", "Kriging", "Trend surface"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q32",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "With IDW, a very large power term n makes it behave like which method?",
      choices: ["Take the average of several nearest neighbors.", "Thiessen polygons", "Kriging", "Trend surface"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q33",
      from: "reading",
      source: "Learning Suite Reading Quiz 7",
      type: "mc",
      prompt: "Which is NOT an argument stated in the book or in class for why we use spatial prediction or interpolation?",
      choices: [
        "It is physically impossible to measure some variables at every location.",
        "There is not enough time to measure some variables at every location.",
        "There may be legal constraints on measuring a variable at certain locations.",
        "In most cases, interpolation yields more accurate values at a location than on-site measurements.",
        "It may be cost-prohibitive to measure at a large number of locations."
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 7."
    },
    {
      id: "w09-q34",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "IDW with exponent 2. Sample A = 10 m at distance 2, sample B = 30 m at distance 4. What is the estimate?",
      choices: ["12.5", "14.0", "16.7", "20.0"],
      answer: 1,
      explain: "Weights are 1/d²: A = 1/4, B = 1/16. Estimate = (10 × 0.25 + 30 × 0.0625) / (0.25 + 0.0625) = 4.375 / 0.3125 = 14.0. With exponent 1 it would be 16.7. A higher exponent pulls the answer toward the nearer sample."
    },
    {
      id: "w09-q35",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "Errors at four hold-out points are +3, −4, 0 and +5 m. What is the RMSE?",
      choices: ["1.0 m", "3.54 m", "12.5 m", "50 m"],
      answer: 1,
      explain: "Square: 9, 16, 0, 25. Mean = 50/4 = 12.5. Root = 3.54 m. The mean error (1.0 m) is misleading because the positives and negatives cancel."
    },
    {
      id: "w09-q36",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "On a semivariogram, which term is the distance beyond which two points are no longer spatially related?",
      choices: ["Nugget", "Sill", "Range", "Lag"],
      answer: 2,
      explain: "Nugget = semivariance at near-zero distance. Sill = the plateau where the variogram levels off. Range = the distance at which it reaches the sill, i.e. where points stop being related."
    }
  ]
});
