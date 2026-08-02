"use client";

import { createContext, useContext, useState } from "react";
import BookACallModal from "@/components/BookACallModal";

const BookACallModalContext = createContext<(() => void) | null>(null);

export function useBookACallModal() {
  const openModal = useContext(BookACallModalContext);
  if (!openModal) {
    throw new Error(
      "useBookACallModal must be used within BookACallModalProvider",
    );
  }
  return openModal;
}

export default function BookACallModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <BookACallModalContext.Provider value={() => setOpen(true)}>
      {children}
      <BookACallModal open={open} onClose={() => setOpen(false)} />
    </BookACallModalContext.Provider>
  );
}
