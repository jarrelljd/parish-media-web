import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Call Confirmed | Parish Media Company",
  description: "Your call with Parish Media Company is confirmed.",
};

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-navy/80">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold"
        aria-hidden="true"
      >
        &#10003;
      </span>
      <span className="text-pretty">{children}</span>
    </li>
  );
}

export default function CallConfirmedPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto block h-1 w-16 rounded-full bg-gold" />
            <h1 className="mt-8 text-balance font-serif text-3xl font-semibold text-navy sm:text-4xl">
              You&rsquo;re All Set!
            </h1>
            <p className="mt-4 text-pretty text-lg text-navy/70">
              A few quick things before we talk:
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
            <ul className="space-y-3">
              <CheckItem>
                Please join from a laptop or desktop computer, not your
                phone, so we can share screens if helpful.
              </CheckItem>
              <CheckItem>
                This is just a conversation. You won&rsquo;t be asked to
                commit to anything on the call.
              </CheckItem>
              <CheckItem>
                If you need to cancel or reschedule, please let us know as
                soon as you can.
              </CheckItem>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
