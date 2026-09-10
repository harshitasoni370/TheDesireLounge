"use client";

import { useEffect, useMemo, useState } from "react";
import galleryData from "@/data/gallery.json";

interface GalleryImage {
  src: string;
  name: string;
  category: string;
  alt: string;
}

interface GalleryVideo {
  src: string;
  name: string;
  ext: string;
  alt: string;
}

const CATEGORY_ORDER = ["category", "food", "beverages", "shisha"];
const PAGE_SIZE = 16;

const IMAGE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "food", label: "Food" },
  { value: "beverages", label: "Drinks" },
  { value: "shisha", label: "Shisha" },
  { value: "category", label: "Categories" },
];

function sortImages(items: GalleryImage[]) {
  return [...items].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    if (ai !== bi) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    return a.name.localeCompare(b.name, "en", { numeric: true });
  });
}

type LightboxItem = { kind: "image"; item: GalleryImage } | { kind: "video"; item: GalleryVideo };

export function GalleryGrid() {
  const images = useMemo(() => sortImages(galleryData.images as GalleryImage[]), []);
  const videos = galleryData.videos as GalleryVideo[];

  const [tab, setTab] = useState<"images" | "videos">("images");
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function changeTab(next: "images" | "videos") {
    setTab(next);
    setShown(PAGE_SIZE);
  }

  function changeFilter(next: string) {
    setFilter(next);
    setShown(PAGE_SIZE);
  }

  const list = useMemo(() => {
    if (tab === "videos") return videos;
    if (filter === "all") return images;
    return images.filter((img) => img.category === filter);
  }, [tab, filter, images, videos]);

  const visible = list.slice(0, shown);
  const hasMore = shown < list.length;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const stepLightbox = (delta: number) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + delta + visible.length) % visible.length;
    setLightboxIndex(next);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, visible.length]);

  const activeLightboxItem: LightboxItem | null =
    lightboxIndex !== null && visible[lightboxIndex]
      ? tab === "videos"
        ? { kind: "video", item: visible[lightboxIndex] as GalleryVideo }
        : { kind: "image", item: visible[lightboxIndex] as GalleryImage }
      : null;

  return (
    <section className="gallery-section" id="gallery-grid" aria-labelledby="gallery-media-heading">
      <h2 id="gallery-media-heading" className="sr-only">
        Browse gallery photos and videos
      </h2>

      <div className="home-container">
        <div className="gallery-toolbar">
          <div className="gallery-tabs" role="tablist" aria-label="Gallery media type">
            <button
              type="button"
              className={`gallery-tabs__btn${tab === "images" ? " is-active" : ""}`}
              role="tab"
              aria-selected={tab === "images"}
              onClick={() => changeTab("images")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              Images
              <span className="gallery-tabs__count">{images.length}</span>
            </button>
            <button
              type="button"
              className={`gallery-tabs__btn${tab === "videos" ? " is-active" : ""}`}
              role="tab"
              aria-selected={tab === "videos"}
              onClick={() => changeTab("videos")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Videos
              <span className="gallery-tabs__count">{videos.length}</span>
            </button>
          </div>

          {tab === "images" && (
            <div className="gallery-filters" role="group" aria-label="Image categories">
              {IMAGE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`gallery-filters__btn${filter === f.value ? " is-active" : ""}`}
                  onClick={() => changeFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          <p className="gallery-meta" aria-live="polite">
            {list.length === 0
              ? tab === "videos"
                ? "No videos found."
                : "No photos in this category."
              : `Showing ${Math.min(shown, list.length)} of ${list.length} ${tab === "videos" ? "videos" : "photos"}`}
          </p>
        </div>

        <div className="gallery-mosaic gallery-mosaic--feed" id="gallery-mosaic">
          {tab === "images"
            ? (visible as GalleryImage[]).map((img, i) => (
                <button type="button" key={img.src} className="gallery-mosaic__item" onClick={() => openLightbox(i)}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </button>
              ))
            : (visible as GalleryVideo[]).map((vid, i) => (
                <button type="button" key={vid.src} className="gallery-mosaic__item gallery-video-thumb" onClick={() => openLightbox(i)}>
                  <video src={vid.src} muted playsInline preload="metadata" aria-label={vid.alt} />
                  <span className="gallery-video-thumb__play" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8 5 20 12 8 19 8 5" />
                    </svg>
                  </span>
                </button>
              ))}
        </div>

        <div className="gallery-more">
          {hasMore && (
            <button type="button" className="btn btn-ghost gallery-more__btn" onClick={() => setShown((s) => s + PAGE_SIZE)}>
              Load more
            </button>
          )}
        </div>
      </div>

      {activeLightboxItem && (
        <div className="gallery-lightbox" id="gallery-lightbox">
          <div className="gallery-lightbox__backdrop" onClick={closeLightbox} />
          <button type="button" className="gallery-lightbox__close" onClick={closeLightbox} aria-label="Close gallery viewer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--prev" onClick={() => stepLightbox(-1)} aria-label="Previous item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <figure className="gallery-lightbox__figure">
            {activeLightboxItem.kind === "image" ? (
              <img src={activeLightboxItem.item.src} alt={activeLightboxItem.item.alt} />
            ) : (
              <video src={activeLightboxItem.item.src} controls playsInline preload="metadata" autoPlay />
            )}
            <figcaption className="gallery-lightbox__caption">{activeLightboxItem.item.alt}</figcaption>
          </figure>
          <button type="button" className="gallery-lightbox__nav gallery-lightbox__nav--next" onClick={() => stepLightbox(1)} aria-label="Next item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
