// St. Mary in the Mountains (Virginia City, NV): the "plan your visit" landing page
// at /events/st-mary-mountains/plan-your-visit, built in the design of the Capuchin
// Franciscans site. Copy lives here; layout lives in components/st-mary/.
//
// Sources: stmarysvc.org (Mass times, address, phone), the earlier draft at
// /events/st-mary-mountains/visit (history, hours, organ, font), and the VSL
// (quotes, transcribed; check wording against the video before launch).

const img = (name: string) => `/images/events/st-mary-mountains/landing/${name}`;

export const stMary = {
  parishSlug: "st-mary-mountains",
  eventSlug: "plan-your-visit",
  parishName: "St. Mary in the Mountains",
  // Same event name and Zap as the earlier draft, so leads land in the same place.
  eventName: "Come Visit St. Mary in the Mountains",
  webhookEnvVar: "ZAPIER_WEBHOOK_STMARYMOUNTAINS_VISIT",

  meta: {
    title: "Visit St. Mary in the Mountains | Virginia City, NV",
    description:
      "Step inside Nevada's oldest Catholic church, standing above Virginia City since 1870. Free museum and gift shop, open daily 10 AM to 4 PM. Get the free visit guide.",
  },

  address: "111 S. E Street, Virginia City, NV 89440",
  phone: "(775) 847-9099",
  facebook: "https://www.facebook.com/stmarysvc",

  hero: {
    eyebrow: "Virginia City · Since 1870",
    headline: "Step inside Nevada’s oldest Catholic church",
    intro:
      "St. Mary in the Mountains has stood above the old silver-mining town since 1870. Come pray, light a candle, and see the free museum and gift shop. Open every day, 10 AM to 4 PM.",
    video: img("hero-drone.mp4"),
    poster: img("hero-drone-poster.jpg"),
  },

  cta: {
    label: "Get the Free Visit Guide",
    href: "#visit-guide",
  },

  vsl: {
    eyebrow: "Watch · 4 minutes",
    title: "Hear it from the Bishop of Reno",
    vimeoId: "1243815099",
    caption: "With Bishop Daniel Mueggenborg and the people of St. Mary’s.",
  },

  form: {
    title: "Get your free visit guide",
    intro: "A guide to a 60-minute visit: tour info, parking, and the 3 must-see spots in historic Virginia City.",
    submit: "Email Me My Visit Guide",
    success: "You’re all set! Check your inbox for your St. Mary in the Mountains visit guide.",
    note: "Free. Sent straight to your inbox.",
  },

  lede: {
    title: "Where the Comstock came to pray",
    body: [
      "When silver made Virginia City one of the richest towns in the West, its people built a church to match. John Mackay, who struck the Big Bonanza, prayed here on Sundays and lived two blocks away. After the Great Fire of 1875, he helped pay to rebuild it.",
      "Today it is still the only working house of worship in Virginia City. Visitors of every background walk in, sit in a pew, and find it quiet.",
    ],
    facts: ["Built 1870, rebuilt 1877", "Free museum and gift shop", "Open daily, 10 AM – 4 PM", "Sunday Mass, 11:30 AM"],
  },

  quote: {
    text: "You really haven’t had a complete visit to Virginia City until you understand this part of the history as well.",
    photo: { src: img("bishop-portrait.jpg"), alt: "Bishop Daniel Mueggenborg" },
    cite: "Bishop Daniel Mueggenborg, Bishop of Reno",
  },

  inside: [
    {
      title: "A white Gothic altar",
      body: "Walk up the center aisle to the white high altar, framed by carved wooden arches and stained glass on every side. Stay as long as you like. The church is open for prayer all day.",
      photo: { src: img("altar.jpg"), alt: "The white Gothic high altar of St. Mary in the Mountains, with candles and sunflowers" },
    },
    {
      title: "A font that survived the fire",
      body: "The Great Fire of 1875 burned most of the town, and the church with it. Its pewter baptismal font made it through, and it is still used for baptisms today.",
      photo: { src: img("baptismal-font-wide.jpg"), alt: "The 1875 baptismal font, topped by a statue of St. John baptizing Jesus" },
    },
    {
      title: "An 1898 organ under the rose window",
      body: "Look back toward the loft to see a rare c. 1898 William Schuelke pipe organ, built for a church in Wisconsin and brought here in 1982. It is still played today.",
      photo: { src: img("organ-rose-window.jpg"), alt: "The pipe organ in the choir loft beneath the rose window" },
    },
  ],

  history: [
    {
      year: "1862",
      title: "A priest arrives on the Comstock",
      body: "Father Patrick “Paddy” Manogue comes to the mining camp and builds the first St. Mary’s, a small wooden church nearby.",
    },
    {
      year: "1870",
      title: "The brick church rises",
      body: "Silver money builds the Gothic church of brick and marble that still crowns the Virginia City skyline.",
    },
    {
      year: "1877",
      title: "Rebuilt after the Great Fire",
      body: "The 1875 fire leaves the church in ruins. With the help of John Mackay, the “Bonanza Church” is rebuilt by 1877.",
    },
    {
      year: "1959",
      title: "Saved a second time",
      body: "A 1957 “modernization” smashes the original stained glass and tears out the choir loft. Father Caviglia stops the damage in 1959, and his successor commissions the windows you see today.",
    },
    {
      year: "Today",
      title: "Still open every day",
      body: "Mass every Sunday, a free museum and gift shop, and a quiet place to pray for anyone who walks through the doors.",
    },
  ],

  voices: [
    {
      text: "When you do walk into those doors, you just feel alone with God, whatever religious background you have.",
      cite: "Dave & Kitty, parishioners",
    },
    {
      text: "It’s probably the most visited parish in the Diocese of Reno, and it should be a center for evangelization.",
      cite: "Zachary Werner, Diocese of Reno",
    },
  ],

  gallery: {
    title: "A look inside",
    photos: [
      { src: img("nave.jpg"), alt: "The nave of St. Mary in the Mountains, looking toward the altar" },
      { src: img("ceiling.jpg"), alt: "The carved wooden ceiling and chandelier, with the rose window beyond" },
      { src: img("station.jpg"), alt: "A Station of the Cross between stained glass windows" },
      { src: img("sacred-heart.jpg"), alt: "A statue of the Sacred Heart of Jesus with sunflowers" },
      { src: img("side-altar.jpg"), alt: "A white side altar with a statue of Mary" },
      { src: img("confessional.jpg"), alt: "The carved wooden confessional beside the stair to the choir loft" },
    ],
  },

  plan: {
    title: "Plan your visit",
    rows: [
      { label: "Hours", value: "Church, museum, and gift shop open daily, 10 AM – 4 PM" },
      { label: "Mass", value: "Sunday 11:30 AM · Wednesday 9:00 AM" },
      { label: "Admission", value: "Free. Donations help preserve the church." },
      { label: "Where", value: "111 S. E Street, Virginia City, NV 89440" },
    ],
    giftShop: {
      title: "The museum and gift shop",
      body: "Learn the story of Nevada’s first parish in the free museum, then browse the gift shop for rosaries, medals, and keepsakes from your trip.",
      photo: { src: img("gift-shop.jpg"), alt: "Shelves of religious gifts in the St. Mary in the Mountains gift shop" },
    },
    photo: { src: img("aerial-town.jpg"), alt: "St. Mary in the Mountains from above, with Virginia City and the hills behind it" },
  },

  faq: [
    {
      q: "Do I need to be Catholic to visit?",
      a: "Not at all. Visitors of every background are welcome to come in, sit, pray, and look around.",
    },
    {
      q: "Does it cost anything?",
      a: "No. The church, museum, and gift shop are free to visit. Donations help keep the doors open and preserve the building.",
    },
    {
      q: "Can I come to Mass?",
      a: "Yes. Mass is on Sunday at 11:30 AM and Wednesday at 9:00 AM. Everyone is welcome.",
    },
    {
      q: "What is in the visit guide?",
      a: "Tour info, parking, and the 3 must-see spots in historic Virginia City, so you can see the best of it in about an hour.",
    },
  ],

  closing: {
    headline: "See it for yourself",
    text: "Get the free visit guide and make St. Mary’s part of your Virginia City trip.",
    photo: { src: img("facade.jpg"), alt: "The brick and white Gothic front of St. Mary in the Mountains" },
  },
};

export type StMaryLanding = typeof stMary;
