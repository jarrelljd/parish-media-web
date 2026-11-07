// How we work, shared by the homepage and the Social Media landing page
// (/parish) so both always tell the same story with the same numbers.
import type { StaticImageData } from "next/image";
import igGrid from "../../public/images/proof/st-joseph-instagram-grid.png";
import adOnPhone from "../../public/images/proof/ad-on-phone.png";
import monthlyReport from "../../public/images/proof/st-joseph-monthly-report-crop.png";

// Real results (same numbers as the Results page).
export const proofFacts = [
  { stat: "65", label: "young adults asked about young adult events in 60 days", who: "St. Patrick’s, South Hadley, MA" },
  { stat: "200", label: "men reached out about religious life in 90 days", who: "Capuchin Franciscans, Midwest Province" },
  { stat: "0→320", label: "Instagram followers in the first 30 days", who: "Ss. John & James, West Warwick, RI" },
];

// The three steps. `plain` is the everyday word for each step.
export const methodSteps: {
  n: string;
  title: string;
  plain: string;
  image: StaticImageData;
  alt: string;
  caption: string;
}[] = [
  {
    n: "1",
    title: "Encounter",
    plain: "Nurture",
    image: igGrid,
    alt: "St. Joseph Parish Instagram grid with homily clips, a festival flyer, and parish photos",
    caption: "St. Joseph Parish, Los Banos, CA. Homily clips and parish life, every week.",
  },
  {
    n: "2",
    title: "Invitation",
    plain: "Ask",
    image: adOnPhone,
    alt: "Facebook ad inviting St. Patrick's parishioners and friends to the annual parish picnic",
    caption: "A real invitation: the parish picnic at St. Patrick’s, South Hadley, MA.",
  },
  {
    n: "3",
    title: "Accompaniment",
    plain: "Follow-up",
    image: monthlyReport,
    alt: "Monthly community growth report for St. Joseph's Catholic Church, Los Banos",
    caption: "The monthly report a pastor receives. St. Joseph’s, Los Banos, CA.",
  },
];

// "We already have someone for social media": a volunteer vs. us.
export const comparison = [
  ["Posts to stay active, without a specific goal", "Clear goals for every campaign: event sign-ups, first-time visitors, volunteers"],
  ["Announces events and hopes the right people see them", "Targeted, trackable campaigns that get people nearby to show up to parish events"],
  ["Rarely reaches people who aren’t already in the pews", "Plan Your Visit campaigns that invite newcomers to Mass, with personal follow-up"],
  ["No way to tell what worked, or who came because of it", "Every response tracked, plus proven best practices from parishes in 12+ dioceses"],
];
