import Image from "next/image";
import founderPhoto from "../../public/images/founder/joe-founder-photo.png";

export default function About() {
  return (
    <section id="about" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
          <h2 className="mt-8 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            About
          </h2>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={founderPhoto}
              alt="Joe Jarrell, founder of Parish Media Company"
              className="h-auto w-full"
              priority
            />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-navy">
              Joe Jarrell
            </h3>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-gold">
              Founder, Parish Media Company
            </p>
            <p className="mt-6 text-navy/80">
              Joe spent three years building an online following and running
              a fitness program for Catholic men — working with over 200
              men, including 20 priests. Along the way, he felt called to
              something bigger: helping parishes reach the people who need
              them most. In early 2026, he went all-in and founded Parish
              Media Company.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
