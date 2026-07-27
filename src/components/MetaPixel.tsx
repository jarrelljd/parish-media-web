"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();

  // Every page-view event (tracked as the standard "ViewContent" event, not
  // "PageView" — see the fbq('track', ...) call below; including the very
  // first one on a page, not just subsequent client-side navigations) has to
  // go through this effect rather
  // than firing directly in the inline bootstrap script below. Reason,
  // confirmed by reading the real fbevents.js source: fbq does NOT read
  // window.location.href fresh per track() call. It sends whatever its own
  // internal "compared URL" cache holds, and a plain fbq('track', ...) call
  // does not get that cache refreshed automatically — only fbq's own
  // history.pushState/replaceState interception hook refreshes it (the same
  // mechanism Meta's own SPA implementation guide has integrators trigger
  // manually before fbq('track', ...)). That hook only exists once the real
  // fbevents.js has loaded and taken over from the placeholder stub (fbq
  // itself is present immediately, but calls just queue until then) — so we
  // wait for fbq.callMethod to exist (the real library sets this; the stub
  // never does) before nudging the cache and tracking. Without the wait, an
  // immediate track() call on page load reports a stale/default URL instead
  // of the actual current page — which is exactly what shipped originally
  // and still didn't fix a fresh first-load reporting the wrong URL.
  useEffect(() => {
    if (!pixelId) return;
    let cancelled = false;

    const fireWhenReady = () => {
      if (cancelled) return;
      const fbq = (
        window as unknown as {
          fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown };
        }
      ).fbq;
      if (!fbq || !fbq.callMethod) {
        setTimeout(fireWhenReady, 100);
        return;
      }
      if (typeof window.history?.replaceState === "function") {
        window.history.replaceState(window.history.state, "", window.location.href);
      }
      fbq("track", "ViewContent");
    };

    fireWhenReady();
    return () => {
      cancelled = true;
    };
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
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=ViewContent&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
