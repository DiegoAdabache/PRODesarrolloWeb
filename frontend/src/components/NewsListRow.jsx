import { deleteArticle } from "../api";

export function NewsListRow({ article, currentUser, onDeleted, onEdit }) {
  const authorName = article.author?.username;

  const canDelete = !!currentUser && authorName === currentUser;
  const canEdit = canDelete;

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
    <div className="list-group-item">
      <div className="row g-3 align-items-center">
        <div className="col-4 col-md-3">
          {article.image_url && (
            <img src={article.image_url} alt={article.title} className="img-fluid rounded" />
          )}
        </div>

        <div className="col-8 col-md-7">
          <h5 className="mb-1">{article.title}</h5>
          <p className="mb-1 text-truncate">{article.body}</p>
          <small className="text-muted">Autor: {authorName || "—"}</small>
        </div>

        <div className="col-12 col-md-2 d-flex justify-content-md-end gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={!canEdit}
            onClick={() => onEdit?.(article)}
            title={
              !currentUser
                ? "Guarda tu username para poder editar"
                : !canEdit
                ? "Solo puedes editar tus propias noticias"
                : "Editar noticia"
            }
          >
            Editar
          </button>

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
    </div>
  );
}