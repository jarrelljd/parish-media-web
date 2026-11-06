import type { Metadata } from "next";
import { EB_Garamond, Fraunces, Source_Sans_3 } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import BookACallModalProvider from "@/components/BookACallModalProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parishmediacompany.com"),
  title: "Parish Media Company | Social Media & Ad Growth for Catholic Parishes",
  description:
    "Parish Media Company helps Catholic parishes, dioceses, and vocation offices grow real engagement through organic social media and targeted Meta ads, without adding to the pastor's workload.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${garamond.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-vellum text-ink">
        <MetaPixel />
        <BookACallModalProvider>{children}</BookACallModalProvider>
      </body>
    </html>
  );
}
