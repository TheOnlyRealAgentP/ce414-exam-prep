EX.week({
  id: "w12",
  num: 12,
  exam: 2,
  title: "Network Analysis",
  reading: "",
  lab: "Lab 11",
  blurb: "Network datasets, impedance, one-way streets, network versus buffer distance, and which solver answers which question.",
  notes: [
    "A **network dataset** = **edges, junctions, connectivity**. Connectivity lives in the junctions: two roads that cross on the map but share no junction are **not connected** (right for an overpass, and a silent break at a real intersection). **Build Network** builds that connectivity.",
    "**Impedance** = whatever you choose to minimize (minutes, meters). Meters and minutes rank the same edges differently, so the routes can differ. A fire engine's standard is written in minutes.",
    "**One-way streets and turns** enter either as **costs** (UGRC: TravelMinutes 3.04 one way vs. 304 the other, a 100× penalty, so a solver goes the wrong way only if nothing else reaches) or as **walls** (restrictions make the edge impassable).",
    "UGRC's TravelMinutes = length ÷ posted speed, with **surface streets × 1.5** to stand in for **signals, stops and cross traffic**. It's a crude model of typical driving.",
    "**Network distance vs. straight-line vs. cost distance:** vehicles are confined to roads, so **network distance fits a fire engine**, cost distance fits a power line crossing country, and a buffer is simply wrong here.",
    "**What the network doesn't know** (lights and sirens, traffic, closures, real addresses) and which way each gap moves the answer.",
    "**Service area workflow:** Make Service Area Analysis Layer → Add Locations → **Solve** (nothing is computed until you solve; Copy Features then keeps the result). Solve spreads minutes outward along the edges, cheapest first.",
    { text: "**Which solver for which question:**", sub: [
      "**Service Area:** what can a facility reach in N minutes? (away from the station)",
      "**Closest Facility:** for this address, which station arrives first and in how many minutes? (toward the station; can differ from service area on one-way streets)",
      "**Location-Allocation (maximize coverage):** where should a new station go to cover the most residents within the cutoff?",
      "**Route:** the best path between stops."
    ] },
    "**Buffer vs. service area:** a 3.75 km buffer around the stations leaves 3.5% of Utah County outside, while the 4-minute service area leaves **57.5%** outside. The circle ignores roads; the engine can't. **Minutes → buffer distance:** speed × time (4 min at 35 mph = 35 × 4/60 = 2.33 mi = **3.75 km**).",
    "**Lab 11:** the cutoff is a parameter, and each student runs a different one, to show **how much the answer depends on the standard**. Know the network's two costs and their evaluators, why the service areas are **dissolved**, what Select Data does, why the model selects on its own layer made with **Make Feature Layer**, what \"Have their center in\" and **invert select** do, and what comparing four minutes with your own cutoff shows."
  ],
  questions: [
    {
      id: "w12-q01",
      from: "self-check",
      source: "Self-check quiz: Along the Roads",
      type: "mc",
      prompt: "Two road segments cross on the map but share no junction in the network dataset. What can a route do there?",
      choices: [
        "Turn from one onto the other, since the lines touch",
        "Turn, but with a delay added for the crossing",
        "Turn only if both segments are two-way",
        "Nothing: the edges are not connected"
      ],
      answer: 3,
      explain: "Connectivity lives in the junctions. An overpass crosses a street on the map and never meets it in the network, which is exactly right for a freeway; it is also why a missing junction at a real intersection silently breaks every route through it."
    },
    {
      id: "w12-q02",
      from: "self-check",
      source: "Self-check quiz: Along the Roads",
      type: "mc",
      prompt: "In UGRC's network, TravelMinutes on a one-way segment is 3.04 one way and 304 the other. How is the one-way rule being enforced?",
      choices: [
        "As a restriction: the wrong direction is forbidden",
        "As a cost: 100 times the right direction",
        "It is not enforced; the two values are a data error"
      ],
      answer: 1,
      explain: "A restriction attribute would make the edge impassable one way. UGRC chose a cost instead, a hundredfold penalty, so a solver will go the wrong way only when nothing else reaches at all. Both are models of the same sign; they differ in what happens at the edge of the network."
    },
    {
      id: "w12-q03",
      from: "self-check",
      source: "Self-check quiz: Along the Roads",
      type: "mc",
      prompt: "A network carries two costs, TravelMinutes and Length. You solve a route with each. Why can the two routes differ?",
      choices: [
        "They cannot; the solver always finds the same edges",
        "Meters and minutes rank the same edges differently",
        "Length ignores one-way streets and TravelMinutes does not"
      ],
      answer: 1,
      explain: "An impedance is whatever you choose to minimize. Meters and minutes rank the same edges differently, so the cheapest route under one can be expensive under the other. Which impedance is right depends on the question: a fire engine's standard is written in minutes."
    },
    {
      id: "w12-q04",
      from: "self-check",
      source: "Self-check quiz: Along the Roads",
      type: "mc",
      prompt: "UGRC's TravelMinutes is the segment length divided by the posted speed and converted to minutes, with surface-street times multiplied by 1.5. What is that factor standing in for?",
      choices: [
        "Signals, stops and cross traffic",
        "The extra length of a curved street",
        "The time a fire engine loses leaving the station",
        "A unit conversion from miles to kilometers"
      ],
      answer: 0,
      explain: "A posted limit is a ceiling, not an average. Streets with traffic lights and cross traffic move slower than their limit, so UGRC scaled them up; freeways kept their limit. It is a crude model of typical driving, and UGRC says so, which is why Lab 11 asks what an engine with its lights on does to the answer."
    },
    {
      id: "w12-q05",
      from: "self-check",
      source: "Self-check quiz: Along the Roads",
      type: "mc",
      prompt: "Lab 1 buffered roads and stores; Lab 10 accumulated cost across a raster; Lab 11 travels a network. Which distance belongs to a fire engine's response time?",
      choices: [
        "Straight-line, because a buffer is the simplest",
        "Cost distance, because terrain always matters",
        "Network distance: engines stay on the roads",
        "Any of them, since all three measure meters"
      ],
      answer: 2,
      explain: "Each distance fits a different mover. A power line crosses country, so a cost surface fits it; a vehicle is confined to the roads, so its distance runs along the edges and through the junctions. The buffer is the one that is simply wrong here, and Lab 11 measures by how much."
    },
    {
      id: "w12-q06",
      from: "self-check",
      source: "Self-check quiz: Four Minutes Away",
      type: "mc",
      prompt: "You run Make Service Area Analysis Layer and Add Locations, and the map shows the stations but no polygons. What is missing?",
      choices: [
        "Solve: nothing is computed until the layer is solved",
        "A larger search tolerance",
        "Copy Features, to write the polygons to the geodatabase",
        "A travel mode with a name"
      ],
      answer: 0,
      explain: "The analysis layer holds the settings and the inputs; Solve is the step that walks the network outward from each facility and fills in the Polygons sublayer. Copy Features only keeps what Solve produced."
    },
    {
      id: "w12-q07",
      from: "self-check",
      source: "Self-check quiz: Four Minutes Away",
      type: "mc",
      prompt: "A dispatcher asks: for this address, which station's engine arrives first, and in how many minutes? Which solver?",
      choices: ["Service Area", "Location-Allocation", "Closest Facility", "Route"],
      answer: 2,
      explain: "Closest Facility starts at incidents and finds the nearest facility by the network cost, with the route and its minutes. A service area answers the opposite question, what a facility can reach; location-allocation chooses where facilities should be."
    },
    {
      id: "w12-q08",
      from: "self-check",
      source: "Self-check quiz: Four Minutes Away",
      type: "mc",
      prompt: "A city wants to know where one new station would bring the most residents inside four minutes. Which solver?",
      choices: [
        "Service Area, run once per candidate site",
        "Location-Allocation, maximize coverage",
        "Closest Facility from every block",
        "Route from the existing stations"
      ],
      answer: 1,
      explain: "Location-allocation weighs demand (people, by block) against candidate sites and picks the set that covers the most within the cutoff. You could brute-force it with one service area per candidate; the solver does that comparison for you, with the existing stations held as required."
    },
    {
      id: "w12-q09",
      from: "self-check",
      source: "Self-check quiz: Four Minutes Away",
      type: "mc",
      prompt: "A 3.75 km buffer around the stations leaves 3.5 % of Utah County outside; the four-minute service area leaves 57.5 % outside. Why so different?",
      choices: [
        "The buffer was drawn in the wrong coordinate system",
        "The service area forgets the stations near the county line",
        "Census blocks are too small for a buffer to count",
        "The circle ignores the roads; the engine cannot"
      ],
      answer: 3,
      explain: "The buffer assumes the engine drives 35 mph in every direction at once, across the lake if need be. The network makes it follow roads at UGRC's typical-traffic minutes, with signals and turns; four minutes of that reaches a few kilometers along a few streets. Same standard, two models of movement."
    },
    {
      id: "w12-q10",
      from: "self-check",
      source: "Self-check quiz: Four Minutes Away",
      type: "mc",
      prompt: "In Lab 11 the four-minute cutoff is a model parameter and every student runs a different one. What is the lab asking you to find out?",
      choices: [
        "The one true response-time standard for Utah County",
        "How much the answer depends on the standard",
        "Whether Network Analyst is faster than a buffer",
        "Which stations should close"
      ],
      answer: 1,
      explain: "Four minutes is a standard somebody chose. Varying it shows how much of the answer is the standard and how much is the road network and where people live: a few minutes more takes in whole cities, and after that the share stops falling because almost nobody is left."
    },
    {
      id: "w12-q11",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] A street segment was digitized so that it ends 2 m short of the street it should meet. What can a route do at that corner?",
      choices: [
        "Turn there anyway, since a 2 m gap is too small to matter",
        "Nothing: the two segments share no junction, so they are not connected",
        "Turn there, but with a turn delay added for the gap",
        "Turn there, because the solver snaps lines that are close together"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q12",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] A one-way street can be modeled as a cost (wrong direction costs 100 times the right one) or as a restriction. What is the practical difference?",
      choices: [
        "None: a restriction is another name for a large cost",
        "With the cost, wrong-way travel is free; with the restriction, it is charged",
        "With the restriction, one-way streets are removed from the network",
        "With the cost, a route can still go the wrong way if every legal way costs even more; with a restriction, never"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q13",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] Between the same two points, the fewest-meters route is 9.9 km and takes 23.4 minutes; the fewest-minutes route is 15.3 km and takes 15.1 minutes. Why does the shorter route take longer?",
      choices: [
        "It stays on slower local streets, while the longer route uses a fast freeway",
        "It drives against one-way streets and pays their wrong-way cost",
        "The two routes were solved on two different networks",
        "The fewest-minutes route leaves out the turn delays"
      ],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q14",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] UGRC's TravelMinutes multiplies surface-street times by 1.5. What does the 1.5 stand for?",
      choices: [
        "The extra length of curves that the line does not show",
        "The faster driving of emergency vehicles",
        "Signals, stops and cross traffic that slow real driving below the speed limit",
        "The conversion from miles to kilometers"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q15",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] A network dataset carries a delay for each kind of turn (for example 30 seconds for a left turn between local streets). When does a route or service-area solver use those delays?",
      choices: [
        "Only when the user opens the turn table in the properties",
        "In every solve: each turn adds its delay to the minutes of the route",
        "Only for routes longer than the cutoff",
        "Never: the table is documentation only"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q16",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] Lab 1 buffered features, Lab 10 accumulated cost across a raster, and Lab 11 travels a road network. Which distance fits a fire engine's response time?",
      choices: [
        "Straight-line distance: a buffer around each station",
        "Cost distance: accumulated across a raster in any direction",
        "Distance to the nearest station, measured on the map",
        "Network distance: along the roads, in minutes"
      ],
      answer: 3,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q17",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] You run Make Service Area Analysis Layer then Add Locations. The stations appear but there are no service-area polygons. What is missing?",
      choices: [
        "A travel mode",
        "A second cutoff",
        "Solve: nothing is computed until the layer is solved",
        "Copy Features"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q18",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] A dispatcher asks: for this address, which station's engine arrives first, and in how many minutes? Which solver answers that?",
      choices: ["Closest Facility", "Service Area", "Location-Allocation", "Origin-destination cost matrix"],
      answer: 0,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q19",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] A city wants to know where one new station would bring the most residents within four minutes of an engine. Which solver?",
      choices: [
        "Closest Facility, from every home to the nearest station",
        "Location-Allocation, maximizing coverage",
        "Service Area, from the existing stations only",
        "Route, from each candidate site to city hall"
      ],
      answer: 1,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q20",
      from: "reading",
      source: "Learning Suite Reading Quiz 10",
      type: "mc",
      prompt: "[From class] A four-minute buffer around the stations leaves far fewer people outside than a four-minute service area does. Why?",
      choices: [
        "The buffer uses a slower speed than the network",
        "The service area counts each block twice where stations overlap",
        "The buffer reaches in every direction at once, across lakes and between roads; an engine must follow the roads",
        "The service area leaves out the freeways"
      ],
      answer: 2,
      explain: "Your correct answer on Learning Suite Reading Quiz 10."
    },
    {
      id: "w12-q21",
      from: "hand-calc",
      source: "Hand calculation (written for this guide)",
      type: "mc",
      prompt: "A fire engine is assumed to travel 35 mph. About how long a buffer radius matches a 4-minute response in the lab's 'circle' model?",
      choices: ["2.3 km", "3.75 km", "5.6 km", "14.1 km"],
      answer: 1,
      explain: "35 mph × (4/60 h) = 2.33 mi = 3.75 km. That is the buffer the quiz compares with the four-minute service area (which leaves 57.5% of Utah County outside, vs. 3.5% for the buffer)."
    }
  ]
});
