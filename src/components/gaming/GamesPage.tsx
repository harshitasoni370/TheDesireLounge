"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RESTAURANT_API_PROXY_BASE_URL } from "@/lib/site";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getAssetUrl, getDomainUrl } from "@/lib/site-config";

const API_BASE = `${RESTAURANT_API_PROXY_BASE_URL}/api`;

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

function imageUrl(game: Game, site: ReturnType<typeof useSiteConfig>) {
  return getAssetUrl(game.imagePath, site);
}

export function GamesPage({ type }: { type: GameType }) {
  const site = useSiteConfig();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const companyId = searchParams.get("companyId") || site.companyId;
  const branchId = searchParams.get("branchId") || site.branchId;
  const title = type === "playstation" ? "PlayStation Sessions" : "Board Games";
  const appUrl = getDomainUrl(site, "APP");
  const requestKey = `${companyId}:${branchId}:${type}`;
  const [gameResponse, setGameResponse] = useState<{
    key: string;
    games: Game[];
    error: Error | null;
  }>({ key: "", games: [], error: null });
  const loading = gameResponse.key !== requestKey;
  const games = useMemo(() => (loading ? [] : gameResponse.games), [gameResponse.games, loading]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ companyId, branchId });
    fetch(`${endpoint(type)}?${params}`, { headers: { Accept: "application/json" }, signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Games API returned ${response.status}.`);
        return response.json();
      })
      .then((payload: unknown) => {
        const records =
          Array.isArray(payload)
            ? payload
            : typeof payload === "object" && payload !== null && "data" in payload && Array.isArray(payload.data)
              ? payload.data
              : typeof payload === "object" && payload !== null && "items" in payload && Array.isArray(payload.items)
                ? payload.items
                : [];
        setGameResponse({ key: requestKey, games: records as Game[], error: null });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        const cause = error instanceof Error ? error : new Error(String(error));
        console.error("Games API unavailable.", cause);
        setGameResponse({ key: requestKey, games: [], error: cause });
      });
    return () => controller.abort();
  }, [branchId, companyId, requestKey, type]);

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
    if (appUrl) window.location.assign(`${appUrl}/checkout?${params}`);
  }

  return (
    <main className="home-container" style={{ paddingBlock: "4rem" }}>
      <p className="home-kicker home-kicker--line-right">{site.siteName} Gaming</p>
      <h1 className="home-heading">{title}</h1>
      <p className="home-copy">Choose a game and reserve your session at {site.branchName || site.siteName}.</p>
      <label style={{ display: "block", maxWidth: 420, margin: "2rem 0" }}>
        <span className="sr-only">Search games</span>
        <input className="form-input" type="search" placeholder="Search games..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {loading && <p role="status">Loading games…</p>}
      {gameResponse.key === requestKey && gameResponse.error && (
        <p role="alert">The game list is currently unavailable. Please try again later.</p>
      )}
      {!loading && !gameResponse.error && games.length === 0 && (
        <p role="status">No games are currently listed for this location.</p>
      )}
      {!loading && games.length > 0 && visibleGames.length === 0 && (
        <p role="status">No games match your search.</p>
      )}
      <div className="event-cards" aria-live="polite">
        {visibleGames.map((game) => (
          <article className="event-card" key={game.id}>
            <div className="event-card__media">
              <img src={imageUrl(game, site)} alt={game.name} width={640} height={400} loading="lazy" />
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
                {game.isAvailable && appUrl ? <button className="event-card__btn event-card__btn--solid" type="button" onClick={() => checkout(game)}>Reserve Session</button> : <span className="event-card__btn event-card__btn--ended">{game.isAvailable ? "Booking unavailable" : "Currently Unavailable"}</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
