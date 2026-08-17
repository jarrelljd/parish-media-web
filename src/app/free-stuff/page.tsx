import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import bookCover from "../../../public/images/free-guide/book-cover.jpg";
import auditThumbnail from "../../../public/images/Social-Media-Audit.png";

export const metadata: Metadata = {
  title: "Free Stuff | Parish Media Company",
  description:
    "Free resources for Catholic parishes: books and courses on growing your parish through social media.",
};

export default function FreeStuffPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
            <h1 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
              Free Stuff
            </h1>
            <p className="mt-4 text-lg text-navy/70">
              Resources for growing your parish&rsquo;s reach, built
              specifically for Catholic parish life.
            </p>
          </div>

          {/* Books */}
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="font-serif text-2xl font-semibold text-navy">
              Books
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/free-guide"
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-navy/5 p-6">
                  <div className="w-28 overflow-hidden rounded-lg shadow-md transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={bookCover}
                      alt="Social Media for Catholic Churches book cover"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-lg font-semibold text-navy">
                    Social Media for Catholic Churches
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-navy/70">
                    A practical, Catholic-specific guide to Parish
                    Facebook &amp; Instagram. Free for parish, diocese, and
                    religious order staff.
                  </p>
                  <span className="mt-4 text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 group-hover:text-navy/80">
                    Get the Book →
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Audits */}
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="font-serif text-2xl font-semibold text-navy">
              Audits
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/free-audit"
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-navy/5">
                  <Image
                    src={auditThumbnail}
                    alt="Free Social Media Audit"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-lg font-semibold text-navy">
                    Free Social Media Audit
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-navy/70">
                    Send us your parish&rsquo;s Facebook or Instagram page
                    and get a personal 5&ndash;10 minute video review.
                  </p>
                  <span className="mt-4 text-sm font-medium text-navy underline decoration-gold decoration-2 underline-offset-4 group-hover:text-navy/80">
                    Request Your Audit →
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="font-serif text-2xl font-semibold text-navy">
              Courses
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white/60 shadow-sm">
                <div className="flex aspect-[4/3] items-center justify-center bg-navy/5">
                  <span className="text-4xl" aria-hidden="true">
                    🎓
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="inline-block w-fit rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
                    Coming Soon
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-navy">
                    The Parish Social Media Course (Working Title)
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-navy/70">
                    A deeper, hands-on course for parish teams ready to
                    build their own social media system. Details coming
                    soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
