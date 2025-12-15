import { useState } from "react";
import { createArticle } from "../api";

export function NewsForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = sessionStorage.getItem("currentUser") || "";
    if (!currentUser.trim()) {
      alert("Primero guarda tu nombre de usuario (arriba a la derecha).");
      return;
    }

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

    onCreated?.();
  };

  return (
    <section className="mb-4">
      <h2 className="h4">Nueva noticia</h2>
      <form className="row g-3" onSubmit={handleSubmit}>
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
            type="datetime-local"
            className="form-control"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            required
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
          />
        </div>

        <div className="col-12">
          <button className="btn btn-dark" type="submit">
            Publicar
          </button>
        </div>
      </form>
    </section>
  );
}
