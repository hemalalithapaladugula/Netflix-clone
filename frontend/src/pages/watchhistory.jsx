import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useWatchHistory } from "../context/WatchHistoryContext";

function WatchHistory() {
  const navigate = useNavigate();

  const {
    watchHistory,
    removeFromHistory,
    clearHistory,
  } = useWatchHistory();

  return (
    <div className="watch-history-wrapper">
      <Navbar />

      <main className="watch-history-page">

        <button
          className="watch-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="watch-history-header">

          <div>
            <p className="watch-history-label">
              YOUR ACTIVITY
            </p>

            <h1>Watch History</h1>

            <p className="watch-history-subtitle">
              Movies and shows you've recently watched.
            </p>
          </div>

          {watchHistory.length > 0 && (
            <button
              className="clear-history-button"
              onClick={clearHistory}
            >
              Clear History
            </button>
          )}

        </div>

        {watchHistory.length > 0 ? (
          <div className="watch-history-results">

            {watchHistory.map((movie) => (
              <div
                key={movie.id}
                className="history-card-wrapper"
              >

                <MovieCard movie={movie} />

                <button
                  className="remove-history-button"
                  onClick={() => removeFromHistory(movie.id)}
                >
                  ✕ Remove
                </button>

              </div>
            ))}

          </div>
        ) : (
          <div className="empty-watch-history">

            <div className="empty-history-icon">
              ◷
            </div>

            <h2>Your watch history is empty</h2>

            <p>
              Movies and TV shows you watch will appear here.
            </p>

            <button
              className="browse-history-button"
              onClick={() => navigate("/")}
            >
              Browse Movies & Shows
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default WatchHistory;