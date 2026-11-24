EX.week({
  id: "w04",
  num: 4,
  exam: 1,
  title: "Georectifying and Remote Sensing",
  reading: "Bolstad Ch. 6",
  lab: "Lab 3",
  blurb: "Georectify before you digitize, control points and RMS error, the spectrum, bands, false color and satellite trade-offs.",
  notes: [
    "**Order: georectify → digitize → analyze.** A scan has no coordinates. Digitize first and every feature lands wrong, permanently.",
    { text: "**Control points:**", sub: [
      "Distribution beats count: spread them to **all four corners**. Eight points clustered in one town constrain the equation almost as little as one.",
      "Use features that haven't moved: road intersections, section corners, rail crossings.",
      "Worst choices: river bends, shorelines, field edges, trees."
    ] },
    "**Transformation:** 1st-order polynomial (affine) keeps straight lines straight, so it's the honest default for a flat scan. **Spline** forces every point to match exactly, so its RMS goes to zero by construction while the map can be badly distorted between points.",
    "**RMS error is a fit statistic.** A small one proves nothing. Real accuracy = the offset measured at a feature you **left out of the fit** (hold-out validation; Lab 3 Step 8). If a digitized feature lands somewhere impossible despite a small RMS, the georeferencing is wrong.",
    "**Bands:** each band is one grid holding one number per pixel (brightness, 0–255). RGB = three stacked sheets.",
    "**Spectrum:** visible, near-IR, thermal IR, radar. **Reflected NIR is sunlight bouncing off leaves, not heat.** Thermal IR is *emitted* energy. Healthy leaves are bright in NIR because of leaf structure.",
    "**False color:** any color assignment that isn't true RGB. Even a rainbow ramp on one band is a display choice. Know multispectral vs. hyperspectral.",
    "**Four resolutions** a satellite trades off: spatial, spectral, temporal, radiometric. Sharper pixels cost coverage and revisit time.",
    "**GOES** is geostationary (same spot every few minutes, coarse pixels). **Landsat** is polar-orbiting (sharper pixels, a strip at a time, revisit every few days). Radar sees through cloud.",
    "**Reading:** passive vs. active sensors; LiDAR (laser) vs. radar (radio)."
  ],
  questions: [
    {
      id: "w04-q01",
      from: "self-check",
      source: "Self-check quiz: Line It Up",
      type: "mc",
      prompt: "You are handed a paper earthquake fault map and you want to buffer the fault traces",
      choices: [
        "Digitize first — tracing is easier before the image warps",
        "Either order works; the features follow the image later",
        "Analyze first, to see whether the sheet is worth placing",
        "Georectify first — otherwise every trace lands in the wrong place"
      ],
      answer: 3,
      detail: "Georectify and digitize are two of the three steps. Which comes first, and does the order really matter?",
      explain: "The sequence is georectify → digitize → analyze, and it is not a matter of taste. A scan has no coordinates, so place it; the fault traces are then still only pixels, so digitize them; only after that can you buffer, intersect or measure anything. Digitize first and every feature lands in the wrong place, permanently."
    },
    {
      id: "w04-q02",
      from: "self-check",
      source: "Self-check quiz: Line It Up",
      type: "mc",
      prompt: "All eight of your control points are on street corners in the town at the center of the sheet",
      choices: [
        "Yes — eight is what a scanned sheet asks for",
        "Yes, if the total RMS error comes back small",
        "No — they must spread to all four corners",
        "No — street corners are poor control points"
      ],
      answer: 2,
      detail: "The sheet also covers farmland and a canyon out to its edges. Is that a good set of points?",
      explain: "Distribution matters more than count. A transformation is only constrained where you constrain it, so a corner with nothing near it will wander. Points packed inside one town tell the equation almost as little as a single point does. Street corners themselves are fine — road intersections are exactly the kind of thing that has not moved."
    },
    {
      id: "w04-q03",
      from: "self-check",
      source: "Self-check quiz: Line It Up",
      type: "mc",
      prompt: "Which of these makes the worst control point?",
      choices: ["A bend in the river", "A road intersection", "A section corner", "A rail line crossing"],
      answer: 0,
      detail: "You are matching a 1990 map sheet against current satellite imagery.",
      explain: "A control point has to be a thing that has not moved between the two sources. Road intersections, section corners and rail crossings hold still for decades. A riverbank, a shoreline, a field edge or a tree does not — the river bends on a 1990 sheet are the most tempting features on it and the worst, because that is not today's river."
    },
    {
      id: "w04-q04",
      from: "self-check",
      source: "Self-check quiz: Line It Up",
      type: "mc",
      prompt: "Spline will always give you the best-looking error on the list",
      choices: [
        "Because it fits the sheet better than the polynomials do",
        "Because it spreads the error evenly across all the points",
        "Because it keeps straight lines straight and the others do not",
        "Because it forces every control point to match exactly"
      ],
      answer: 3,
      detail: "Why does it look so good?",
      explain: "Spline makes every link match exactly and rubber-sheets everything between them, so the total RMS goes to zero by construction while the map can be badly distorted away from the points. Keeping straight lines straight is the first-order polynomial (affine) — the honest default for a flat scanned sheet, and where you should start."
    },
    {
      id: "w04-q05",
      from: "self-check",
      source: "Self-check quiz: Line It Up",
      type: "mc",
      prompt: "So how do you find out how accurate your georeferencing actually is?",
      choices: [
        "Read the total RMS error off the Control Point Table",
        "Measure the offset at a feature you left out of the fit",
        "Add control points until the total RMS error stops dropping",
        "Try each transformation and keep the lowest RMS error"
      ],
      answer: 1,
      explain: "Every control point helped solve the transformation, so its residual only describes how well the equation reproduces its own input. Check somewhere you did not fit: that distance is your georeferencing accuracy, and the RMS error is a fit statistic. It is the same hold-out logic as validating any model — and it is what Lab 3 Step 8 asks you to do three times over."
    },
    {
      id: "w04-q06",
      from: "self-check",
      source: "Self-check quiz: Light and Bands",
      type: "mc",
      prompt: "You split a color photo into its red, green and blue bands. What does each band hold?",
      choices: [
        "A third of the photo's pixels, chosen at random",
        "The photo's colors, sorted from dark to light",
        "One number per pixel: that color's brightness",
        "A copy of the whole photo, tinted one color"
      ],
      answer: 2,
      explain: "Every band covers every pixel. It is one sheet of grid paper, holding one number per cell: how much red, or green, or blue light came back from that spot, from 0 to 255. Stack the three sheets and each pixel has three numbers, which is its hex color."
    },
    {
      id: "w04-q07",
      from: "self-check",
      source: "Self-check quiz: Light and Bands",
      type: "mc",
      prompt: "Healthy vegetation is bright in a reflected near-infrared image. Why?",
      choices: [
        "The leaves are warmer than the bare ground surrounding them",
        "Chlorophyll emits near-infrared during photosynthesis",
        "The sensor brightens vegetation so that it stands out",
        "Leaf structure reflects near-infrared back to the sensor"
      ],
      answer: 3,
      explain: "Reflected near-infrared is sunlight bouncing off a surface, exactly like visible light — it is not heat. Thermal infrared, farther along the spectrum, is energy a surface emits because of its own temperature. Plants are bright in the near-infrared because leaves reflect it, not because they are warm."
    },
    {
      id: "w04-q08",
      from: "self-check",
      source: "Self-check quiz: Light and Bands",
      type: "mc",
      prompt: "You load each band as its own layer in ArcGIS Pro, turn off the blue and red band layers, and symbolize the near-infrared band with a rainbow ramp from purple (0) to red (255). What have you made?",
      choices: [
        "A false-color image: the colors are a display choice",
        "A natural-color image, since it spans purple to red",
        "A thermal image, since near-infrared measures heat",
        "Nothing yet: false color needs all three bands on"
      ],
      answer: 0,
      explain: "Any color on any band is false color. The near-infrared band is still just one number per pixel; the rainbow ramp only decides how each number is drawn, so 0 is purple and 255 is red. It needs no second or third band, and it is not heat: near-infrared is reflected sunlight. Bright leaves will simply land at the red end of the ramp."
    },
    {
      id: "w04-q09",
      from: "self-check",
      source: "Self-check quiz: Light and Bands",
      type: "mc",
      prompt: "What sets a weather satellite like GOES apart from Landsat?",
      choices: [
        "It flies lower, so its pixels are much sharper",
        "It stays over one spot, imaging it every few minutes",
        "It carries hundreds of narrow, contiguous bands",
        "It sends its own radar pulse, so it sees at night"
      ],
      answer: 1,
      explain: "GOES is geostationary: far out over the equator, it circles once a day, so it hangs over the same part of the Earth and can image it again and again. Landsat flies much lower, pole to pole, so its pixels are sharper, but it covers the planet one strip at a time and comes back only every few days."
    },
    {
      id: "w04-q10",
      from: "self-check",
      source: "Self-check quiz: Light and Bands",
      type: "mc",
      prompt: "Why doesn't one satellite do everything?",
      choices: [
        "Each satellite can carry only one band at a time",
        "Only one space agency is allowed to launch them",
        "Sharper pixels cost coverage and revisit time",
        "Clouds block every sensor, whatever its band"
      ],
      answer: 2,
      explain: "Every satellite trades detail against coverage and revisit. A sub-meter commercial image shows one torn roof but covers a few blocks; a weather satellite sees the whole storm every few minutes with pixels kilometers wide; Landsat sits in between. Satellites carry many bands, many agencies launch them, and radar sees through cloud."
    },
    {
      id: "w04-q11",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "tf",
      prompt: "Because a camera records what is directly below it, an aerial image can be used as an accurate map without any correction.",
      answer: false,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q12",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which is NOT a reason why remotely sensed images are valuable sources of spatial data?",
      choices: [
        "Images capture data from a large area at a relatively low cost.",
        "Satellite scanners can include data from wavelengths outside the range of human eyesight.",
        "Most freely available satellite data provide images with centimeter-resolution detail.",
        "There are well-established methods for removing distortion to achieve spatial geometric accuracy.",
        "Images can be used to compare changes over time."
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q13",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Using Figure 6-1 of the textbook (satellite and aerial images), which statement is true?",
      choices: [
        "The top image is a higher resolution image than the bottom image.",
        "The top image is a lower resolution image than the bottom image.",
        "Both images are the same resolution.",
        "It is impossible to know the resolution of these images."
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q14",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Considering the electromagnetic energy from the sun (Figure 6-2), which statement is true?",
      choices: [
        "Infrared electromagnetic waves are longer than visible electromagnetic waves.",
        "Infrared electromagnetic waves are shorter than visible electromagnetic waves.",
        "Infrared electromagnetic waves are essentially the same length as visible electromagnetic waves."
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q15",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which portion of the spectrum is about 0.4 - 0.5 micrometers?",
      choices: ["Blue light", "X-rays", "Near-infrared", "Radar"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q16",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which portion of the spectrum is about 0.7 - 1.1 micrometers?",
      choices: ["Blue light", "All visible light", "Near-infrared", "Radar"],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q17",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which portion of the spectrum is about 0.8 - 10 centimeters?",
      choices: ["Blue light", "X-rays", "Near-infrared", "Radar"],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q18",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Why do we use distance units when describing wavelengths?",
      choices: [
        "Distance units are somewhat meaningless because we can't see electromagnetic waves.",
        "Wavelength is literally a measure of the distance between the peaks of the electromagnetic waves.",
        "Wavelength indicates the distance between the sensor (satellite) and the object.",
        "Distance units reference the length (or width) of the object being observed."
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q19",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which of these is NOT a common use of aerial images in GIS?",
      choices: [
        "As a basis for measuring horizontal and vertical locations of objects shown in an image.",
        "For characterizing surface attributes such as landcover, land use, infrastructure, fire damage.",
        "As a base map or backdrop with other features drawn on top.",
        "To show depth of geologic formations for mining and mineral exploration."
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q20",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which satellite was the first Earth-observing satellite system?",
      choices: ["Radarsat", "RapidEye", "VIIRS", "Landsat"],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q21",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which is a radar-based satellite system developed by the Canadian Space Agency?",
      choices: ["Radarsat", "RapidEye", "VIIRS", "Sentinel"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q22",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which is the ESA satellite with a five-day return frequency?",
      choices: ["Radarsat", "RapidEye", "Sentinel", "Landsat"],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q23",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which is a privately operated satellite that provides 5-m resolution images in multiple bands?",
      choices: ["Radarsat", "RapidEye", "VIIRS", "Sentinel"],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q24",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "Which is the NASA/NOAA instrument for weather and land surface analysis data, the successor to MODIS?",
      choices: ["Radarsat", "RapidEye", "VIIRS", "Landsat"],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q25",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "From lecture (Georectifying Images): Which describes rectification, as opposed to georeferencing?",
      choices: [
        "Giving the image real-world coordinates so the software knows where it is",
        "Resampling the image so its pixels are square on the ground",
        "Tracing roads and buildings off the image into a feature class",
        "Choosing a reference layer to place control points against"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q26",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "From lecture: you are georeferencing a scanned 1890s topographic sheet of a valley with a town in the middle. Which set of eight control points is best?",
      choices: [
        "Eight bends along the river that crosses the sheet",
        "Eight building corners in the town at the center",
        "Road intersections and section corners spread to all four corners",
        "Four road intersections plus four points along the lake shore"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q27",
      from: "reading",
      source: "Learning Suite Reading Quiz 4",
      type: "mc",
      prompt: "From lecture (Remote Sensing): in a false-color composite the near-infrared band is displayed in the red channel. What color do healthy crop fields appear?",
      choices: ["Red", "Green, as they would in a natural-color photo", "Dark, almost black", "Blue"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 4."
    },
    {
      id: "w04-q28",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A LiDAR pulse takes 6.67 microseconds to return from the ground. About how far away is the ground? (c = 3 × 10⁸ m/s)",
      choices: ["500 m", "1,000 m", "2,000 m", "4,000 m"],
      answer: 1,
      explain: "Range = c × t / 2 = (3 × 10⁸ × 6.67 × 10⁻⁶) / 2 ≈ 1,000 m. Divide by two because the pulse goes there and back."
    }
  ]
});
