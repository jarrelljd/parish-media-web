import type { Metadata } from "next";
import BookingAnnouncementBar from "@/components/BookingAnnouncementBar";
import VocationsContent from "@/components/VocationsContent";

export const metadata: Metadata = {
  title: "Vocations | Parish Media Company",
  description:
    "Facebook and Instagram outreach that helps more Catholic men reach out to your vocations office about the priesthood and religious life.",
};

export default function VocationsPage() {
  return (
    <>
      {/* Landing page: no nav links, just a booking CTA bar so visitors stay focused. */}
      <BookingAnnouncementBar
        label="Book 30-Min Vocations Outreach Assessment"
        theme="gold"
      />
      <main className="flex flex-1 flex-col">
        <VocationsContent />
      </main>
    </>
  );
}
