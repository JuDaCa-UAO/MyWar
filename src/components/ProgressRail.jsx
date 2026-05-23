export default function ProgressRail({ pages }) {
  return (
    <nav className="progress-rail" aria-label="Progreso de lectura">
      <div className="progress-rail__track">
        <div className="progress-rail__bar" />
      </div>

      <div className="progress-rail__pages">
        {pages.map((page) => (
          <a
            key={page.id}
            href={`#page-${page.id}`}
            className={`progress-rail__dot progress-rail__dot--${page.mood}`}
            aria-label={`Ir a página ${page.id}`}
          >
            {page.id}
          </a>
        ))}
      </div>
    </nav>
  );
}