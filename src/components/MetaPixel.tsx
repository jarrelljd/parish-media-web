"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  // The inline script below already fires PageView for whichever page loads
  // first in a tab. This component lives in the root layout, which persists
  // across client-side navigation (App Router doesn't remount it per route),
  // so without this, every page visited *after* the first one in a session
  // would fire nothing. Skip the very first run (already covered) and fire
  // on every pathname change after that.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!pixelId) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // fbq doesn't read window.location.href fresh per track() call — it sends
    // whatever its own internal URL cache holds, which it only refreshes via
    // its own history.pushState/replaceState interception (installed once at
    // pixel init; confirmed by reading the real fbevents.js source). Next.js's
    // App Router navigation doesn't reliably reach that hook, so without this,
    // every event after the first page load reports the *first* page's URL
    // forever, even though this effect fires fbq('track', ...) on the right
    // page every time. A no-op replaceState (URL unchanged, just re-announced)
    // forces fbq to re-read and re-cache the already-correct current URL
    // before we track — this is the same mechanism Meta's own SPA
    // implementation guide has integrators call themselves before fbq('track').
    if (typeof window.history?.replaceState === "function") {
      window.history.replaceState(window.history.state, "", window.location.href);
    }
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    fbq?.("track", "PageView");
  }, [pathname, pixelId]);

  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
