import type { Metadata } from "next";
import BookingAnnouncementBar from "@/components/BookingAnnouncementBar";
import ParishGrowthContent from "@/components/ParishGrowthContent";

export const metadata: Metadata = {
  title: "Social Media | Parish Media Company",
  description:
    "Organic social media content and targeted Meta ads for Catholic parishes and dioceses. See exactly how we grow your reach.",
};

export default function ParishGrowthPage() {
  return (
    <>
      {/* Scale this page to 90% (everything is sized in rem), so it feels
          less zoomed in. Only applies while /parish is mounted. */}
      <style>{`html{font-size:90%}`}</style>
      {/* Landing page: no nav links, just a booking CTA bar so visitors stay focused. */}
      <BookingAnnouncementBar />
      <main className="flex flex-1 flex-col">
        <ParishGrowthContent />
      </main>
    </>
  );
}
