export interface HighlightItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function HighlightsStrip({ items, ariaLabel }: { items: HighlightItem[]; ariaLabel: string }) {
  return (
    <section className="home-strip" aria-label={ariaLabel}>
      <div className="home-container home-strip__grid">
        {items.map((item) => (
          <article className="home-strip__item" key={item.title}>
            <span className="home-strip__icon" aria-hidden="true">
              {item.icon}
            </span>
            <div className="home-strip__copy">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
