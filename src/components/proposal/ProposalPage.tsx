import { Check, Gift, ShieldCheck } from "lucide-react";
import type { Proposal } from "@/data/proposals";
import ProposalActions from "./ProposalActions";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-balance font-serif text-3xl font-medium text-ink sm:text-4xl">{children}</h2>
  );
}

export default function ProposalPage({ p }: { p: Proposal }) {
  return (
    <main className="flex flex-1 flex-col bg-vellum">
      {/* Opening */}
      <section className="bg-ink px-6 pt-10 pb-16 text-vellum sm:pb-24 print:bg-white print:text-ink">
        <p className="mx-auto max-w-4xl font-serif text-lg font-medium">Parish Media Company</p>
        <div className="mx-auto mt-14 max-w-4xl sm:mt-20">
          <p className="font-semibold text-gilt-light print:text-ink/70">
            Prepared for {p.preparedFor} · {p.date}
          </p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium sm:text-6xl">
            A plan for {p.parish}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-vellum/80 sm:text-xl print:text-ink/80">
            {p.intro}
          </p>
          {p.videoId && (
            <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl ring-1 ring-vellum/20 print:hidden">
              <iframe
                src={`https://player.vimeo.com/video/${p.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title={`A message from Joe for ${p.preparedFor}`}
              />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-6">
        {/* What we heard */}
        <section className="py-16 sm:py-20">
          <SectionHeading>What we heard</SectionHeading>
          <ul className="mt-8 space-y-4">
            {p.heard.map((h) => (
              <li key={h} className="flex items-start gap-3 text-lg text-ink/80">
                <Check aria-hidden="true" strokeWidth={2.5} className="mt-1.5 h-4 w-4 shrink-0 text-gold-deep" />
                <span className="text-pretty">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Snapshot */}
        <section className="pb-16 sm:pb-20">
          <SectionHeading>{p.shortName} today</SectionHeading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {p.snapshot.map((s) => (
              <div key={s.label} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5 break-inside-avoid">
                <p className="font-serif text-4xl font-medium text-ink">{s.value}</p>
                <p className="mt-2 text-pretty text-ink/80">{s.label}</p>
                <p className="mt-3 text-sm text-ink/50">{s.source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 90-day plan */}
        <section className="pb-16 sm:pb-20">
          <SectionHeading>The first 90 days</SectionHeading>
          <p className="mt-6 rounded-2xl bg-lapis px-6 py-5 text-pretty text-lg font-semibold text-white print:bg-white print:text-ink print:ring-1 print:ring-ink/20">
            Goal: {p.goal}
          </p>
          <ol className="mt-8 space-y-4">
            {p.plan.map((step) => (
              <li
                key={step.when}
                className="grid gap-2 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5 sm:grid-cols-[8rem_1fr] sm:gap-6 break-inside-avoid"
              >
                <p className="font-semibold text-gold-deep">{step.when}</p>
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 text-pretty text-ink/75">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-pretty text-sm text-ink/60">
            A qualified inquiry is a local adult or family who gives accurate contact information and
            asks about a specific next step with the&nbsp;parish.
          </p>
        </section>

        {/* Responsibilities */}
        <section className="pb-16 sm:pb-20">
          <SectionHeading>Who does what</SectionHeading>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { title: "We handle", items: p.weHandle },
              { title: "The parish provides", items: p.youProvide },
            ].map((col) => (
              <div key={col.title} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5 break-inside-avoid">
                <h3 className="font-serif text-xl font-medium text-ink">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.items.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-ink/80">
                      <Check aria-hidden="true" strokeWidth={2.5} className="mt-1 h-4 w-4 shrink-0 text-lapis" />
                      <span className="text-pretty">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Proof */}
        <section className="pb-16 sm:pb-20">
          <SectionHeading>Results at other parishes</SectionHeading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {p.proof.map((r) => (
              <div key={r.label} className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5 break-inside-avoid">
                <p className="font-serif text-4xl font-medium text-ink">{r.value}</p>
                <p className="mt-2 text-pretty text-ink/80">{r.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-ink/70">
            More results and priest testimonials:{" "}
            <a href="/results" className="font-semibold text-lapis underline underline-offset-4">
              parishmediacompany.com/results
            </a>
          </p>
        </section>

        {/* Investment */}
        <section className="pb-16 sm:pb-20 break-inside-avoid">
          <SectionHeading>Investment</SectionHeading>
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl shadow-ink/5 ring-2 ring-lapis/30 sm:p-10">
            <h3 className="font-serif text-2xl font-medium text-ink">{p.investment.plan}</h3>
            <p className="mt-4 font-serif text-5xl font-medium text-ink">{p.investment.standard.total}</p>
            <p className="mt-1 text-ink/60">{p.investment.standard.billing}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {p.investment.options.map((o) => (
                <div
                  key={o.name}
                  className={`rounded-2xl p-5 ${o.highlight ? "bg-ink text-vellum print:bg-white print:text-ink print:ring-2 print:ring-ink" : "bg-vellum text-ink ring-1 ring-ink/10"}`}
                >
                  <p className={`font-semibold ${o.highlight ? "text-gilt-light print:text-ink" : "text-ink"}`}>{o.name}</p>
                  <p className={`mt-1 text-pretty text-sm ${o.highlight ? "text-vellum/70 print:text-ink/70" : "text-ink/60"}`}>
                    {o.condition}
                  </p>
                  <p className="mt-4 font-serif text-3xl font-medium">{o.total}</p>
                  <p className={`mt-1 text-sm ${o.highlight ? "text-vellum/70 print:text-ink/70" : "text-ink/60"}`}>{o.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm text-ink/60">
              {p.investment.terms.map((t) => (
                <p key={t} className="text-pretty">{t}</p>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5">
              <h3 className="flex items-center gap-2 font-serif text-xl font-medium text-ink">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 text-lapis" />
                30-day guarantee
              </h3>
              <p className="mt-3 text-pretty text-ink/75">{p.guarantee}</p>
            </div>
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5">
              <h3 className="flex items-center gap-2 font-serif text-xl font-medium text-ink">
                <Gift aria-hidden="true" className="h-5 w-5 text-gold-deep" />
                Included at no cost
              </h3>
              <ul className="mt-3 space-y-2">
                {p.bonuses.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-ink/75">
                    <Check aria-hidden="true" strokeWidth={2.5} className="mt-1 h-4 w-4 shrink-0 text-gold-deep" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Next step */}
      <section className="bg-ink px-6 py-16 text-center text-vellum sm:py-20 print:bg-white print:text-ink">
        <h2 className="text-balance font-serif text-3xl font-medium sm:text-4xl">Ready to move forward?</h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-vellum/75 print:text-ink/75">
          Questions first? Call or text {p.contact.name.split(" ")[0]} at{" "}
          <a href={`tel:${p.contact.phone.replace(/\D/g, "")}`} className="font-semibold text-vellum underline underline-offset-4 print:text-ink">
            {p.contact.phone}
          </a>
          .
        </p>
        <div className="mt-10">
          <ProposalActions signUrl={p.signUrl} parish={p.parish} />
        </div>
      </section>
    </main>
  );
}
