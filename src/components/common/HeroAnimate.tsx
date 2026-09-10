"use client";

import { useEffect, useRef } from "react";

export function HeroAnimate({
  children,
  className,
  bgSelector,
}: {
  children: React.ReactNode;
  className?: string;
  bgSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".hero-anim"));

    if (reduced) {
      items.forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    if (bgSelector) {
      const bg = root.querySelector<HTMLElement>(bgSelector);
      if (bg) {
        bg.animate([{ transform: "scale(1.08)" }, { transform: "scale(1)" }], {
          duration: 2200,
          easing: "cubic-bezier(0.16,1,0.3,1)",
          fill: "forwards",
        });
      }
    }

    items.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: "translateY(28px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 900,
          delay: 250 + i * 130,
          easing: "cubic-bezier(0.22,1,0.36,1)",
          fill: "forwards",
        }
      );
    });
  }, [bgSelector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
