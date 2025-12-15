import { useEffect, useState } from "react";
import { fetchTrending } from "../api";

export function TrendingTopics() {
  const [period, setPeriod] = useState(7);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTrending(period); 
        if (!alive) return;
        setItems(data.items || []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Error cargando trending");
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [period]);

  return (
    <section className="ft-trending">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Trending</h2>

        <select
          className="form-select form-select-sm"
          style={{ width: 130 }}
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          aria-label="Periodo de trending"
        >
          <option value={1}>1 día</option>
          <option value={7}>7 días</option>
          <option value={30}>30 días</option>
        </select>
      </div>

      {loading && <div className="text-muted">Cargando…</div>}

      {!loading && error && (
        <div className="alert alert-warning py-2">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-muted">Sin resultados.</div>
      )}

      <div className="list-group">
        {items.map((a, idx) => (
          <a
            key={a.id ?? `${a.url}-${idx}`}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex gap-3">
              <div className="ft-thumb">
                {a.image_url ? (
                  <img src={a.image_url} alt={a.title} />
                ) : (
                  <div className="ft-thumb--placeholder" />
                )}
              </div>

              <div className="flex-grow-1">
                <div className="small text-muted">
                  {a.section || "NYT"} • {a.published_date || ""}
                </div>
                <div className="fw-semibold">{a.title}</div>
                <div className="small text-muted ft-clamp-2">
                  {a.abstract || ""}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
