import type { Metadata } from "next";
import BookingAnnouncementBar from "@/components/BookingAnnouncementBar";
import MonthlyGivingContent from "@/components/MonthlyGivingContent";

export const metadata: Metadata = {
  title: "The Parish $10K Monthly Giving Campaign | Parish Media Company",
  description:
    "A 90-day funding campaign that helps Catholic parishes add $10,000 in new monthly giving, with professionally filmed video, a dedicated giving page, and targeted Meta ads.",
};

export default function MonthlyGivingPage() {
  return (
    <>
      {/* Same 90% scale as /parish (everything is sized in rem). */}
      <style>{`html{font-size:90%}`}</style>
      {/* Landing page: no nav links, just a booking CTA bar. */}
      <BookingAnnouncementBar tone="lapis" label="Book a free demo for your parish" />
      <main className="flex flex-1 flex-col">
        <MonthlyGivingContent />
      </main>
    </>
  );
}
