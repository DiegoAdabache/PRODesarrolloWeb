export function NewsCard({ article }) {
  return (
    <div className="card h-100">
      {article.image_url && (
        <img
          src={article.image_url}
          className="card-img-top"
          alt={article.title}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text text-truncate" style={{ maxHeight: "4.5rem" }}>
          {article.body}
        </p>
      </div>
    </div>
  );
}
