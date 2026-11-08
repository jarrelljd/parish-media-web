"use client";

import { useSyncExternalStore } from "react";

// Today's date for the top of the free-guide letter. Read on the client so
// it's the reader's date, not the date the page was built; blank on the server.
const noop = () => () => {};
const today = () =>
  new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function LetterDate({ className }: { className?: string }) {
  const date = useSyncExternalStore(noop, today, () => "");
  return <p className={className}>{date || " "}</p>;
}
