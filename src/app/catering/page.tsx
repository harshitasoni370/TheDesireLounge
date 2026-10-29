import type { Metadata } from "next";
import { CateringContent } from "@/components/catering/CateringContent";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Catering by DESIRE SHEESHA LOUNGE, Oud Metha, Dubai — multi-cuisine platters and live-counter spreads for parties, corporate events and private celebrations.",
  alternates: { canonical: "/catering" },
};

export default function CateringPage() {
  return <CateringContent />;
}
