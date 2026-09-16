import { Suspense } from "react";
import { GamesPage } from "@/components/gaming/GamesPage";

export default function PlayStationPage() {
  return <Suspense fallback={<main className="home-container" style={{ paddingBlock: "4rem" }}>Loading PlayStation games...</main>}><GamesPage type="playstation" /></Suspense>;
}
