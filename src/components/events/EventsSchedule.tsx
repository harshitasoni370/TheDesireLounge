"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EVENTS_API_PROXY_BASE_URL } from "@/lib/site";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getAssetUrl, getDomainUrl, getTodayInTimezone } from "@/lib/site-config";

const API_BASE = `${EVENTS_API_PROXY_BASE_URL}/api`;

interface EventItem {
  category: string;
  month: string;
  start: string;
  end: string;
  title: string;
  description: string;
  guest?: string;
  time: string;
  venue: string;
  offer?: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  features: string[];
}

type Status = "live" | "upcoming" | "past";

interface ApiEventMap {
  uidEventMapId: string;
  dtmStartDatetime: string;
  dtmEndDatetime: string | null;
  strVenue: string;
  strArtistName: string;
  strImagePath: string;
  strEntry: string;
  mapIsActive: boolean;
}

interface ApiEventMaster {
  uidEventMasterId: string;
  eventName: string;
  strDescription: string;
  strEventType: string;
  masterIsActive: boolean;
  events: ApiEventMap[];
}

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(iso: string) {
  const date = parseLocalDate(iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mon = date.toLocaleString("en-GB", { month: "short" });
  return `${dd} ${mon}`;
}

function formatTimeFromDatetime(dtm: string) {
  if (!dtm) return "10:00 PM onwards";
  const t = dtm.split(" ")[1];
  if (!t) return "10:00 PM onwards";
  const [hh, mm] = t.split(":").map(Number);
  if (isNaN(hh) || isNaN(mm)) return "10:00 PM onwards";
  const suffix = hh >= 12 ? "PM" : "AM";
  const hour12 = ((hh + 11) % 12) + 1;
  return `${String(hour12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${suffix} onwards`;
}

function dateOnlyFromDatetime(dtm: string | null): string {
  if (!dtm) return "";
  const d = dtm.split(" ")[0];
  return d || "";
}

function getStatus(start: string, end: string, today: Date): Status {
  const s = parseLocalDate(start);
  const e = end ? parseLocalDate(end) : parseLocalDate(start);
  e.setHours(23, 59, 59, 999);
  s.setHours(0, 0, 0, 0);
  if (today > e) return "past";
  if (today >= s && today <= e) return "live";
  return "upcoming";
}

function statusRank(status: Status) {
  if (status === "live") return 0;
  if (status === "upcoming") return 1;
  return 2;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function resolveEventImage(apiImagePath: string, site: ReturnType<typeof useSiteConfig>) {
  if (apiImagePath && apiImagePath.trim()) {
    return { src: getAssetUrl(apiImagePath, site), width: 1024, height: 1024 };
  }
  return { src: "", width: 1024, height: 1024 };
}

function mapApiToEventItem(master: ApiEventMaster, map: ApiEventMap, site: ReturnType<typeof useSiteConfig>): EventItem {
  const start = dateOnlyFromDatetime(map.dtmStartDatetime);
  const end = dateOnlyFromDatetime(map.dtmEndDatetime) || start;
  const startDate = parseLocalDate(start);
  const month = startDate.toLocaleString("en-GB", { month: "long" });
  const image = resolveEventImage(map.strImagePath, site);
  return {
    category: slugify(master.strEventType || master.eventName),
    month,
    start,
    end,
    title: master.eventName,
    description: (master.strDescription || "").replace(/Fumes\s*&\s*Flavours/gi, site.siteName),
    guest: map.strArtistName || undefined,
    time: formatTimeFromDatetime(map.dtmStartDatetime),
    venue: map.strVenue || site.branchName,
    offer: map.strEntry || undefined,
    image: image.src,
    imageAlt: `${master.eventName} event at ${site.siteName}`,
    imageWidth: image.width,
    imageHeight: image.height,
    features: [],
  };
}

export function EventsSchedule() {
  const site = useSiteConfig();
  const searchParams = useSearchParams();
  const bookingContext = {
    companyId: searchParams.get("companyId") || site.companyId,
    branchId: searchParams.get("branchId") || site.branchId,
    sessionId: searchParams.get("sessionId") || searchParams.get("tableSessionId") || "",
    tableId: searchParams.get("tableId") || "",
  };
  const requestKey = `${bookingContext.companyId}:${bookingContext.branchId}`;
  const [eventResponse, setEventResponse] = useState<{
    key: string;
    items: EventItem[];
    error: Error | null;
  }>({ key: "", items: [], error: null });
  const loading = eventResponse.key !== requestKey;
  const items = useMemo(() => (loading ? [] : eventResponse.items), [eventResponse.items, loading]);
  const status = loading ? "loading" : eventResponse.error ? "fallback" : "ready";
  const today = useMemo(() => getTodayInTimezone(site.timezone), [site.timezone]);
  const appUrl = getDomainUrl(site, "APP");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      companyId: bookingContext.companyId,
      branchId: bookingContext.branchId,
    });
    fetch(`${API_BASE}/Event/GetEvents?${params}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Events API returned ${response.status}.`);
        return response.json() as Promise<unknown>;
      })
      .then((payload) => {
        let records: ApiEventMaster[];
        if (Array.isArray(payload)) {
          records = payload as ApiEventMaster[];
        } else if (typeof payload === "object" && payload !== null && "data" in payload && Array.isArray(payload.data)) {
          records = payload.data as ApiEventMaster[];
        } else if (typeof payload === "object" && payload !== null && "items" in payload && Array.isArray(payload.items)) {
          records = payload.items as ApiEventMaster[];
        } else {
          throw new Error("Events API returned an unsupported response format.");
        }

        const mapped: EventItem[] = [];
        for (const master of records) {
          if (!master.masterIsActive) continue;
          const schedules = (master.events || []).filter((event) => event.mapIsActive);
          for (const schedule of schedules) {
            mapped.push(mapApiToEventItem(master, schedule, site));
          }
        }
        setEventResponse({ key: requestKey, items: mapped, error: null });
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        const error = reason instanceof Error ? reason : new Error(String(reason));
        console.error("Events API unavailable.", error);
        setEventResponse({ key: requestKey, items: [], error });
      });
    return () => controller.abort();
  }, [bookingContext.branchId, bookingContext.companyId, requestKey, site]);

  const events = useMemo(() => {
    const withStatus = items.map((item) => ({
      item,
      status: getStatus(item.start, item.end, today),
    }));
    return withStatus.sort((a, b) => {
      const byStatus = statusRank(a.status) - statusRank(b.status);
      if (byStatus !== 0) return byStatus;
      if (a.status === "past") return b.item.start.localeCompare(a.item.start);
      const byStart = a.item.start.localeCompare(b.item.start);
      if (byStart !== 0) return byStart;
      return a.item.category.localeCompare(b.item.category);
    });
  }, [items, today]);

  return (
    <section className="sports-schedule" id="events-schedule" aria-labelledby="events-schedule-heading">
      <div className="home-container">
        <div className="sports-schedule__intro">
          <p className="home-kicker home-kicker--line-right">
            Event Calendar
            <span className="home-kicker__line" aria-hidden="true" />
          </p>
          <h2 id="events-schedule-heading" className="home-heading home-heading--split">
            Live, Upcoming &amp; <span className="text-gold">Past</span>
          </h2>
          <div className="home-divider" aria-hidden="true" />
          <p className="home-copy sports-schedule__copy">
            Browse current nights and previous performances at the lounge. Times may update closer to the event date.
          </p>
        </div>

        {status === "fallback" && (
          <p role="status" className="home-copy" style={{ marginTop: "1rem", color: "#b8860b" }}>
            Live event schedule unavailable. Please try again later.
          </p>
        )}
        {status === "loading" ? (
          <p className="sports-empty" role="status">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="sports-empty">No events scheduled right now. Please check back shortly.</p>
        ) : (
          <div className="event-cards" aria-live="polite">
            {events.map(({ item, status }) => {
              const isPast = status === "past";
              const badgeLabel = status === "live" ? "Live" : isPast ? "Past" : "Upcoming";
              const eventDetails = {
                id: `${item.category}-${item.start}`,
                name: item.title,
                guest: item.guest || "",
                dateStart: item.start,
                dateEnd: item.end,
                time: item.time,
                venue: item.venue,
                offer: item.offer || "",
                description: item.description,
              };
              const eventParams = new URLSearchParams({
                companyId: bookingContext.companyId,
                branchId: bookingContext.branchId,
                ...(bookingContext.sessionId ? { sessionId: bookingContext.sessionId } : {}),
                ...(bookingContext.tableId ? { tableId: bookingContext.tableId } : {}),
                categoryName: "Events",
                category: "EVENT",
                reservationCategory: "EVENT",
                eventName: item.title,
                bookingType: "Event",
                sessionType: "Event",
                reservationTitle: item.title,
                dateStart: item.start,
                uaeTime: item.time,
                extraDetails: JSON.stringify(eventDetails),
                step: "about-you",
                hideSteps: "true",
                hideCardIcon: "true",
              });
              const checkoutHref = appUrl ? `${appUrl}/checkout?${eventParams.toString()}` : "";
              return (
                <article className={`event-card${isPast ? " event-card--past" : ""}`} key={item.title + item.start}>
                  {item.image && (
                    <div className="event-card__media">
                      <span className={`event-card__badge event-card__badge--${status}`}>{badgeLabel}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        width={item.imageWidth || 1024}
                        height={item.imageHeight || 1024}
                        loading="lazy"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </div>
                  )}
                  <div className="event-card__body">
                    <h3 className="event-card__title">{item.title}</h3>
                    <ul className="event-card__meta">
                      {item.guest && (
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>Artist: {item.guest}</span>
                        </li>
                      )}
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        <span>Date: {formatDisplayDate(item.start)}</span>
                      </li>
                      <li>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                        <span>Time: {item.time}</span>
                      </li>
                      {item.offer && (
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M12 2l2.5 7h7l-5.5 4.2 2.1 6.8L12 16.5 5.9 20l2.1-6.8L2.5 9h7L12 2z" />
                          </svg>
                          <span>Entry: {/free/i.test(item.offer) ? "Free" : item.offer}</span>
                        </li>
                      )}
                    </ul>
                    <div className="event-card__actions">
                      {isPast ? (
                        <span className="event-card__btn event-card__btn--ended">Event Ended</span>
                      ) : appUrl ? (
                        <a href={checkoutHref} className="event-card__btn event-card__btn--solid">
                          Book Event
                        </a>
                      ) : (
                        <span className="event-card__btn event-card__btn--ended">Booking unavailable</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
