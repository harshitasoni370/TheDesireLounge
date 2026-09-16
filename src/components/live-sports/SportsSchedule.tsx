"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import scheduleData from "@/data/sports-schedule.json";

interface Fixture {
  sport: "football" | "cricket";
  month: string;
  start: string;
  end: string;
  competition: string;
  event: string;
  teams: string;
  venue: string;
  time: string;
  channel: string;
  id?: string;
}

type Status = "live" | "upcoming" | "past";
type EnrichedFixture = Fixture & { status: Status };

const MONTH_ORDER = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(iso: string) {
  const date = parseLocalDate(iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mon = date.toLocaleString("en-GB", { month: "short" });
  return `${dd}-${mon}-${date.getFullYear()}`;
}

function formatDateRange(start: string, end: string) {
  if (start === end) return formatDisplayDate(start);
  return `${formatDisplayDate(start)} \u2013 ${formatDisplayDate(end)}`;
}

function getStatus(start: string, end: string, today: Date): Status {
  const s = parseLocalDate(start);
  const e = parseLocalDate(end);
  e.setHours(23, 59, 59, 999);
  s.setHours(0, 0, 0, 0);
  if (today > e) return "past";
  if (today >= s && today <= e) return "live";
  return "upcoming";
}

function statusLabel(status: Status) {
  if (status === "live") return "Live";
  if (status === "past") return "Past";
  return "Upcoming";
}

function titleCaseMonth(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const REMOTE_API_BASE = "https://restaurents-api.cylsys.com";
/** Dev proxy path — see the `rewrites` block in next.config.ts. Avoids CORS on localhost. */
const DEV_API_BASE = "/live-sports-api";

const LIVE_SPORTS_API = "/api/Livesports/GetLiveSports";
const LIVE_SPORTS_COMPETITIONS_API = "/api/Livesports/GetLiveSportsCompetitions";

/**
 * Called from the effect (not at module scope) so `window` is available.
 * Order: NEXT_PUBLIC_LIVE_SPORTS_BASE -> dev proxy on localhost -> remote.
 */
function getApiBase() {
  const configured = process.env.NEXT_PUBLIC_LIVE_SPORTS_BASE;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)) {
    return DEV_API_BASE;
  }
  return REMOTE_API_BASE;
}
const DEFAULT_COMPANY_ID = "0ffbe39e-abf8-4827-9107-1a04b39f3416";
const DEFAULT_BRANCH_ID = "f4fb1d76-83a0-4965-86b5-63da28249dae";
const MENU_CHECKOUT_URL = "https://app.thedesirelounge.com/checkout";

/* ------------------------------------------------------------------ *
 * Response helpers
 * The API can answer with a bare array, or wrap it in data / result /
 * items / records (any casing), or even return a JSON string. All of
 * those used to end up as an empty list, which is why nothing rendered.
 * ------------------------------------------------------------------ */

type AnyRecord = Record<string, unknown>;

const LIST_KEYS = ["data", "result", "results", "items", "records", "list", "response", "payload", "value"];

function extractList(payload: unknown, depth = 0): AnyRecord[] {
  if (payload == null || depth > 4) return [];

  if (typeof payload === "string") {
    const text = payload.trim();
    if (!text) return [];
    try {
      return extractList(JSON.parse(text), depth + 1);
    } catch {
      return [];
    }
  }

  if (Array.isArray(payload)) {
    return payload.filter((item): item is AnyRecord => typeof item === "object" && item !== null);
  }

  if (typeof payload === "object") {
    const obj = payload as AnyRecord;
    for (const key of Object.keys(obj)) {
      if (LIST_KEYS.includes(key.toLowerCase())) {
        const nested = extractList(obj[key], depth + 1);
        if (nested.length) return nested;
      }
    }
    // Fall back to the first array-ish value on the object.
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        const nested = extractList(value, depth + 1);
        if (nested.length) return nested;
      }
    }
  }

  return [];
}

/** Case-insensitive field lookup, so PascalCase payloads work too. */
function pick(item: AnyRecord, ...names: string[]): string {
  const keys = Object.keys(item);
  for (const name of names) {
    const match = keys.find((key) => key.toLowerCase() === name.toLowerCase());
    if (match) {
      const value = item[match];
      if (value != null && value !== "") return String(value);
    }
  }
  return "";
}

function toDate(value: string | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  // "2026-09-15 00:00:00" / "2026-09-15T00:00:00" / "2026-09-15"
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  // "15/09/2026" or "15-09-2026"
  const dmy = trimmed.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${parsed.getFullYear()}-${mm}-${dd}`;
  }
  return "";
}

function normalizeLiveFixture(item: AnyRecord): Fixture | null {
  const start = toDate(pick(item, "dateStart", "startDate", "date", "eventDate", "matchDate"));
  if (!start) return null;
  const end = toDate(pick(item, "dateEnd", "endDate")) || start;
  const home = pick(item, "teamHome", "homeTeam", "team1");
  const away = pick(item, "teamAway", "awayTeam", "team2");
  const sportValue = pick(item, "sportCategory", "sportCategoryName", "sport", "categoryName").toLowerCase();

  return {
    id: pick(item, "id", "sportId", "liveSportId") || undefined,
    sport: sportValue.includes("football") || sportValue.includes("soccer") ? "football" : "cricket",
    month: new Date(`${start}T12:00:00`).toLocaleString("en-US", { month: "long" }).toLowerCase(),
    start,
    end: end >= start ? end : start,
    competition: pick(item, "competitionName", "competition", "tournamentName") || "Competition TBC",
    event: pick(item, "eventName", "event", "name", "matchName") || "Upcoming fixture",
    teams: `${home || "TBC"} vs ${away || "TBC"}`,
    venue: pick(item, "venue", "venueName", "location") || "Venue TBC",
    time: pick(item, "uaeTime", "time", "matchTime", "startTime") || "TBC",
    channel: pick(item, "channel", "channelName", "broadcast") || "Channel TBC",
  };
}

function normalizeCompetition(item: AnyRecord): string {
  return pick(item, "name", "competitionName", "title");
}

function buildBookingUrl(item: Fixture, context: { companyId: string; branchId: string; sessionId: string; tableId: string }) {
  const details = {
    id: item.id || "",
    name: item.event,
    sportCategory: item.sport,
    competitionName: item.competition,
    teamHome: item.teams.split(" vs ")[0] || "",
    teamAway: item.teams.split(" vs ")[1] || "",
    venue: item.venue,
    dateStart: item.start,
    uaeTime: item.time,
    channel: item.channel,
  };
  const params = new URLSearchParams({
    companyId: context.companyId,
    branchId: context.branchId,
    ...(context.sessionId ? { sessionId: context.sessionId } : {}),
    ...(context.tableId ? { tableId: context.tableId } : {}),
    categoryName: "Live Sports",
    category: "EVENT",
    reservationCategory: "EVENT",
    sessionType: "Live Sports",
    eventName: item.event,
    competitionName: item.competition,
    sportCategory: item.sport,
    teamHome: details.teamHome,
    teamAway: details.teamAway,
    venue: item.venue,
    dateStart: item.start,
    uaeTime: item.time,
    channel: item.channel,
    reservationTitle: item.event,
    extraDetails: JSON.stringify(details),
    step: "about-you",
    hideSteps: "true",
    hideCardIcon: "true",
    hideCurrentSession: "true",
    showCurrentTable: "false",
  });
  return `${MENU_CHECKOUT_URL}?${params.toString()}`;
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * POST first (current API contract); if that is rejected, retry the same
 * endpoint as GET. Never throws for network/CORS failures — it returns null so
 * the UI can fall back to the bundled schedule instead of crashing the page.
 */
async function requestJson(path: string, body: Record<string, string>, signal: AbortSignal): Promise<unknown> {
  const url = `${getApiBase()}${path}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (response.ok) return await response.json();
    console.warn(`Live sports POST ${url} -> ${response.status}; retrying as GET`);
  } catch (error) {
    if (isAbort(error)) throw error;
    console.warn(`Live sports POST ${url} failed (network/CORS); retrying as GET`, error);
  }

  try {
    const query = new URLSearchParams(body).toString();
    const response = await fetch(`${url}?${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
    if (response.ok) return await response.json();
    console.warn(`Live sports GET ${url} -> ${response.status}`);
  } catch (error) {
    if (isAbort(error)) throw error;
    console.warn(`Live sports GET ${url} failed (network/CORS)`, error);
  }

  return null;
}

const LOCAL_FIXTURES = (scheduleData.fixtures as Fixture[]).map((item) => ({
  ...item,
  month: item.month.toLowerCase(),
}));

export function SportsSchedule() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") || DEFAULT_COMPANY_ID;
  const branchId = searchParams.get("branchId") || DEFAULT_BRANCH_ID;
  const sessionId = searchParams.get("sessionId") || searchParams.get("tableSessionId") || "";
  const tableId = searchParams.get("tableId") || "";
  const bookingContext = { companyId, branchId, sessionId, tableId };

  const [apiFixtures, setApiFixtures] = useState<Fixture[] | null>(null);
  const [apiCompetitions, setApiCompetitions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setLoadError(false);

    // Competitions are optional — a failure there must not blank the fixtures.
    requestJson(LIVE_SPORTS_COMPETITIONS_API, { companyId, branchId }, controller.signal)
      .then((payload) => {
        if (!active) return;
        const names = extractList(payload).map(normalizeCompetition).filter(Boolean);
        setApiCompetitions(names);
      })
      .catch(() => {
        /* competition dropdown falls back to the competitions found in fixtures */
      });

    requestJson(LIVE_SPORTS_API, { companyId, branchId, statusFilter: "upcoming" }, controller.signal)
      .then((payload) => {
        if (!active) return;
        const fixtures = extractList(payload)
          .map(normalizeLiveFixture)
          .filter((item): item is Fixture => item !== null);
        // payload === null means the request could not be made at all (CORS/offline).
        setLoadError(payload === null);
        // An empty API list should not wipe the page — keep the bundled list.
        setApiFixtures(fixtures.length ? fixtures : null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (isAbort(error)) return;
        console.error("Live sports API unavailable; using bundled fixtures", error);
        setApiFixtures(null);
        setLoadError(true);
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [companyId, branchId, reloadKey]);

  const retry = useCallback(() => setReloadKey((n) => n + 1), []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  const enriched: EnrichedFixture[] = useMemo(() => {
    const fixtures = (apiFixtures || LOCAL_FIXTURES).slice().sort((a, b) => {
      const byStart = a.start.localeCompare(b.start);
      return byStart !== 0 ? byStart : a.sport.localeCompare(b.sport);
    });
    return fixtures.map((item) => ({ ...item, status: getStatus(item.start, item.end, today) }));
  }, [apiFixtures, today]);

  const competitions = useMemo(() => {
    const fromFixtures = enriched.map((item) => item.competition);
    const source = apiCompetitions.length ? [...apiCompetitions, ...fromFixtures] : fromFixtures;
    return Array.from(new Set(source.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [apiCompetitions, enriched]);

  const monthsPresent = useMemo(
    () =>
      Array.from(new Set(enriched.map((item) => item.month.toLowerCase()))).sort(
        (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
      ),
    [enriched]
  );

  const [sport, setSport] = useState<"all" | "football" | "cricket">("all");
  const [month, setMonth] = useState("all");
  const [status, setStatus] = useState<"active" | "live" | "upcoming" | "all">("active");
  const [competition, setCompetition] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // If the selected competition/month is not in the freshly loaded data, reset it
  // instead of showing an empty grid.
  useEffect(() => {
    if (competition !== "all" && !competitions.includes(competition)) setCompetition("all");
  }, [competitions, competition]);

  useEffect(() => {
    if (month !== "all" && !monthsPresent.includes(month)) setMonth("all");
  }, [monthsPresent, month]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((item) => {
      if (sport !== "all" && item.sport !== sport) return false;
      if (month !== "all" && item.month.toLowerCase() !== month) return false;
      if (competition !== "all" && item.competition !== competition) return false;
      if (status === "active" && item.status === "past") return false;
      if (status === "live" && item.status !== "live") return false;
      if (status === "upcoming" && item.status !== "upcoming") return false;
      if (q) {
        const haystack = [item.competition, item.event, item.teams, item.venue, item.channel, item.sport].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [enriched, sport, month, competition, status, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = filtered.length ? (currentPage - 1) * pageSize : 0;
  const endIdx = Math.min(startIdx + pageSize, filtered.length);
  const pageItems = filtered.slice(startIdx, endIdx);

  const filtersActive = sport !== "all" || month !== "all" || status !== "active" || competition !== "all" || Boolean(query);

  function resetFilters() {
    setSport("all");
    setMonth("all");
    setStatus("active");
    setCompetition("all");
    setQuery("");
    setPage(1);
  }

  function changePage(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }

  const pageButtons = useMemo(() => {
    if (totalPages <= 1) return [];
    const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    const sorted = Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
    const out: (number | "gap")[] = [];
    let last = 0;
    for (const p of sorted) {
      if (last && p - last > 1) out.push("gap");
      out.push(p);
      last = p;
    }
    return out;
  }, [totalPages, currentPage]);

  return (
    <section className="sports-schedule" id="sports-schedule" aria-labelledby="sports-schedule-heading">
      <div className="home-container">
        <div className="sports-schedule__intro">
          <p className="home-kicker home-kicker--line-right">
            Fixture Calendar
            <span className="home-kicker__line" aria-hidden="true" />
          </p>
          <h2 id="sports-schedule-heading" className="home-heading home-heading--split">
            Live &amp; <span className="text-gold">Upcoming</span>
          </h2>
          <div className="home-divider" aria-hidden="true" />
          <p className="home-copy sports-schedule__copy">
            Browse football and cricket fixtures screening at the lounge. Times are UAE-oriented where listed; kick-off
            and broadcast details may update closer to match day.
          </p>
          <p className="sports-schedule__count" aria-live="polite">
            {loading ? "Loading fixtures…" : `${filtered.length} fixture${filtered.length === 1 ? "" : "s"}`}
          </p>
          {loadError && (
            <p className="sports-schedule__count" role="status">
              Live feed unavailable right now — showing our latest saved schedule.{" "}
              <button type="button" className="sports-toolbar__reset" onClick={retry}>
                Retry
              </button>
            </p>
          )}
        </div>

        <div className="sports-filters" role="search" aria-label="Filter fixtures">
          <div className="sports-filters__row sports-filters__row--controls">
            <label className="sports-search">
              <span className="sports-filters__label">Search</span>
              <span className="sports-search__field">
                <svg className="sports-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  className="sports-search__input"
                  placeholder="Teams, competition, venue…"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </span>
            </label>

            <label className="sports-select">
              <span className="sports-filters__label">Competition</span>
              <select
                className="sports-select__control"
                value={competition}
                onChange={(e) => {
                  setCompetition(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All competitions</option>
                {competitions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="sports-select">
              <span className="sports-filters__label">Per page</span>
              <select
                className="sports-select__control"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="sports-filters__group">
            <p className="sports-filters__label">Sport</p>
            <div className="gallery-filters" role="tablist">
              {(["all", "football", "cricket"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`gallery-filters__btn${sport === s ? " is-active" : ""}`}
                  onClick={() => {
                    setSport(s);
                    setPage(1);
                  }}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="sports-filters__group">
            <p className="sports-filters__label">Status</p>
            <div className="gallery-filters" role="tablist">
              {(
                [
                  ["active", "Live & Upcoming"],
                  ["live", "Live Now"],
                  ["upcoming", "Upcoming"],
                  ["all", "All Dates"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`gallery-filters__btn${status === value ? " is-active" : ""}`}
                  onClick={() => {
                    setStatus(value);
                    setPage(1);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="sports-filters__group">
            <p className="sports-filters__label">Month</p>
            <div className="gallery-filters" role="tablist">
              <button type="button" className={`gallery-filters__btn${month === "all" ? " is-active" : ""}`} onClick={() => { setMonth("all"); setPage(1); }}>
                All
              </button>
              {monthsPresent.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`gallery-filters__btn${month === m ? " is-active" : ""}`}
                  onClick={() => {
                    setMonth(m);
                    setPage(1);
                  }}
                >
                  {titleCaseMonth(m)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length > 0 && (
          <div className="sports-toolbar" id="sports-toolbar">
            <p className="sports-toolbar__range" aria-live="polite">
              {`Showing ${filtered.length ? startIdx + 1 : 0}\u2013${endIdx} of ${filtered.length}`}
            </p>
            {filtersActive && (
              <button type="button" className="sports-toolbar__reset" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className="sports-cards" aria-live="polite">
          {pageItems.map((item, i) => (
            <article className="sports-card" data-status={item.status} key={item.id || `${item.competition}-${item.start}-${i}`}>
              <header className="sports-card__head">
                <span className={`sports-card__sport sports-card__sport--${item.sport}`}>
                  {item.sport === "football" ? "Football" : "Cricket"}
                </span>
                <span className={`sports-card__status sports-card__status--${item.status}`}>{statusLabel(item.status)}</span>
              </header>
              <h3 className="sports-card__title">{item.competition}</h3>
              <p className="sports-card__event">{item.event}</p>
              <dl className="sports-card__meta">
                <div>
                  <dt>Dates</dt>
                  <dd>{formatDateRange(item.start, item.end)}</dd>
                </div>
                <div>
                  <dt>Teams</dt>
                  <dd>{item.teams}</dd>
                </div>
                <div>
                  <dt>Venue</dt>
                  <dd>{item.venue}</dd>
                </div>
                <div>
                  <dt>UAE Time</dt>
                  <dd>{item.time}</dd>
                </div>
                <div className="sports-card__meta--wide">
                  <dt>Watch on</dt>
                  <dd>{item.channel}</dd>
                </div>
              </dl>
              <a className="sports-card__book" href={buildBookingUrl(item, bookingContext)}>
                Book a Table
              </a>
            </article>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="sports-empty">No fixtures match these filters. Try another sport or month.</p>
        )}

        <div className="sports-table-wrap" aria-label="Fixtures table">
          <table className="sports-table">
            <caption className="sr-only">Live and upcoming sports fixture list</caption>
            <thead>
              <tr>
                <th scope="col">Sport</th>
                <th scope="col">Date</th>
                <th scope="col">Competition / Event</th>
                <th scope="col">Teams</th>
                <th scope="col">Venue</th>
                <th scope="col">UAE Time</th>
                <th scope="col">Channel</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, i) => (
                <tr className={`sports-table__row sports-table__row--${item.sport}`} key={`row-${item.id || `${item.competition}-${item.start}-${i}`}`}>
                  <td>
                    <span className={`sports-card__sport sports-card__sport--${item.sport}`}>
                      {item.sport === "football" ? "Football" : "Cricket"}
                    </span>
                  </td>
                  <td>
                    <time dateTime={item.start}>{formatDateRange(item.start, item.end)}</time>
                  </td>
                  <td>
                    <strong>{item.competition}</strong>
                    <span className="sports-table__sub">{item.event}</span>
                  </td>
                  <td>{item.teams}</td>
                  <td>{item.venue}</td>
                  <td>{item.time}</td>
                  <td>{item.channel}</td>
                  <td>
                    <span className={`sports-card__status sports-card__status--${item.status}`}>{statusLabel(item.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav className="sports-pagination" aria-label="Fixtures pagination">
            <button type="button" className="sports-pagination__btn" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Prev
            </button>
            <div className="sports-pagination__pages">
              {pageButtons.map((p, i) =>
                p === "gap" ? (
                  <span className="sports-pagination__ellipsis" aria-hidden="true" key={`gap-${i}`}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`sports-pagination__page${p === currentPage ? " is-active" : ""}`}
                    aria-current={p === currentPage ? "page" : undefined}
                    onClick={() => changePage(p)}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
            <button type="button" className="sports-pagination__btn" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}