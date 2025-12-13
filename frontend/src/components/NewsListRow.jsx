export function NewsListRow({ article }) {
  return (
    <div className="list-group-item">
      <div className="row g-3">
        <div className="col-4 col-md-3">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="img-fluid rounded"
            />
          )}
        </div>
        <div className="col-8 col-md-9">
          <h5>{article.title}</h5>
          <p className="mb-0 text-truncate">{article.body}</p>
        </div>
      </div>
    </div>
  );
}
