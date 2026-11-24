import type { Metadata } from "next";
import BookingAnnouncementBar from "@/components/BookingAnnouncementBar";
import FreeWebsiteContent from "@/components/free-website/FreeWebsiteContent";

export const metadata: Metadata = {
  title: "Free Parish Website Redesign | Parish Media Company",
  description:
    "Send us your parish's current website. In 3 business days you'll get a brand new, live website you can click through, free and with no obligation.",
};

export default function FreeWebsitePage() {
  return (
    <>
      {/* Same 90% scale as /parish (everything is sized in rem). */}
      <style>{`html{font-size:90%}`}</style>
      {/* Landing page: no nav links, just a bar whose button scrolls to the form. */}
      <BookingAnnouncementBar label="Get your free redesign" mobileLabel="Get started" />
      <main className="flex flex-1 flex-col">
        <FreeWebsiteContent />
      </main>
    </>
  );
}
