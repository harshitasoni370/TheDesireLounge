"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import eventsData from "@/data/events-schedule.json";
const MENU_CHECKOUT_URL = "https://app.thedesirelounge.com/checkout";
const API_BASE = "https://fumesandflavoursapi.cylsysuat.com/api";
const DEFAULT_COMPANY_ID = "0ffbe39e-abf8-4827-9107-1a04b39f3416";
const DEFAULT_BRANCH_ID = "f4fb1d76-83a0-4965-86b5-63da28249dae";

const LOCAL_EVENT_IMAGES: Record<string, { file: string; w: number; h: number }> = {
  "janan band live": { file: "janan-band-live.webp", w: 682, h: 1024 },
  "janaam band live": { file: "janan-band-live.webp", w: 682, h: 1024 },
  "janaan band live": { file: "janan-band-live.webp", w: 682, h: 1024 },
  "sufi night": { file: "sufi-night.webp", w: 1024, h: 1024 },
  "live music night": { file: "live-music-night.webp", w: 1024, h: 1536 },
};

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

function resolveEventImage(eventName: string, apiImagePath: string) {
  const key = eventName.trim().toLowerCase();
  const local = LOCAL_EVENT_IMAGES[key];
  if (local) {
    return {
      src: `/images/events/${local.file}`,
      width: local.w,
      height: local.h,
      isLocal: true,
    };
  }
  if (apiImagePath && apiImagePath.trim()) {
    const prefix = apiImagePath.startsWith("http")
      ? apiImagePath
      : `${API_BASE.replace(/\/api$/, "")}/${apiImagePath.replace(/^\/+/, "")}`;
    return { src: prefix, width: 1024, height: 1024, isLocal: false };
  }
  return {
    src: `/images/events/sufi-night.webp`,
    width: 1024,
    height: 1024,
    isLocal: true,
  };
}

function mapApiToEventItem(master: ApiEventMaster, map: ApiEventMap): EventItem {
  const start = dateOnlyFromDatetime(map.dtmStartDatetime);
  const end = dateOnlyFromDatetime(map.dtmEndDatetime) || start;
  const startDate = parseLocalDate(start);
  const month = startDate.toLocaleString("en-GB", { month: "long" });
  const image = resolveEventImage(master.eventName, map.strImagePath);
  return {
    category: slugify(master.strEventType || master.eventName),
    month,
    start,
    end,
    title: master.eventName,
    description: master.strDescription || "",
    guest: map.strArtistName || undefined,
    time: formatTimeFromDatetime(map.dtmStartDatetime),
    venue: map.strVenue || "Main Lounge",
    offer: map.strEntry || undefined,
    image: image.src,
    imageAlt: `${master.eventName} event at DESIRE SHEESHA LOUNGE`,
    imageWidth: image.width,
    imageHeight: image.height,
    features: [],
  };
}

export function EventsSchedule() {
  const searchParams = useSearchParams();
  const bookingContext = {
    companyId: searchParams.get("companyId") || DEFAULT_COMPANY_ID,
    branchId: searchParams.get("branchId") || DEFAULT_BRANCH_ID,
    sessionId: searchParams.get("sessionId") || searchParams.get("tableSessionId") || "",
    tableId: searchParams.get("tableId") || "",
  };
  const [items, setItems] = useState<EventItem[]>(eventsData.events as EventItem[]);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const today = useMemo<Date>(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

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
        if (!response.ok) throw new Error(`Events API returned ${response.status}`);
        return response.json();
      })
      .then((payload: unknown) => {
        let records: ApiEventMaster[] = [];
        if (Array.isArray(payload)) {
          records = payload as ApiEventMaster[];
        } else if (payload && typeof payload === "object") {
          const obj = payload as Record<string, unknown>;
          if (Array.isArray(obj.data)) records = obj.data as ApiEventMaster[];
          else if (Array.isArray(obj.items)) records = obj.items as ApiEventMaster[];
        }
        const mapped: EventItem[] = [];
        for (const master of records) {
          if (!master.masterIsActive) continue;
          const schedules = (master.events || []).filter((m) => m.mapIsActive);
          if (schedules.length === 0) {
            const fallbackMap: ApiEventMap = {
              uidEventMapId: "",
              dtmStartDatetime: "2026-08-14 22:00:00",
              dtmEndDatetime: null,
              strVenue: "",
              strArtistName: "",
              strImagePath: "",
              strEntry: "Free",
              mapIsActive: true,
            };
            mapped.push(mapApiToEventItem(master, fallbackMap));
            continue;
          }
          for (const schedule of schedules) {
            mapped.push(mapApiToEventItem(master, schedule));
          }
        }
        if (mapped.length > 0) setItems(mapped);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.warn("Events API unavailable; using bundled event list", error);
        setStatus("fallback");
      });
    return () => controller.abort();
  }, [bookingContext.companyId, bookingContext.branchId]);

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
            Live event schedule unavailable. Showing the latest available event list.
          </p>
        )}
        {events.length === 0 ? (
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
              const checkoutHref = `${MENU_CHECKOUT_URL}?${eventParams.toString()}`;
              const isLocalImage = item.image.startsWith("/");

              return (
                <article className={`event-card${isPast ? " event-card--past" : ""}`} key={item.title + item.start}>
                  <div className="event-card__media">
                    <span className={`event-card__badge event-card__badge--${status}`}>{badgeLabel}</span>
                    {isLocalImage ? (
                      <Image
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        width={item.imageWidth || 1024}
                        height={item.imageHeight || 1024}
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        width={item.imageWidth || 1024}
                        height={item.imageHeight || 1024}
                        loading="lazy"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    )}
                  </div>
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
                      ) : (
                        <a href={checkoutHref} className="event-card__btn event-card__btn--solid">
                          Book Event
                        </a>
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
