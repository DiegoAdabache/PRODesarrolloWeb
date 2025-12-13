import { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import { NewsCard } from "./NewsCard";
import { NewsListRow } from "./NewsListRow";

export function NewsList() {
  const [view, setView] = useState("cards");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, [page]);

  const load = async () => {
    try {
      const data = await fetchArticles(page, 6);
      setArticles(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Noticias publicadas</h2>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${
              view === "cards" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setView("cards")}
          >
            Cards
          </button>
          <button
            className={`btn btn-sm ${
              view === "list" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setView("list")}
          >
            Listado
          </button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {articles.map((a) => (
            <div className="col" key={a.id}>
              <NewsCard article={a} />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-group">
          {articles.map((a) => (
            <NewsListRow key={a.id} article={a} />
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center gap-2 my-4">
        <button
          className="btn btn-outline-secondary"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Anterior
        </button>
        <span className="align-self-center">Página {page}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
