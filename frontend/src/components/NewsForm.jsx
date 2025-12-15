import { useState } from "react";
import { createArticle } from "../api";

export function NewsForm({ onCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = sessionStorage.getItem("currentUser") || "";
    if (!currentUser.trim()) {
      alert("Primero guarda tu nombre de usuario (arriba a la derecha).");
      return;
    }

    setSubmitting(true);
    try {
      await createArticle({
        title,
        image_url: imageUrl || null,
        published_at: new Date(publishedAt).toISOString(),
        body,
      });

      setTitle("");
      setImageUrl("");
      setPublishedAt("");
      setBody("");

      onCreated?.(); // refresca lista y (en App) cierra el form
    } catch (err) {
      console.error(err);
      alert(err?.message || "No se pudo crear la noticia");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="mb-0">Nueva noticia</h3>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onCancel?.()}
          disabled={submitting}
        >
          Cancelar
        </button>
      </div>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Título</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Link a imagen</label>
          <input
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Fecha de alta</label>
          <input
            type="datetime-local"
            className="form-control"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Texto de la noticia</label>
          <textarea
            className="form-control"
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-dark" type="submit" disabled={submitting}>
            {submitting ? "Publicando..." : "Publicar"}
          </button>

          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => onCancel?.()}
            disabled={submitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
