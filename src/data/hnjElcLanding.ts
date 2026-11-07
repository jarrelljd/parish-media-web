// Holy Name of Jesus Early Learning Center (Indialantic, FL): the ad landing page at
// /events/holy-name-of-jesus/elc, where parents learn about the ELC and get the free
// parent guide. Same build as the St. Mary in the Mountains page; layout lives in
// components/hnj-elc/.
//
// Sources: hnjcatholicschool.org/elc, the 2026–2027 ELC tuition sheet, and the ELC
// Parent-Student Handbook (rev. 7/24/24). The handbook names a former pastor and older
// summer hours, so neither is used here. Photos: the ELC page, the
// school's photo shoot (June 2026), and Fr. Adam Marchese (current pastor) with children
// from the parish Drive. Don't use photos of the previous pastor.

const img = (name: string) => `/images/events/holy-name-of-jesus/elc/${name}`;

export const hnjElc = {
  parishSlug: "holy-name-of-jesus",
  eventSlug: "elc",
  parishName: "Holy Name of Jesus Early Learning Center",
  eventName: "HNJ Early Learning Center Parent Guide",
  webhookEnvVar: "ZAPIER_WEBHOOK_HNJ_ELC_GUIDE",
  guidePdf: "/downloads/hnj-elc-parent-guide.pdf",

  meta: {
    title: "Holy Name of Jesus Catholic Early Learning Center | Indialantic, FL",
    description:
      "Catholic, play-based early learning for children 16 months to 3 years, Monday to Friday, 7:30 AM to 5 PM, year-round. Get the free ELC parent guide with schedules and 2026–27 tuition.",
  },

  address: "3060 N. Hwy A1A, Indialantic, FL 32903",
  phone: "(321) 777-6368",
  email: "elc@hnj.org",
  schoolSite: "https://hnjcatholicschool.org/elc",
  facebook: "https://www.facebook.com/hnjschoolindialanticfl",
  elcLogo: img("elc-logo.png"),

  hero: {
    eyebrow: "Indialantic · Ages 16 months to 3",
    headline: "Your little one’s first Catholic classroom",
    intro:
      "At Holy Name of Jesus Early Learning Center, toddlers learn through play, pray with their teachers, and grow in the Catholic faith from day one. Open year-round, Monday to Friday, 7:30 AM to 5 PM.",
    photo: { src: img("hero.jpg"), alt: "Two toddlers gluing cotton balls onto a letter S at a classroom table" },
    badge: { value: "7:30–5", label: "Mon–Fri, year-round" },
  },

  cta: {
    label: "Get the Free ELC Guide",
    href: "#elc-guide",
  },

  guide: {
    eyebrow: "Free parent guide",
    title: "Everything you need to decide, in one guide",
    intro: "The questions parents ask us most, answered in a short guide you can read tonight:",
    contents: [
      "2026–27 schedules and weekly tuition",
      "A typical day in the classroom, from drop-off to pickup",
      "What to pack, what to label, and what to leave home",
      "How teachers guide behavior with calm, not time-outs",
      "How your child moves up to Holy Name of Jesus Catholic School",
    ],
    photo: { src: img("handprints.jpg"), alt: "A toddler pressing painted hands together with a classmate" },
  },

  form: {
    title: "Get your free ELC guide",
    intro: "We’ll email it to you right away.",
    submit: "Email Me the Guide",
    success: "Your guide is on its way to your inbox. Want it now? Open it below.",
    note: "Free. No obligation. We never share your information.",
  },

  lede: {
    title: "A Catholic home where little ones learn they are loved by God",
    body: [
      "Our Early Learning Center is part of Holy Name of Jesus Catholic School, just steps from the parish church in Indialantic. It is a warm, bright place where children 16 months to 3 years old spend their days playing, singing, exploring, and praying.",
      "Parents get photos and updates through the day, and families of enrolled children are welcome to stop in any time.",
    ],
    facts: ["Ages 16 months to 3 years", "Mon–Fri, 7:30 AM – 5 PM", "Open year-round", "Half or full days, 3 or 5 days a week"],
  },

  quote: {
    text: "Each child is a unique gift from God and should be treated as such.",
    photo: { src: img("fr-adam-vestment.jpg"), alt: "Fr. Adam Marchese holding up a red vestment for a group of children" },
    cite: "From the beliefs of the HNJ Early Learning Center",
  },

  day: [
    {
      title: "They learn through play",
      body: "Our themed, play-based curriculum (Beyond Learning) builds Florida’s early learning standards into every week: learning centers, songs, movement, stories, and time outside in our play area.",
      photo: { src: img("blocks.jpg"), alt: "A teacher on the rug building a block tower with two toddlers" },
    },
    {
      title: "Catholic faith, every day",
      body: "Children pray together, hear about Jesus, and grow up knowing their Catholic parish right next door. Here, Fr. Adam Marchese, the pastor of Holy Name of Jesus, shows children the chalice used at Mass.",
      photo: { src: img("fr-adam-chalice.jpg"), alt: "Fr. Adam Marchese kneeling to show a golden chalice to a group of children", position: "50% 30%" },
    },
    {
      title: "Calm, loving guidance",
      body: "We use Conscious Discipline. Instead of time-outs, a teacher stays with an upset child in a “safe spot,” helps them calm down, and gives them the words to share how they feel.",
      photo: { src: img("playground-friends.jpg"), alt: "Two little girls hugging on the school playground" },
    },
  ],

  trust: {
    title: "Peace of mind, all day long",
    items: [
      { title: "Photos and updates", body: "Check in and out, see photos, and get updates in real time through the Brightwheel app." },
      { title: "An open door", body: "Parents of enrolled children can visit the center at any time, without notice." },
      { title: "Checked volunteers", body: "Every classroom volunteer must have a cleared FBI background check on file." },
      { title: "Twice-a-year conferences", body: "Teachers track each child’s growth and sit down with you to set goals, fall and spring." },
    ],
  },

  path: {
    title: "A path from first steps to eighth grade",
    intro: "When your child is ready, they move up with friends they already know.",
    steps: [
      { age: "16 mo", title: "PK1", body: "Children 16 months to 2½ years. Must be walking and off the bottle." },
      { age: "2½", title: "PK2", body: "Children 2½ to 3 years old by September 1." },
      { age: "3+", title: "Holy Name of Jesus Catholic School", body: "Pre-K3 and VPK, then Kindergarten through 8th grade, right next door." },
    ],
    photo: { src: img("hnj-students.jpg"), alt: "Young Holy Name of Jesus students in uniform working on a project together" },
  },

  gallery: {
    title: "A look inside the classroom",
    photos: [
      { src: img("puzzle.jpg"), alt: "A toddler working on a picture puzzle on the classroom rug" },
      { src: img("puppet-barn.jpg"), alt: "Toddlers behind a red barn puppet theater holding chicken balloons" },
      { src: img("light-table.jpg"), alt: "A toddler placing leaves on a light table" },
      { src: img("bubbles.jpg"), alt: "Two toddlers reaching for bubbles in the classroom" },
      { src: img("feather-craft.jpg"), alt: "A smiling toddler holding a feather turkey craft" },
    ],
  },

  programs: {
    title: "Programs and schedules",
    rows: [
      { label: "Ages", value: "PK1: 16 months to 2½ years. PK2: 2½ to 3 years by September 1." },
      { label: "Hours", value: "Monday to Friday, 7:30 AM – 5 PM, year-round." },
      { label: "Schedules", value: "3 days (M, W, F) or 5 days a week. Half days end at noon." },
      { label: "Tuition", value: "Paid weekly. Every plan and rate for 2026–27 is in the free guide." },
      { label: "Where", value: "3060 N. Hwy A1A, Indialantic, FL 32903" },
    ],
  },

  faq: [
    {
      q: "What ages do you take?",
      a: "Children 16 months to 3 years old. To start, your child must be at least 16 months old, walking, and off the bottle.",
    },
    {
      q: "Do we need to be Catholic?",
      a: "No. We are a Catholic center, and our doors are open to every family who wants a loving, faith-filled start for their child, whatever your background.",
    },
    {
      q: "How will I know how my child’s day went?",
      a: "Through the Brightwheel app. You’ll get photos, daily notes, and updates in real time, and you can message your child’s teacher.",
    },
    {
      q: "Do you provide meals?",
      a: "Families pack meals and snacks, ready to serve. Teachers log what your child eats each day and help picky eaters along.",
    },
    {
      q: "Can I come see the center?",
      a: "Yes, please do. Call or email the ELC office to set up a tour. Details are in the guide.",
    },
  ],

  closing: {
    headline: "Give your child a joyful Catholic start",
    text: "Get the free ELC guide with schedules, tuition, and what a day looks like, then come see us.",
    photo: { src: img("playground-circle.jpg"), alt: "Young children holding hands in a circle with their teacher on the playground" },
  },
};

export type HnjElcLanding = typeof hnjElc;
