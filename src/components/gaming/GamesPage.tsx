"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import gamesData from "@/data/games.json";

const API_BASE = "https://restaurents-api.cylsys.com/api";
const CHECKOUT_URL = "https://app.thedesirelounge.com/checkout";
const COMPANY_ID = "0ffbe39e-abf8-4827-9107-1a04b39f3416";
const BRANCH_ID = "f4fb1d76-83a0-4965-86b5-63da28249dae";

type Game = {
  id: string;
  name: string;
  categoryName: string;
  playersMin: number;
  playersMax: number;
  durationMin: number;
  durationMax: number;
  difficulty: string;
  imagePath: string;
  isAvailable: boolean;
};

type GameType = "playstation" | "board-games";

function endpoint(type: GameType) {
  return type === "playstation"
    ? `${API_BASE}/Playstation/Playstationgamelist`
    : `${API_BASE}/BoardGame/Boardgamelist`;
}

function imageUrl(game: Game) {
  return `https://restaurents-api.cylsys.com/${game.imagePath.replace(/^\/+/, "")}`;
}

export function GamesPage({ type }: { type: GameType }) {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>(gamesData[type] as Game[]);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [query, setQuery] = useState("");
  const companyId = searchParams.get("companyId") || COMPANY_ID;
  const branchId = searchParams.get("branchId") || BRANCH_ID;
  const title = type === "playstation" ? "PlayStation Sessions" : "Board Games";

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ companyId, branchId });
    fetch(`${endpoint(type)}?${params}`, { headers: { Accept: "application/json" }, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Games API returned ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        const records = Array.isArray(payload) ? payload : payload?.data || payload?.items || [];
        if (records.length) setGames(records);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.warn("Games API unavailable; using bundled game list", error);
        setStatus("fallback");
      });
    return () => controller.abort();
  }, [branchId, companyId, type]);

  const visibleGames = useMemo(
    () => games.filter((game) => `${game.name} ${game.categoryName} ${game.difficulty}`.toLowerCase().includes(query.toLowerCase())),
    [games, query],
  );

  function checkout(game: Game) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("companyId", companyId);
    params.set("branchId", branchId);
    params.set("categoryName", type === "playstation" ? "PlayStation" : "Board Games");
    params.set("category", "GAMING");
    params.set("reservationCategory", "GAMING");
    params.set("bookingType", "Gaming Session");
    params.set("sessionType", "Gaming Session");
    params.set("gameId", game.id);
    params.set("gameName", game.name);
    params.set("players", `${game.playersMin}-${game.playersMax}`);
    params.set("duration", `${game.durationMin}-${game.durationMax} min`);
    params.set("difficulty", game.difficulty);
    params.set("reservationTitle", `Gaming: ${game.name}`);
    params.set("moduleId", "3e340f23-d842-47f0-98e8-b0d458dc22dd");
    params.set("extraDetails", JSON.stringify({ id: game.id, name: game.name }));
    params.set("step", "about-you");
    params.set("hideSteps", "true");
    window.location.assign(`${CHECKOUT_URL}?${params}`);
  }

  return (
    <main className="home-container" style={{ paddingBlock: "4rem" }}>
      <p className="home-kicker home-kicker--line-right">Desire Lounge Gaming</p>
      <h1 className="home-heading">{title}</h1>
      <p className="home-copy">Choose a game and reserve your session at the lounge.</p>
      <label style={{ display: "block", maxWidth: 420, margin: "2rem 0" }}>
        <span className="sr-only">Search games</span>
        <input className="form-input" type="search" placeholder="Search games..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {status === "fallback" && <p role="status">Live game list unavailable. Showing the latest available game list.</p>}
      <div className="event-cards" aria-live="polite">
        {visibleGames.map((game) => (
          <article className="event-card" key={game.id}>
            <div className="event-card__media">
              <img src={imageUrl(game)} alt={game.name} width={640} height={400} loading="lazy" />
            </div>
            <div className="event-card__body">
              <h2 className="event-card__title">{game.name}</h2>
              <ul className="event-card__meta">
                <li>{game.categoryName}</li>
                <li>{game.playersMin}-{game.playersMax} players</li>
                <li>{game.durationMin}-{game.durationMax} min</li>
                <li>{game.difficulty}</li>
              </ul>
              <div className="event-card__actions">
                {game.isAvailable ? <button className="event-card__btn event-card__btn--solid" type="button" onClick={() => checkout(game)}>Reserve Session</button> : <span className="event-card__btn event-card__btn--ended">Currently Unavailable</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
