"use client";

import { useEffect, useState } from "react";
import { GREETING_FALLBACK as FALLBACK, greetingFor } from "@/lib/greeting";

// Set by FreeGuideForm right before it redirects to /free-guide/free-consult.
export const LEAD_NAME_KEY = "pmc_lead_name";

export default function LetterGreeting() {
  const [name, setName] = useState(FALLBACK);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(LEAD_NAME_KEY);
      if (saved) setName(greetingFor(saved.slice(0, 80)));
    } catch {
      // Storage blocked (private mode etc.): keep the fallback.
    }
  }, []);

  return <p>Dear {name},</p>;
}
