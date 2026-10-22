"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  RESERVATION_API_URL,
  RESERVATION_CATEGORIES_API_URL,
} from "@/lib/site";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { getPhoneDisplay, getPhoneHref, getTimeZoneOffset } from "@/lib/site-config";
import { showToast } from "@/lib/toast";

type ReservationPayload = {
  companyId: string;
  branchId: string;
  guestName: string;
  mobile: string;
  dateOfBirth: string;
  guestCount: number;
  reservationDateTime: string;
  specialRequest: string;
  reservationCategory: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  TABLE_RESERVATION: "Table Reservation",
  EVENT: "Event",
  LIVE_SPORTS: "Live Sports",
  GAMING: "Gaming",
  BOARD_GAME: "Board Game",
  EXCLUSIVE_OFFER: "Exclusive Offer",
  BIRTHDAY: "Birthday",
  CORPORATE: "Corporate",
  CUSTOM_MOMENT: "Custom Moment",
};

function normalizeMobile(value: string) {
  return value.replace(/\s+/g, "").replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function toReservationDateTime(date: string, time: string, timeZone: string) {
  if (!date || !time) {
    return "";
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  if (!year || !month || !day || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "";
  }

  const format = (value: number) => String(value).padStart(2, "0");
  const offsetDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const offset = getTimeZoneOffset(offsetDate, timeZone);
  return `${year}-${format(month)}-${format(day)}T${format(hours)}:${format(minutes)}:00${offset}`;
}

function validateReservation(data: ReservationPayload) {
  if (!data.guestName.trim()) {
    return "Please enter your full name.";
  }

  if (!/^\d{8,15}$/.test(data.mobile)) {
    return "Please enter a valid mobile number with digits only.";
  }

  if (!data.dateOfBirth) {
    return "Please select your date of birth.";
  }

  const dob = new Date(`${data.dateOfBirth}T00:00:00`);
  if (Number.isNaN(dob.getTime())) {
    return "Please enter a valid date of birth.";
  }

  if (dob > new Date()) {
    return "Date of birth cannot be in the future.";
  }

  if (!data.reservationDateTime) {
    return "Please select a reservation date and time.";
  }

  const reservationDate = new Date(data.reservationDateTime);
  if (Number.isNaN(reservationDate.getTime())) {
    return "Please enter a valid reservation date and time.";
  }

  if (reservationDate <= new Date()) {
    return "Reservation date and time must be in the future.";
  }

  if (!Number.isInteger(data.guestCount) || data.guestCount < 1 || data.guestCount > 20) {
    return "Please select a valid number of guests.";
  }

  return "";
}

export function ReserveForm() {
  const site = useSiteConfig();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reservationCategory = searchParams.get("reservationCategory") || "TABLE_RESERVATION";
  const reservationCompanyId = searchParams.get("companyId") || site.companyId;
  const reservationBranchId = searchParams.get("branchId") || site.branchId;
  const reservationContext = useMemo(
    () => ({ companyId: reservationCompanyId, branchId: reservationBranchId }),
    [reservationBranchId, reservationCompanyId],
  );
  const categoryLookupKey = `${reservationContext.companyId}:${reservationContext.branchId}:${reservationCategory}`;
  const [categoryLookup, setCategoryLookup] = useState<{ key: string; label: string } | null>(null);
  const categoryLabel =
    (categoryLookup?.key === categoryLookupKey ? categoryLookup.label : "") ||
    CATEGORY_LABELS[reservationCategory] ||
    reservationCategory.replaceAll("_", " ");

  useEffect(() => {
    const controller = new AbortController();
    const categoryParams = new URLSearchParams(reservationContext);
    fetch(`${RESERVATION_CATEGORIES_API_URL}?${categoryParams}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`Category request failed: ${response.status}`))))
      .then((payload) => {
        const categories = Array.isArray(payload) ? payload : payload?.data || payload?.categories || [];
        const selected = categories.find((item: { categoryCode?: string; categoryName?: string }) => item.categoryCode === reservationCategory);
        if (selected?.categoryName) setCategoryLookup({ key: categoryLookupKey, label: selected.categoryName });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.warn("Reservation category lookup unavailable; using the category label fallback.", error);
      });

    return () => controller.abort();
  }, [categoryLookupKey, reservationCategory, reservationContext]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("error");
      setNote("Please fill in all required fields.");
      return;
    }

    const data = new FormData(form);
    const guestName = String(data.get("name") || "").trim();
    const mobile = normalizeMobile(String(data.get("phone") || ""));
    const dateOfBirth = String(data.get("dob") || "").trim();
    const rawGuestCount = String(data.get("guests") || "").trim();
    const guestCount = rawGuestCount === "6+" ? 6 : Number(rawGuestCount);
    const reservationDate = String(data.get("date") || "").trim();
    const reservationTime = String(data.get("time") || "").trim();
    const specialRequest = String(data.get("notes") || "").trim();
    let reservationDateTime: string;

    try {
      reservationDateTime = toReservationDateTime(reservationDate, reservationTime, site.timezone);
    } catch (error: unknown) {
      console.error("Unable to determine the venue's reservation time zone.", error);
      setStatus("error");
      setNote("The venue time zone is invalid. Please contact the restaurant.");
      return;
    }

    const payload: ReservationPayload = {
      companyId: reservationContext.companyId,
      branchId: reservationContext.branchId,
      guestName,
      mobile,
      dateOfBirth,
      guestCount,
      reservationDateTime,
      specialRequest,
      reservationCategory,
    };

    const validationError = validateReservation(payload);
    if (validationError) {
      setStatus("error");
      setNote(validationError);
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setNote("Submitting your reservation…");

    try {
      const response = await fetch(RESERVATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          result && typeof result === "object" && "message" in result && typeof result.message === "string"
            ? result.message
            : result && typeof result === "object" && "error" in result && typeof result.error === "string"
              ? result.error
              : `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setStatus("success");
      setNote("Reservation submitted successfully. We will confirm shortly.");
      showToast("Reservation submitted successfully");
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while submitting the reservation.";
      setStatus("error");
      setNote(message);
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="home-reserve__panel">
      <div className="home-reserve__grid">
        <div className="home-reserve__intro">
          <div className="home-reserve__intro-top">
            <p className="home-kicker home-kicker--line-right">
              Book Your Experience<span className="home-kicker__line" aria-hidden="true" />
            </p>
            <h2 id="reserve-heading" className="home-heading home-heading--split">
              <span className="text-gold">{categoryLabel}</span>
            </h2>
            <div className="home-divider" aria-hidden="true" />
            <p className="home-copy">
              Whether it&rsquo;s a casual hangout, match night or a late-night chill session — we&rsquo;ve got the perfect table waiting for you.
            </p>
          </div>

          <ul className="home-reserve__perks" aria-label="Reservation highlights">
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <strong>Open 24/7</strong>
                <span>Book any time — day or night</span>
              </div>
            </li>
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 5h16v11H4zM8 21h8M12 16v5" />
                </svg>
              </span>
              <div>
                <strong>Live Sports</strong>
                <span>Big screens for every match</span>
              </div>
            </li>
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
                </svg>
              </span>
              <div>
                <strong>Gaming Zone</strong>
                <span>Play after you dine</span>
              </div>
            </li>
            <li>
              <span className="home-reserve__perk-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <div>
                <strong>Quick Confirmation</strong>
                <span>We confirm on WhatsApp</span>
              </div>
            </li>
          </ul>

          <div className="home-reserve__intro-meta">
            {getPhoneHref(site) && <a href={getPhoneHref(site)} className="home-reserve__meta-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{getPhoneDisplay(site)}</span>
            </a>}
            {site.address && (
              <>
                <span className="home-reserve__meta-sep" aria-hidden="true">·</span>
                <span className="home-reserve__meta-loc">{site.address}</span>
              </>
            )}
          </div>
        </div>

        <form className="home-reserve__form" ref={formRef} onSubmit={handleSubmit} noValidate>
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
          <div className="home-reserve__fields">
            <label className="home-field home-field--icon">
              <span className="home-field__label">Full Name</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input type="text" name="name" required autoComplete="name" placeholder="Enter your full name" />
              </span>
            </label>
            <label className="home-field home-field--icon">
              <span className="home-field__label">Phone Number</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <input type="tel" name="phone" required autoComplete="tel" placeholder="Enter phone number" />
              </span>
            </label>
            <label className="home-field home-field--icon">
              <span className="home-field__label">Date of Birth</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M20 21H4v-8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8z" />
                    <path d="M12 11V7M8 11V8M16 11V8" />
                    <path d="M8 7c0-1.1.9-2 2-2h0M12 5c0-1.1.9-2 2-2h0M16 6c0-1.1.9-2 2-2h0" />
                  </svg>
                </span>
                <input type="date" name="dob" required autoComplete="bday" />
              </span>
            </label>
            <label className="home-field home-field--icon home-field--guests">
              <span className="home-field__label">Number of Guests</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <select name="guests" required defaultValue="">
                  <option value="" disabled>
                    Select guests
                  </option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6+">6+ Guests</option>
                </select>
              </span>
            </label>
            <label className="home-field home-field--icon">
              <span className="home-field__label">Reservation Date</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <input type="date" name="date" required />
              </span>
            </label>
            <label className="home-field home-field--icon">
              <span className="home-field__label">Reservation Time</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <input type="time" name="time" required />
              </span>
            </label>
            <label className="home-field home-field--icon home-field--notes">
              <span className="home-field__label">Special Request</span>
              <span className="home-field__control">
                <span className="home-field__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 2l1.5 4.5H18l-3.5 2.5L16 14l-4-2.5L8 14l1.5-4.5L6 7h4.5L12 2z" />
                  </svg>
                </span>
                <textarea name="notes" rows={3} placeholder="Optional — allergies, occasion, seating preference" />
              </span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-reserve" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Reserve Now"}
          </button>
          <p
            className={`home-reserve__note ${status === "success" ? "home-reserve__note--success" : ""} ${status === "error" ? "home-reserve__note--error" : ""}`.trim()}
            role="status"
            aria-live="polite"
          >
            {note}
          </p>
        </form>
      </div>
    </div>
  );
}
