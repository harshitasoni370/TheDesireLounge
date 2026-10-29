"use client";

import type { MouseEvent, ReactNode } from "react";
import { withBookingDeviceId } from "@/lib/booking";

export function BookingLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  function followBookingLink(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.location.assign(withBookingDeviceId(href));
  }

  return (
    <a href={href} className={className} onClick={followBookingLink}>
      {children}
    </a>
  );
}
