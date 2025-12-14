import { useEffect, useState } from "react";
import { updateArticle } from "../api";

export function EditArticleModal({ article, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!article) return;
    setTitle(article.title || "");
    setImageUrl(article.image_url || "");
    setBody(article.body || "");
  }, [article]);

  if (!article) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PATCH: NO mandamos published_at para que no se modifique
    const payload = {
      title,
      image_url: imageUrl || null,
      body,
    };

    try {
      await updateArticle(article.id, payload);
      await onSaved?.();
      onClose?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar noticia</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Título</label>
                    <input
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Link a imagen</label>
                    <input
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Fecha de alta</label>
                    <input
                      className="form-control"
                      value={new Date(article.published_at).toLocaleString()}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Texto de la noticia</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-dark">
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
