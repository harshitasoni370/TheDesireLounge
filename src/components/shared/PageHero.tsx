import { HeroAnimate } from "@/components/common/HeroAnimate";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
}

export function PageHero({
  id,
  className,
  bgImage,
  bgAlt,
  title,
  script,
  copy,
  ctas,
}: {
  id: string;
  className?: string;
  bgImage: string;
  bgAlt: string;
  title: string;
  script: string;
  copy: string;
  ctas: HeroCta[];
}) {
  return (
    <section className={`gallery-hero${className ? ` ${className}` : ""}`} id={id} aria-labelledby={`${id}-heading`}>
      <div className="gallery-hero__bg" style={{ backgroundImage: `url('${bgImage}')` }} role="img" aria-label={bgAlt} />
      <div className="gallery-hero__overlay" aria-hidden="true" />

      <HeroAnimate className="gallery-hero__content home-container">
        <h1 id={`${id}-heading`} className="gallery-hero__title hero-anim">
          {title}
        </h1>
        <p className="gallery-hero__script hero-anim text-script">{script}</p>
        <p className="gallery-hero__copy hero-anim">{copy}</p>
        <div className="gallery-hero__ctas hero-anim">
          {ctas.map((cta) => (
            <a key={cta.label} href={cta.href} className={`btn ${cta.variant === "ghost" ? "btn-ghost gallery-hero__book" : "btn-primary"}`}>
              {cta.icon}
              {cta.label}
            </a>
          ))}
        </div>
      </HeroAnimate>
    </section>
  );
}
