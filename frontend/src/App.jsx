import { NewsList } from "./components/NewsList";
import { NewsForm } from "./components/NewsForm";
import { TrendingTopics } from "./components/TrendingTopics";
import { UserSelector } from "./components/UserSelector";

export default function App() {
  return (
    <div className="container py-4">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom pb-3">
        <div>
          <h1 className="display-5 fw-bold">Fake Times</h1>
          <p className="text-muted mb-0">
            Un periódico digital inspirado en grandes diarios, pero con diseño propio.
          </p>
        </div>
        <UserSelector />
      </header>

      <div className="row">
        <div className="col-12 col-lg-8">
          <NewsForm />
          <NewsList />
        </div>
        <div className="col-12 col-lg-4">
          <TrendingTopics />
        </div>
      </div>

      <footer className="mt-5 border-top pt-3 small text-muted">
        <p>© 2025 Fake Times</p>
      </footer>
    </div>
  );
}
