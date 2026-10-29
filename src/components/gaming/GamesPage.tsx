"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBookingCheckoutUrl, withBookingDeviceId } from "@/lib/booking";
import { RESTAURANT_API_BASE_URL, RESTAURANT_API_ENDPOINTS } from "@/lib/site";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getAssetUrl } from "@/lib/site-config";

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
  const path = type === "playstation" ? RESTAURANT_API_ENDPOINTS.playstationGames : RESTAURANT_API_ENDPOINTS.boardGames;
  return `${RESTAURANT_API_BASE_URL}${path}`;
}

function imageUrl(game: Game, site: ReturnType<typeof useSiteConfig>) {
  return getAssetUrl(game.imagePath, site);
}

export function GamesPage({ type }: { type: GameType }) {
  const site = useSiteConfig();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const companyId = searchParams.get("companyId") || searchParams.get("cid") || site.companyId;
  const branchId = searchParams.get("branchId") || searchParams.get("bid") || site.branchId;
  const sessionId = searchParams.get("sessionId") || searchParams.get("tableSessionId") || searchParams.get("sid") || "";
  const tableId = searchParams.get("tableId") || searchParams.get("tid") || "";
  const tableNumber = searchParams.get("tableNumber") || searchParams.get("tableNo") || searchParams.get("tn") || "";
  const title = type === "playstation" ? "PlayStation Sessions" : "Board Games";
  const bookingUrl = getBookingCheckoutUrl(site);
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
    const extraParams = Object.fromEntries(
      [...searchParams.entries()].filter(
        ([key]) =>
          ![
            "cid", "companyId", "bid", "branchId", "tid", "tableId", "tn", "tableNumber", "tableNo", "tableCode",
            "sid", "sessionId", "tableSessionId", "mid", "moduleId", "cat", "rc", "rt", "bt", "s", "hs", "hc",
            "did", "deviceId",
          ].includes(key),
      ),
    );
    const checkoutUrl = getBookingCheckoutUrl(site, {
      companyId,
      branchId,
      moduleId: "3e340f23-d842-47f0-98e8-b0d458dc22dd",
      category: "GAMING",
      reservationCategory: "GAMING",
      categoryName: type === "playstation" ? "PlayStation" : "Board Games",
      reservationTitle: `Gaming: ${game.name}`,
      bookingType: "Gaming Session",
      sessionId,
      tableId,
      tableNumber,
      extraParams: {
        ...extraParams,
        gameId: game.id,
        gameName: game.name,
        players: `${game.playersMin}-${game.playersMax}`,
        duration: `${game.durationMin}-${game.durationMax} min`,
        difficulty: game.difficulty,
        extraDetails: JSON.stringify({ id: game.id, name: game.name }),
      },
    });
    if (checkoutUrl) window.location.assign(withBookingDeviceId(checkoutUrl));
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
                {game.isAvailable && bookingUrl ? <button className="event-card__btn event-card__btn--solid" type="button" onClick={() => checkout(game)}>Reserve Session</button> : <span className="event-card__btn event-card__btn--ended">{game.isAvailable ? "Booking unavailable" : "Currently Unavailable"}</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
