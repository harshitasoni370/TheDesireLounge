import Link from "next/link";

export function CtaBanner({
  icon,
  title,
  text,
  script,
  ctaLabel,
  ctaHref,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  script: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}) {
  return (
    <section className={`gallery-cta${className ? ` ${className}` : ""}`} aria-labelledby="cta-heading">
      <div className="home-container gallery-cta__inner">
        <div className="gallery-cta__copy">
          <div className="gallery-cta__icon" aria-hidden="true">
            {icon}
          </div>
          <div>
            <h2 id="cta-heading" className="gallery-cta__title">
              {title}
            </h2>
            <p className="gallery-cta__text">{text}</p>
            <p className="gallery-cta__script text-script">{script}</p>
          </div>
        </div>
        {ctaHref.startsWith("/") ? (
          <Link href={ctaHref} className="btn btn-primary gallery-cta__btn">
            {ctaLabel}
          </Link>
        ) : (
          <a href={ctaHref} className="btn btn-primary gallery-cta__btn">
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
