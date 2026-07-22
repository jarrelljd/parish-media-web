import Nav from "@/components/Nav";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex flex-1 flex-col">
        <section
          id="home"
          className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32"
        >
          <span className="h-1 w-16 rounded-full bg-gold" />
          <h1 className="mt-8 font-serif text-4xl font-semibold leading-tight text-navy sm:text-5xl md:text-6xl">
            Grow Your Parish&rsquo;s Reach Through Social Media and Targeted
            Ads
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy/70 sm:text-xl">
            We turn your homilies and events into content that reaches new
            families online — without filling up the pastor&rsquo;s calendar.
          </p>
          <a
            href="#contact"
            className="mt-10 rounded-full bg-navy px-8 py-3.5 text-base font-medium text-offwhite transition-colors hover:bg-navy/90"
          >
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="mt-6 text-sm font-medium text-navy/60 underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-navy"
          >
            We also help vocation offices reach young men discerning a call →
          </a>
        </section>

        <HowItWorks />
        <Testimonials />
        <About />
        <Contact />
      </main>
    </>
  );
}
