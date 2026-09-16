import { Suspense } from "react";
import { GamesPage } from "@/components/gaming/GamesPage";

export default function BoardGamesPage() {
  return <Suspense fallback={<main className="home-container" style={{ paddingBlock: "4rem" }}>Loading board games...</main>}><GamesPage type="board-games" /></Suspense>;
}
