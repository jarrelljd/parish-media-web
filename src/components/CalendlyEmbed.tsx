"use client";

import Script from "next/script";

export default function CalendlyEmbed({ url }: { url: string }) {
  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: "320px", height: "700px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
