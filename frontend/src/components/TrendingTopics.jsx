import { useEffect, useState } from "react";
import { fetchTrending } from "../api";

export function TrendingTopics() {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    fetchTrending()
      .then(setTrends)
      .catch((err) => console.error(err));
  }, []);

  return (
    <aside className="mt-4">
      <h3>Trending topics</h3>
      <ul className="list-group">
        {trends.map((t) => (
          <li
            key={t.name}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <a href={t.url} target="_blank" rel="noreferrer">
              {t.name}
            </a>
            {t.tweet_volume && (
              <span className="badge bg-secondary">
                {t.tweet_volume.toLocaleString()}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
