import type { Metadata } from "next";
import ScheduleTracker from "@/components/ScheduleTracker";

export const metadata: Metadata = {
  title: "Call Confirmed | Parish Media Company",
  description: "Your call with Parish Media Company is confirmed.",
};

export default function CallConfirmedPage() {
  return (
    <>
      <ScheduleTracker />
      <main className="flex flex-1 flex-col">
        <section className="pb-16 sm:pb-20">
          {/* Navy band behind the headline and the top ~2/3 of the video,
              matching the Parish Growth hero. */}
          <div className="bg-navy px-6 pt-8 sm:pt-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance font-serif text-3xl font-semibold leading-tight text-offwhite sm:text-5xl">
                You&rsquo;re Confirmed!&nbsp;✅
              </h1>
              <p className="mt-3 text-pretty font-semibold text-gold sm:text-lg">
                Your Zoom calendar invitation has been sent to
                your&nbsp;email.
              </p>
              <p className="mt-5 text-balance text-lg text-offwhite/75">
                <strong className="font-semibold text-offwhite">
                  Please watch this entire video before our call.
                </strong>{" "}
                It contains
                important information about how the conversation will work
                and what we&rsquo;ll need from you to make the
                meeting&nbsp;productive.
              </p>
            </div>
          </div>
          <div className="bg-linear-to-b from-navy from-65% to-transparent to-65% px-6 pt-8">
            <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-gold/30">
              <iframe
                src="https://player.vimeo.com/video/1234880550?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Parish Growth"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
