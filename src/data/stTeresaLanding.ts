// St. Teresa of Avila Catholic School (Carson City, NV): the fundraising landing page
// at /events/st-teresa-avila/build-the-school. Copy lives here; layout lives in
// components/st-teresa/.
//
// Sources: the school's campaign page (stts.org/District/Portal/Capital-Campaign) for the
// raised total, project cost, leadership, region and the Diocese's pledge rule; Principal
// Peggy Burger's campaign launch video (youtube.com/watch?v=9Y0yd1vRDEQ) for weekly Mass,
// daily sacraments, 20+ years of planning and the towns served; Nevada Appeal, Oct 12 2026
// (enrollment, building needs, 2028 opening, Jim Cavilia quote); Carson Now, Jan 21 2025
// (walking distance, doubled space, Fr. Babu quote). Confirm with the parish before launch.

const img = (name: string) => `/images/events/st-teresa-avila/landing/${name}`;

export const stTeresa = {
  parishSlug: "st-teresa-avila",
  eventSlug: "build-the-school",

  meta: {
    title: "Build the New St. Teresa of Avila Catholic School | Carson City, NV",
    description:
      "Help build a new Catholic school for the children of St. Teresa of Avila in Carson City, right beside their parish church on Lompa Lane.",
  },

  cta: { label: "Help Build St. Teresa’s", href: "#give" },

  phone: "(775) 882-2079",
  email: "campaign@stts.org",
  churchAddress: "3000 N. Lompa Lane, Carson City, NV",

  hero: {
    eyebrow: "Carson City, Nevada · Since 1958",
    headline: "Let’s build St. Teresa’s new school in Carson City",
    intro:
      "For 68 years, St. Teresa’s has formed Carson City’s children in the faith. Now they need a new school beside their parish church on Lompa Lane.",
    caption: "St. Teresa’s students, Lompa Lane, Carson City",
    photo: {
      src: img("school-on-the-land.jpg"),
      alt: "St. Teresa of Avila students gathered on open land with their parish church and the mountains behind them",
    },
  },

  // The only place these figures live. Update here when the parish reports a new total.
  progress: {
    raised: 20257231,
    goal: 26000000,
    raisedLabel: "$20,257,231",
    goalLabel: "$26M goal",
    remainingLabel: "About $5.7M to go",
    eyebrow: "Campaign progress",
    title: "We can’t break ground until it’s fully pledged",
    body: "The Diocese of Reno requires the full cost to be pledged before construction begins. Local families have brought St. Teresa’s past $20 million. We’re so close, and every gift counts.",
    asOf: "Campaign total reported by St. Teresa of Avila Catholic School, fall 2026. Project cost is approximately $26 million.",
  },

  // Principal Burger's campaign launch video, standing in until the Bishop's video is ready.
  vsl: {
    vimeoId: "1248149310",
    eyebrow: "A message from our principal",
    title: "Hear from Principal Peggy Burger",
    caption: "Principal Burger shared this vision when the campaign began in 2025. Since then, local families have brought St. Teresa’s past $20 million.",
  },

  story: {
    eyebrow: "Why the children need this",
    title: "A generation of children has grown up four miles from their church",
    lead: "In 2001, St. Teresa’s parish church moved to Lompa Lane. The school stayed behind on Richmond Avenue, and its children have lived with that distance ever since.",
    struggles: [
      {
        title: "Their church is out of reach",
        body: "St. Teresa’s is the only Catholic school in the Diocese of Reno without a parish within walking distance. On the new campus, children can attend Mass every week and have daily access to the sacraments.",
      },
      {
        title: "Their building is wearing out",
        body: "After nearly 70 years, the school needs a new boiler, a new alarm system and fire sprinklers.",
      },
      {
        title: "They have outgrown it",
        body: "221 students and about 60 young children need more room. The new campus doubles their space.",
      },
    ],
    close: "This school has been more than 20 years in the making. With your help, St. Teresa’s children can walk through its doors in fall 2028.",
    photo: {
      src: img("students-in-pew.jpg"),
      alt: "Young St. Teresa students in green uniforms leaning on a pew during Mass",
    },
  },

  region: {
    title: "The only Catholic school south of Reno",
    body: "Serving families from Carson City, Dayton, Minden, Gardnerville, Washoe Valley, South Reno and South Lake Tahoe.",
  },

  vision: {
    eyebrow: "The new St. Teresa’s",
    title: "What your gift will give these children",
    items: [
      {
        title: "Mass, steps from the classroom",
        body: "Weekly Mass and daily access to the sacraments, right beside the school.",
        photo: { src: img("students-at-altar.jpg"), alt: "Students standing around the altar with their priest at a school Mass" },
      },
      {
        title: "A parish family around them",
        body: "Children will grow up alongside parishioners who have lived the faith for a lifetime.",
        photo: { src: img("school-mass.jpg"), alt: "Students and families filling the pews of St. Teresa of Avila Church" },
      },
      {
        title: "Room to learn and play",
        body: "A K-8 school, a gym and a child development center for Carson City’s families.",
        photo: { src: img("recess.jpg"), alt: "Young students walking together across the grass at recess" },
      },
    ],
  },

  quote: {
    text: "Now, it’s our turn to contribute.",
    cite: "Fr. Thomas Babu, Pastor of St. Teresa of Avila",
    photo: { src: img("sanctuary.jpg"), alt: "The crucifix and stained glass of St. Teresa of Avila Church" },
  },

  people: {
    eyebrow: "Who your gift serves",
    title: "These are the children of St. Teresa’s",
    photos: [
      { src: img("students-together.jpg"), alt: "A group of St. Teresa students smiling together in the school hallway" },
      { src: img("altar-servers.jpg"), alt: "Two students in white albs serving at Mass" },
      { src: img("student-lectors.jpg"), alt: "Students reading at the ambo during the school Mass" },
      { src: img("lunch-table.jpg"), alt: "Young students at an outdoor lunch table" },
    ],
    voice: {
      text: "It’s great for those kids to see people that have lived the faith all of their life.",
      cite: "Jim Cavilia, Campaign General Chair",
    },
  },

  give: {
    eyebrow: "Make your gift",
    title: "Help build St. Teresa’s new school",
    body: "Your gift goes to the campaign to build the new St. Teresa of Avila Catholic School beside the parish church in Carson City.",
    trust: [
      "Bishop Mueggenborg is Honorary Chair",
      "Led by Fr. Babu and Principal Burger",
      "Carson City planning approval received",
    ],
    help: "Questions about giving?",
  },
};

export type StTeresaLanding = typeof stTeresa;
