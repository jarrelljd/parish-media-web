import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import BookACallModalProvider from "@/components/BookACallModalProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-offwhite text-navy">
        <MetaPixel />
        <BookACallModalProvider>{children}</BookACallModalProvider>
      </body>
    </html>
  );
}
