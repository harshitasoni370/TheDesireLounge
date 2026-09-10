"use client";

import { useMemo } from "react";
import Image from "next/image";
import eventsData from "@/data/events-schedule.json";
import { WHATSAPP_NUMBER } from "@/lib/site";

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

function getStatus(start: string, end: string, today: Date): Status {
  const s = parseLocalDate(start);
  const e = parseLocalDate(end);
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

export function EventsSchedule() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  const events = useMemo(() => {
    const items = eventsData.events as EventItem[];
    return items
      .map((item) => ({ item, status: getStatus(item.start, item.end, today) }))
      .sort((a, b) => {
        const byStatus = statusRank(a.status) - statusRank(b.status);
        if (byStatus !== 0) return byStatus;
        if (a.status === "past") return b.item.start.localeCompare(a.item.start);
        const byStart = a.item.start.localeCompare(b.item.start);
        if (byStart !== 0) return byStart;
        return a.item.category.localeCompare(b.item.category);
      });
  }, [today]);

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

        {events.length === 0 ? (
          <p className="sports-empty">No events scheduled right now. Please check back shortly.</p>
        ) : (
          <div className="event-cards" aria-live="polite">
            {events.map(({ item, status }) => {
              const isPast = status === "past";
              const badgeLabel = status === "live" ? "Live" : isPast ? "Past" : "Upcoming";
              const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hi, I'd like to reserve a table for ${item.title}`
              )}`;

              return (
                <article className={`event-card${isPast ? " event-card--past" : ""}`} key={item.title + item.start}>
                  <div className="event-card__media">
                    <span className={`event-card__badge event-card__badge--${status}`}>{badgeLabel}</span>
                    <Image
                      src={`/images/events/${item.image.split("/").pop()}`}
                      alt={item.imageAlt || item.title}
                      width={item.imageWidth || 1024}
                      height={item.imageHeight || 1024}
                      loading="lazy"
                    />
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
                        <a href={whatsappHref} className="event-card__btn event-card__btn--solid" target="_blank" rel="noopener noreferrer">
                          Reserve Table
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
