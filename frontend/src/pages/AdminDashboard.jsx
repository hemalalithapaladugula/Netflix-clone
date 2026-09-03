
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { movies } from "../data/movies";

function AdminDashboard() {
  const navigate = useNavigate();

  const users = JSON.parse(
    localStorage.getItem("netflixUsers") || "[]"
  );

  const subscription = JSON.parse(
    localStorage.getItem("netflixSubscription") || "null"
  );

  const totalMovies = movies.filter(
    (movie) =>
      movie.type === "Movie" ||
      movie.mediaType === "movie" ||
      !movie.type
  ).length;

  const totalTVShows = movies.filter(
    (movie) =>
      movie.type === "TV Show" ||
      movie.mediaType === "tv"
  ).length;

  return (
    <div className="admin-dashboard-wrapper">
      <Navbar />

      <main className="admin-dashboard">

        <div className="admin-header">

          <div>
            <p className="admin-label">
              ADMIN PANEL
            </p>

            <h1>Dashboard</h1>

            <p>
              Manage your Netflix clone platform.
            </p>
          </div>

          <button
            className="admin-back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Netflix
          </button>

        </div>

        {/* STAT CARDS */}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span className="admin-stat-icon">
              👥
            </span>

            <div>
              <p>Total Users</p>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">
              🎬
            </span>

            <div>
              <p>Total Movies</p>
              <h2>{totalMovies}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">
              📺
            </span>

            <div>
              <p>TV Shows</p>
              <h2>{totalTVShows}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">
              💳
            </span>

            <div>
              <p>Active Plan</p>
              <h2>
                {subscription?.active ? "1" : "0"}
              </h2>
            </div>
          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <p className="admin-section-label">
                MANAGEMENT
              </p>

              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-actions">

            <button
              onClick={() =>
                navigate("/admin/users")
              }
            >
              <span>👥</span>
              <strong>User Management</strong>
              <small>
                View and manage users
              </small>
            </button>

            <button
              onClick={() =>
                navigate("/admin/content")
              }
            >
              <span>🎬</span>
              <strong>Content Management</strong>
              <small>
                Manage movies and shows
              </small>
            </button>

            <button
              onClick={() =>
                navigate("/subscription")
              }
            >
              <span>💳</span>
              <strong>Subscriptions</strong>
              <small>
                View subscription plans
              </small>
            </button>

          </div>

        </section>

        {/* RECENT CONTENT */}

        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <p className="admin-section-label">
                CONTENT
              </p>

              <h2>Recent Movies</h2>
            </div>

            <span className="admin-count">
              {movies.length} titles
            </span>

          </div>

          <div className="admin-content-list">

            {movies.slice(0, 6).map((movie) => (
              <div
                key={movie.id}
                className="admin-content-item"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                />

                <div>
                  <strong>
                    {movie.title}
                  </strong>

                  <span>
                    {movie.category || "Content"}
                  </span>
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

export default AdminDashboard;

