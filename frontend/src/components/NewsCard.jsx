import { deleteArticle } from "../api";

export function NewsCard({ article, currentUser, onDeleted }) {
  const canDelete = !!currentUser && article.author_username === currentUser;

  const handleDelete = async () => {
    if (!currentUser) {
      alert("Primero guarda tu username.");
      return;
    }
    if (!canDelete) return;

    const ok = confirm("¿Seguro que quieres borrar esta noticia?");
    if (!ok) return;

    try {
      await deleteArticle(article.id);
      await onDeleted?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card h-100">
      {article.image_url && (
        <img src={article.image_url} className="card-img-top" alt={article.title} />
      )}

      <div className="card-body">
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text text-truncate" style={{ maxHeight: "4.5rem" }}>
          {article.body}
        </p>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Autor: {article.author_username || "—"}
        </small>

        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleDelete}
          disabled={!canDelete}
          title={
            !currentUser
              ? "Guarda tu username para poder borrar"
              : !canDelete
              ? "Solo puedes borrar tus propias noticias"
              : "Borrar noticia"
          }
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
