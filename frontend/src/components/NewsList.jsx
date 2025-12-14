import { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import { NewsCard } from "./NewsCard";
import { NewsListRow } from "./NewsListRow";
import { EditArticleModal } from "./EditArticleModal";

function getCurrentUser() {
  return sessionStorage.getItem("currentUser") || "";
}

export function NewsList() {
  const [view, setView] = useState("cards");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const currentUser = getCurrentUser();
  const pageSize = 6; 

  
  useEffect(() => {
    loadPage(page);
  }, []);

  const loadPage = async (p) => {
    setLoading(true);
    try {
      const data = await fetchArticles(p, pageSize);
      setArticles(data);
      if (data.length === 0 && p > 1) {
        setHasNext(false);
      } else {
    
        setHasNext(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reloadCurrent = async () => {
    await loadPage(page);
  };

  const goPrev = async () => {
    if (page === 1 || loading) return;
    const newPage = page - 1;
    setPage(newPage);
    await loadPage(newPage);
    setHasNext(true); 
  };

  const goNext = async () => {
    if (loading) return;

    const nextPage = page + 1;

    setLoading(true);
    try {
      const nextData = await fetchArticles(nextPage, pageSize);

      if (nextData.length === 0) {
        setHasNext(false);
        return;
      }

      setPage(nextPage);
      setArticles(nextData);

      setHasNext(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequested = (article) => {
    if (!currentUser.trim()) {
      alert("Primero guarda tu username.");
      return;
    }
    if (article.author_username !== currentUser) return;
    setEditingArticle(article);
  };

  return (
    <section className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Noticias publicadas</h2>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${view === "cards" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("cards")}
          >
            Cards
          </button>
          <button
            className={`btn btn-sm ${view === "list" ? "btn-dark" : "btn-outline-dark"}`}
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
              <NewsCard
                article={a}
                currentUser={currentUser}
                onDeleted={reloadCurrent}
                onEdit={handleEditRequested}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-group">
          {articles.map((a) => (
            <NewsListRow
              key={a.id}
              article={a}
              currentUser={currentUser}
              onDeleted={reloadCurrent}
              onEdit={handleEditRequested}
            />
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center gap-2 my-4">
        <button
          className="btn btn-outline-secondary"
          disabled={page === 1 || loading}
          onClick={goPrev}
        >
          Anterior
        </button>

        <span className="align-self-center">
          Página {page} {loading ? "(cargando...)" : ""}
        </span>

        <button
          className="btn btn-outline-secondary"
          disabled={!hasNext || loading}
          onClick={goNext}
        >
          Siguiente
        </button>
      </div>

      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSaved={reloadCurrent}
        />
      )}
    </section>
  );
}