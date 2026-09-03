import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { movies } from "../data/movies";

function ContentManagement() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-wrapper">
      <Navbar />

      <main className="admin-dashboard">
        {/* Header */}
        <div className="admin-header">
          <div>
            <p className="admin-label">ADMIN PANEL</p>
            <h1>Content Management</h1>
            <p>View and manage movies and TV shows.</p>
          </div>

          <button
            className="admin-back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Content Stats */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🎬</span>

            <div>
              <p>Total Content</p>
              <h2>{movies.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">🎥</span>

            <div>
              <p>Movies</p>
              <h2>
                {
                  movies.filter(
                    (movie) =>
                      movie.type === "Movie" ||
                      movie.mediaType === "movie" ||
                      !movie.type
                  ).length
                }
              </h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">📺</span>

            <div>
              <p>TV Shows</p>
              <h2>
                {
                  movies.filter(
                    (movie) =>
                      movie.type === "TV Show" ||
                      movie.mediaType === "tv"
                  ).length
                }
              </h2>
            </div>
          </div>
        </section>

        {/* Content List */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-section-label">CONTENT LIBRARY</p>
              <h2>Movies & TV Shows</h2>
            </div>

            <span className="admin-count">
              {movies.length} titles
            </span>
          </div>

          <div className="admin-content-list">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="admin-content-item"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                />

                <div className="admin-content-info">
                  <strong>{movie.title}</strong>

                  <span>
                    {movie.category || "Content"}
                  </span>

                  <small>
                    {movie.type ||
                      (movie.mediaType === "tv"
                        ? "TV Show"
                        : "Movie")}
                  </small>
                </div>

                <button
                  onClick={() =>
                    navigate(`/movie/${movie.id}`)
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ContentManagement;