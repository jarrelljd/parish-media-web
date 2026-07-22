# Parish Media Company — Website Content & Design Brief

*This is the authoritative spec for building the site. Hand this document to Claude Code as the primary source of truth.*

---

## 1. Brand Basics

- **Business name:** Parish Media Company
- **Founder:** Joe Jarrell
- **Domain:** parishmediacompany.com (registered on Cloudflare)
- **Contact email:** joe@parishmediacompany.com (Google Workspace — pending setup)
- **Positioning:** Parish Media Company helps Catholic parishes, dioceses, vocation offices, and Newman Centers grow real engagement — especially with young adults — through organic social media and targeted Meta ads, without adding to the pastor's workload.

---

## 2. Founder Story (About section)

Joe spent three years building an online following and running a fitness program for Catholic men — working with over 200 men, including 20 priests. Along the way, he felt called to something bigger: helping parishes reach the people who need them most. In early 2026, he went all-in and founded Parish Media Company.

**Tone guardrail:** Do not imply multi-year parish-marketing tenure. The business is ~7 months old as of writing. Let the client roster and results carry credibility — not inflated experience claims.

**Founder photo:** presentation/speaking photo (confident, professional, mid-explanation). File in project assets.

---

## 3. Site Structure (single page, tabbed/anchor navigation)

1. **Home** — hero statement, core offer lead, proof teaser, CTA
2. **How It Works** — split into "For Parishes" and "For Vocation Offices," plus a smaller "Additional Services" block
3. **Testimonials** — Fr. Fleming video + quote, client logo/name wall
4. **About** — founder story, photo
5. **Contact** — form + Calendly redirect

Navigation: sticky top nav, anchor-linked tabs to each section (not separate pages).

---

## 4. Section-by-Section Content

### Home
- Hero headline: lead with core parish offer (social + ads), not vocation office work
- Subhead should include the "without filling up the pastor's calendar" differentiator
- Teaser line linking to vocation office work lower on page / in How It Works
- Primary CTA: "Get Started" — scrolls to Contact

### How It Works — For Parishes
Explain in this order:
1. Organic content: Joe's team gets access to the parish's homily footage (livestream or uploaded), edits it into clips, posts via Metricool to Facebook/Instagram
2. Meta ads: targeted ads for events and volunteering opportunities; leads capture contact info; results in calendar adds or text follow-up
3. **Headline stat, prominent, not buried:** registrations at **$2–3 per lead**
4. Monthly reporting to track growth

### How It Works — For Vocation Offices
1. Targeted ads to reach young men considering religious life
2. Lead captures name/phone → automated text conversation initiated (branded honestly as "the vocation director's outreach dashboard, powered by Parish Media Company" — do NOT phrase this as if the priest personally is texting in real time; keep it accurate)
3. Vocation director gets a dashboard to manage all conversations
4. Organic post scripting also available
5. **Headline stat, prominent:** **$2–3 per conversation** with a young man discerning a vocation — frame this as a remarkable, category-defining number

### Additional Services (smaller, secondary block)
- Canva flyer design
- Bulletin design consulting
- One-off bulletin redesigns (Canva, not Publisher)

### Diocese Work
- One line only: "Custom engagement for dioceses — let's talk." Links to Contact. Do not attempt to define scope on-page.

### Testimonials
- **Lead testimonial:** Fr. Nicholas Fleming, Saints John and James Parish, West Warwick, RI
  - Video embed: `https://player.vimeo.com/video/1211528738?h=607f3159d2`
  - Cleaned quote (strip filler words/timestamps):
    > "Before working with Joe, we didn't have an online presence, especially on Instagram, and our bulletin was pretty basic and had never really seen any change. Over the last five months, Joe helped us build an Instagram page from zero to 300 followers, redesigned our bulletin, and trained our staff to use Canva and Meta ads so we can do this on our own. We've already seen new families register, increased engagement with our homilies online, and seen how this platform helps us grow as a parish. I highly recommend Joe for what he's done for our parish, for yours."
  - Pair this testimonial visually with the Saints John and James bulletin before/after images — do not separate them into different sections.

- **Client roster (name/logo wall), 9 ongoing clients:**
  1. Fr. Nicholas Fleming — Saints John and James Parish, West Warwick, RI
  2. Fr. Jared DeLeo — St. Monica's Catholic Church, Palatka, FL
  3. Fr. Dalton Rodgers — St. Joseph's Catholic Church, Los Banos, CA
  4. Fr. Robert Hale — St. Rose Family of Parishes, Springfield, OH
  5. Fr. Dave Aufiero — St. Patrick's Catholic Church, South Hadley, MA
  6. Fr. William Bond — Our Lady of the Saints Family of Parishes, Omaha, NE
  7. Midwest Province Vocation Office — Capuchin Franciscans
  8. Diocese of Reno
  9. UW Oshkosh Newman Center

- **One-off design project (keep separate from ongoing client list):**
  - Fr. Ronald Masilang — St. Brendan's & St. Mary's Parish (bulletin redesign only)

  All 9 clients + 1 project confirmed nameable by Joe. Double-check every name/parish spelling against source material before publishing.

### Visual Proof Assets (already gathered, in project folder)
- Bulletin before/after: St. Brendan's & St. Mary's
- Bulletin before/after: Saints John and James & St. Mary Mission (pair with Fr. Fleming testimonial)
- Bulletin before/after: St. Joseph Parish, Los Banos
- Ad performance screenshot: Meta Ads Manager, showing $2.42 and $2.53 cost-per-lead (use to substantiate the "$2–3/lead" claim directly)

### Contact
- Form fields: Name, Email, "What do you need help with?" (short text or dropdown)
- On submit: send to joe@parishmediacompany.com, then redirect to Calendly booking link (Calendly link TBD — placeholder until Joe confirms account)
- No phone number or street address to be published

---

## 5. Design Direction — "Reverent Modern" (Option A, confirmed)

- **Primary color:** Deep navy `#1B2A4A`
- **Accent color:** Warm gold `#C9A227` (sparing use — dividers, icons, small callouts)
- **Background:** Off-white `#FAF8F4` (not stark white)
- **Headline font:** Fraunces or Lora (serif, warmth + gravity)
- **Body font:** Inter (clean sans-serif, high readability)
- **Overall feel:** Traditional trust cues (navy, gold, serif headlines) carried by modern structure (clean sans body text, generous whitespace, clear CTAs). Should read as credible to a diocese and modern to a younger pastor — not fussy, not sterile.
- **No stock photography.** Use only real client/founder visuals gathered for this project.

---

## 6. Technical Build Notes

- **Stack:** Next.js
- **Hosting/deploy:** Railway
- **Domain:** parishmediacompany.com, registered via Cloudflare — DNS to be pointed at Railway once deployment is live
- **Video embed:** Vimeo, confirmed embeddable (`player.vimeo.com/video/1211528738?h=607f3159d2`)
- **Contact form backend:** needs to send form submissions to joe@parishmediacompany.com and redirect to Calendly on success
- **Mobile-first:** must be fully responsive; verify on an actual device before launch, not just browser resize
- **No client portals or logins in this build** — single marketing site only, per current scope

---

## 7. Open Items Before Launch (not blocking build start)

- [ ] Google Workspace email (joe@parishmediacompany.com) — set up
- [ ] Calendly account confirmed, link ready to insert
- [ ] Final spelling/name check on all 9 clients + 1 project against source materials
- [ ] SSL/HTTPS verification post-deploy (Railway handles, verify)
- [ ] Analytics installation (optional, if desired)

---

## 8. Explicit Scope Boundaries (to keep the build disciplined)

- Single page with anchor navigation — not a multi-page site
- No VSL, no founder biography beyond the short story above
- No client-specific portals or dashboards in this build
- No stock imagery anywhere
