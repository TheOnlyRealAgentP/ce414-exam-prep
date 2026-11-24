EX.week({
  id: "w01",
  num: 1,
  exam: 1,
  title: "Data Models",
  reading: "Bolstad Ch. 1–2",
  lab: "",
  blurb: "What a GIS dataset is (a model), the vector, raster and TIN data models, data models versus file formats, and coordinates in decimal degrees.",
  notes: [
    "**A GIS dataset is a model**: an abstraction chosen for a purpose. Even a raft video is a model. Nothing in a GIS is reality itself.",
    "**Vector** (points, lines, polygons) suits discrete things: gage sites = points, boundaries = lines or polygons.",
    "**Raster** is a grid that must have a value in every cell, so it suits data that exists everywhere (elevation, imagery). Storing a state boundary as a raster costs far more memory, gives stair-stepped edges, and buys no extra accuracy.",
    "**TIN**: triangles. Small triangles go where the surface changes quickly, big ones on flat ground. That uneven spacing is the compression, and a fixed grid can't do it.",
    "**Data model ≠ file format.** Polyline is a data model. Shapefile, geodatabase feature class, GeoPackage and GeoJSON are formats, and the same rivers can be polylines in any of them.",
    "\"Raster is faster, but vector is correcter.\"",
    "**DMS → decimal degrees:** DD = D + M/60 + S/3600. Example: 40°14′24″ = 40 + 0.2333 + 0.0067 = 40.24°. South and west are negative.",
    "**Topology:** the spatial relationships (adjacency, connectivity, containment) between features. Know the Chapter 1–2 vocabulary."
  ],
  questions: [
    {
      id: "w01-q01",
      from: "self-check",
      source: "Self-check quiz: Storing the World",
      type: "mc",
      prompt: "A video shot from a raft running the Lochsa River",
      choices: ["Reality", "A model of reality", "Neither"],
      answer: 1,
      detail: "Real water, real rapids, recorded and played back in class.",
      explain: "A model is an abstraction of reality, and a video is one: framed, flattened, silent about depth, discharge and everything outside the lens. Nothing you open in a GIS is the thing itself — it is always a representation somebody chose."
    },
    {
      id: "w01-q02",
      from: "self-check",
      source: "Self-check quiz: Storing the World",
      type: "mc",
      prompt: "Stored as a filled grid, Colorado took several times the memory of the coordinate list",
      choices: [
        "The raster version is therefore the more accurate one",
        "The extra memory bought no extra accuracy",
        "The raster is accurate only when the cells are large"
      ],
      answer: 1,
      detail: "Every cell had to carry a value — one for the state, another standing for no data.",
      explain: "The grid cost far more memory and gave stair-stepped borders instead of clean edges. A raster has to be filled in everywhere, which is why it suits data that exists everywhere — not a boundary line."
    },
    {
      id: "w01-q03",
      from: "self-check",
      source: "Self-check quiz: Storing the World",
      type: "mc",
      prompt: "Where does a TIN put its smallest triangles?",
      choices: [
        "Spread evenly across the whole surface",
        "Where the surface is flat",
        "Where the surface changes quickly"
      ],
      answer: 2,
      detail: "The same surface, meshed with triangles rather than sampled on a grid.",
      explain: "Big triangles cover flat ground with a handful of points; small ones go where the shape actually changes. That uneven spacing is the compression, and it is exactly what a fixed grid cannot do."
    },
    {
      id: "w01-q04",
      from: "self-check",
      source: "Self-check quiz: Storing the World",
      type: "mc",
      prompt: "Which of these is a data model rather than a file format?",
      choices: ["Shapefile", "GeoJSON", "File geodatabase", "Polyline"],
      answer: 3,
      detail: "The rivers layer could be written any of these ways.",
      explain: "The data model is the conceptual organization of the data; the file format is how the bytes sit on disk. The same rivers can be a shapefile, a feature class in a file geodatabase, a GeoPackage or a GeoJSON file and still be polylines."
    },
    {
      id: "w01-q05",
      from: "self-check",
      source: "Self-check quiz: Storing the World",
      type: "mc",
      prompt: "The stream gage sites along a river",
      choices: ["Vector points", "Raster grid", "TIN"],
      answer: 0,
      detail: "A handful of installed stations, each reporting its own record.",
      explain: "A gage is one coordinate pair with attributes behind it — discrete and countable. A raster would have to invent a value for every cell between the gages, and there is nothing there to measure."
    },
    {
      id: "w01-q06",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Choose the best definition of \"topology\".",
      choices: [
        "Numeric data which describes adjacency, containment, and connectivity between map features.",
        "Text or labels plotted on a map which describe or identify a feature.",
        "A data model that is used to represent three dimensional objects as triangular faces."
      ],
      answer: 0,
      explain: "Topology is described in Chapter 2."
    },
    {
      id: "w01-q07",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of the following can be represented perfectly (at all map scales) as an (x,y) coordinate on a map?",
      choices: [
        "A bench in Brigham Square at BYU",
        "A person walking through Brigham Square at BYU",
        "The outline of Brigham Square at BYU",
        "The exact center of Brigham Square at BYU"
      ],
      answer: 3,
      explain: "A point has no area, width or length, so a coordinate captures it exactly at any scale."
    },
    {
      id: "w01-q08",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "What is the difference between a data model and a file format?",
      choices: [
        "A data model is a conceptual model whereas a file format is a structured means for storing data on a hard drive (or other storage media).",
        "A data model describes the extension (.xls or .txt) associated with a data set, whereas a file format is a conceptual structure.",
        "Data models and file formats are the same thing."
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q09",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Most 3-D immersive video games make extensive use of which elevation data model because it renders fast on video cards?",
      choices: ["Raster", "Vector", "TIN", "Extrusion"],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q10",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Given the definition of a \"model\" as an \"abstraction of reality\", which of the following is NOT a model of the City of Provo?",
      choices: [
        "A street map of the City of Provo.",
        "An aerial photo of the City of Provo.",
        "An old Daguerreotype photo of the streets of Provo from the 1890s.",
        "The actual City of Provo."
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q11",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of the following most closely matches the textbook's definition of GIS?",
      choices: [
        "A computer-based system to aid in the collection, maintenance, storage, analysis, output, and distribution of spatial data and information.",
        "A product developed by a company called Esri in Redlands, California.",
        "A satellite-based location-finding system that uses triangulation to identify one's position in space."
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q12",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "tf",
      prompt: "GIS is particularly well suited to mapping, modeling, and understanding environmental problems and human impacts on the environment.",
      answer: true,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q13",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of the following is NOT a reason given in the textbook for the use of GIS by businesses?",
      choices: [
        "Finding potential customers",
        "Looking at the distribution of competitors",
        "Routing delivery vehicles",
        "Construction planning",
        "Selling stocks and bonds",
        "Designing parking"
      ],
      answer: 4,
      explain: "The author doesn't discuss selling stocks and bonds."
    },
    {
      id: "w01-q14",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "What is the difference between geographic information systems (GIS) and geographic information science (GIScience)?",
      choices: [
        "GIScience is the theoretical foundation on which GIS technology is built.",
        "GIS is the concepts and GIScience is the technology.",
        "GIScience is the application of GIS technology to real world engineering problems."
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q15",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of these is NOT a legitimate location on the earth's surface in decimal degrees?",
      choices: [
        "Lat: 92.013, Lon: -110.001",
        "Lat: 25.272, Lon: 55.307",
        "Lat: 78.098, Lon: 16.246",
        "Lat: 0, Lon: 0"
      ],
      answer: 0,
      explain: "Latitude can't exceed 90 degrees."
    },
    {
      id: "w01-q16",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Select the true statement.",
      choices: [
        "Parallels are lines of longitude, meridians are lines of latitude.",
        "Parallels and meridians are both lines of latitude.",
        "Parallels are lines of latitude, meridians are lines of longitude.",
        "Parallels and meridians are both lines of longitude."
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q17",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Convert to decimal degrees: 60 degrees 45 minutes 30 seconds North.",
      choices: ["60.4530 degrees north", "60.4550 degrees north", "60.7583 degrees north", "61.2500 degrees north"],
      answer: 2,
      explain: "60 + 45/60 + 30/3600 = 60.7583."
    },
    {
      id: "w01-q18",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "What is the meaning of the saying \"Raster is faster but vector is better\"?",
      choices: [
        "Raster analysis is more accurate because it captures point, line and polygon data with exactness.",
        "It is more efficient to store and analyze data in a raster format, but vector data can capture more feature detail.",
        "Raster files are larger and hence faster for the computer to open and close than vector files."
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q19",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of these map layers is most likely to contain polygon data?",
      choices: [
        "\"Rivers of the United States\"",
        "\"The U.S. - Mexico Border\"",
        "\"Provo Airport Runway Configuration\"",
        "\"Walmart Locations Around the World\""
      ],
      answer: 2,
      explain: "It is a question of scale: a runway configuration is detailed enough to be polygons."
    },
    {
      id: "w01-q20",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of the following is NOT an example of raster data?",
      choices: [
        "A map displayed on the Google Maps web site",
        "A photo of you posted on the internet",
        "A photo of your dog posted on the internet",
        "A regular grid of elevation values depicting mountain heights",
        "A digital scan of an old map",
        "None of the above"
      ],
      answer: 5,
      explain: "All of these are examples of raster data."
    },
    {
      id: "w01-q21",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "What is the purpose of symbology in GIS software and map-making?",
      choices: [
        "Change the underlying attribute data",
        "Change the way that the data is displayed in a map",
        "Change the geometry of the raw data",
        "Change the coordinate system of the data"
      ],
      answer: 1,
      explain: "Symbology does not change the data at all; it only changes how the data are displayed."
    },
    {
      id: "w01-q22",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which spatial phenomenon would be best represented by a raster data model?",
      choices: [
        "Air temperature variability throughout Utah County.",
        "The locations of air temperature monitoring weather stations in Utah County.",
        "The outline of the National Weather Service building in Salt Lake City.",
        "A graph of one month of daily maximum air temperature for the BYU campus."
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q23",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which spatial phenomenon would best be represented by a vector data model?",
      choices: [
        "A photo of the White House",
        "A terrain map of Washington, D.C.",
        "A map of subsurface ground water pressure throughout Washington, D.C.",
        "A planting plan for the vegetable garden at the White House"
      ],
      answer: 3,
      explain: "Landcover-style maps are made of distinct, non-overlapping polygons."
    },
    {
      id: "w01-q24",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Why is there typically a one-to-one relationship between features in a vector data model and rows in an attribute table?",
      choices: [
        "Each row of the attribute table contains descriptive information about a single feature.",
        "Each row contains descriptive information about multiple features.",
        "Each row contains descriptive information about all of the features."
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q25",
      from: "reading",
      source: "Learning Suite Reading Quiz 1",
      type: "mc",
      prompt: "Which of the following is NOT a required element of all maps you produce in this class?",
      choices: [
        "Your name, date, class, assignment number",
        "Map title",
        "North arrow",
        "Scale bar",
        "Contour lines",
        "Legend"
      ],
      answer: 4,
      explain: "Your correct answer on Learning Suite Reading Quiz 1."
    },
    {
      id: "w01-q26",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A coordinate is written 40° 14′ 24″ N. What is it in decimal degrees?",
      choices: ["40.14°", "40.24°", "40.40°", "40.60°"],
      answer: 1,
      explain: "DD = D + M/60 + S/3600 = 40 + 14/60 + 24/3600 = 40 + 0.2333 + 0.0067 = 40.24°."
    }
  ]
});
