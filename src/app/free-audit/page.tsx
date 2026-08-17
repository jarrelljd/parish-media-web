import type { Metadata } from "next";
import Nav from "@/components/Nav";
import AuditRequestForm from "@/components/AuditRequestForm";
import AuditCtaButton from "@/components/AuditCtaButton";

export const metadata: Metadata = {
  title: "Free Social Media Audit | Parish Media Company",
  description:
    "Get a free, personal video audit of your parish's Facebook or Instagram page from Joe Jarrell.",
};

export default function FreeAuditPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-6 pb-16 sm:pt-14 sm:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(27,42,74,0.16) 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 640px 420px at 50% 0%, rgba(201,162,39,0.16), transparent 70%)",
            }}
          />

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance font-serif text-3xl font-semibold leading-tight text-navy sm:text-5xl">
              Get a Free Social Media Audit of Your Parish
            </h1>

            <p className="mt-4 text-pretty text-sm text-navy/70 sm:mt-8 sm:text-lg">
              Send us your parish&rsquo;s Facebook or Instagram page and
              I&rsquo;ll personally record a short video reviewing what&rsquo;s
              working, what&rsquo;s not, and what I&rsquo;d change.
            </p>

            <div className="mt-6 sm:mt-10">
              <AuditCtaButton />
              <p className="mt-3 text-sm text-navy/50">
                No cost. No obligation.
              </p>
            </div>
          </div>
        </section>

        {/* Example Audit */}
        <section className="px-6 pb-16 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-balance font-serif text-2xl font-semibold text-navy sm:text-3xl">
                Watch a Sample Audit
              </h2>
            </div>

            <div
              className="relative mt-8 w-full overflow-hidden rounded-2xl shadow-lg"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                src="https://player.vimeo.com/video/1218767664?badge=0&autopause=0&player_id=0&app_id=58479"
                frameBorder={0}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title="Parish Social Media Audit Example"
              />
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="px-6 pb-20 sm:pb-28">
          <div className="mx-auto max-w-2xl">
            <div id="audit-form" className="scroll-mt-24">
              <AuditRequestForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
