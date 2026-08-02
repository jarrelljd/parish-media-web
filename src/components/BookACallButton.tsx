"use client";

import { useBookACallModal } from "@/components/BookACallModalProvider";

export default function BookACallButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const openBookACall = useBookACallModal();

  return (
    <button type="button" onClick={openBookACall} className={className}>
      {children}
    </button>
  );
}
