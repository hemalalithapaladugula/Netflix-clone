
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../api";
import { movies as localMovies } from "../data/movies";

function TVShows() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [genre, setGenre] = useState("All");
  const [year, setYear] = useState("All");
  const [rating, setRating] = useState("All");

  // =========================
  // LOAD TV SHOWS FROM BACKEND
  // =========================
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);

        const data = await getMovies();

        if (data.success) {
          setMovies(data.movies || []);
        } else {
          setError("Failed to load TV shows");
        }
      } catch (error) {
        console.error("TV Shows API Error:", error);
        setError("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // =========================
  // ONLY TV SHOWS
  // =========================
  const tvShows = movies.filter(
    (movie) =>
      movie.type === "tv" ||
      movie.type === "TV" ||
      movie.type === "TV Show" ||
      movie.mediaType === "TV Show" ||
      movie.type === "Series" ||
      movie.mediaType === "Series"
  );

  // =========================
  // GENRES
  // =========================
  const genres = [
    "All",
    ...new Set(
      tvShows
        .flatMap((movie) => {
          if (Array.isArray(movie.genre)) {
            return movie.genre;
          }

          if (Array.isArray(movie.genres)) {
            return movie.genres;
          }

          if (movie.genre) {
            return [movie.genre];
          }

          return [];
        })
        .filter(Boolean)
    ),
  ];

  // =========================
  // YEARS
  // =========================
  const years = [
    "All",
    ...new Set(
      tvShows
        .map((movie) => movie.year || movie.releaseYear)
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;

    return Number(b) - Number(a);
  });

  // =========================
  // FILTER TV SHOWS
  // =========================
  const filteredShows = useMemo(() => {
    return tvShows.filter((show) => {
      const showGenres = Array.isArray(show.genre)
        ? show.genre
        : Array.isArray(show.genres)
        ? show.genres
        : show.genre
        ? [show.genre]
        : [];

      const showYear = show.year || show.releaseYear;

      const ratingValue = parseFloat(
        String(show.rating || "").replace("+", "")
      );

      const genreMatch =
        genre === "All" ||
        showGenres.some(
          (item) =>
            String(item).toLowerCase() ===
            String(genre).toLowerCase()
        );

      const yearMatch =
        year === "All" ||
        String(showYear) === String(year);

      const ratingMatch =
        rating === "All" ||
        (rating === "8+" && ratingValue >= 8) ||
        (rating === "7+" && ratingValue >= 7) ||
        (rating === "6+" && ratingValue >= 6);

      return genreMatch && yearMatch && ratingMatch;
    });
  }, [tvShows, genre, year, rating]);

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setGenre("All");
    setYear("All");
    setRating("All");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="browse-page">
        <Navbar />

        <main className="browse-container">
          <div className="browse-empty">
            <div className="browse-empty-icon">📺</div>

            <h2>Loading TV shows...</h2>

            <p>
              Please wait while TV shows are loaded.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="browse-page">
        <Navbar />

        <main className="browse-container">
          <div className="browse-empty">
            <div className="browse-empty-icon">⚠️</div>

            <h2>Unable to load TV shows</h2>

            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <Navbar />

      <main className="browse-container">

        {/* =========================
            HEADER
        ========================= */}
        <div className="browse-header">
          <p className="browse-label">EXPLORE</p>

          <h1>TV Shows</h1>

          <p className="browse-description">
            Explore TV shows and discover your next favourite series.
          </p>
        </div>

        {/* =========================
            FILTER BAR
        ========================= */}
        <div className="filter-bar">

          <div className="filter-group">
            <label>Genre</label>

            <select
              value={genre}
              onChange={(event) =>
                setGenre(event.target.value)
              }
            >
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year</label>

            <select
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
            >
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Rating</label>

            <select
              value={rating}
              onChange={(event) =>
                setRating(event.target.value)
              }
            >
              <option value="All">All Ratings</option>
              <option value="8+">8+ Rating</option>
              <option value="7+">7+ Rating</option>
              <option value="6+">6+ Rating</option>
            </select>
          </div>

          <button
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

        {/* =========================
            RESULT COUNT
        ========================= */}
        <div className="browse-result-info">
          <span>
            {filteredShows.length}{" "}
            {filteredShows.length === 1
              ? "title"
              : "titles"}
          </span>
        </div>

        {/* =========================
            TV SHOW GRID
        ========================= */}
        {filteredShows.length > 0 ? (
          <div className="browse-grid">

            {filteredShows.map((show) => {

              // Find the matching local movie/show
              // using the title.
              const localMovie = localMovies.find(
                (item) =>
                  item.title === show.title
              );

              return (
                <MovieCard
                  key={show._id || show.id}
                  movie={{
                    ...show,

                    // Keep the existing numeric ID
                    // so Movie Details and Watch pages work.
                    id:
                      localMovie?.id ||
                      show.id,

                    // Use the existing local poster image
                    // because backend poster is empty.
                    image:
                      localMovie?.image ||
                      show.poster,

                    // Backend releaseYear → frontend year
                    year:
                      show.releaseYear ||
                      show.year,

                    // Backend videoUrl → frontend trailerUrl
                    trailerUrl:
                      show.trailerUrl ||
                      show.videoUrl,
                  }}
                />
              );
            })}

          </div>
        ) : (
          <div className="browse-empty">

            <div className="browse-empty-icon">
              📺
            </div>

            <h2>No TV shows found</h2>

            <p>
              Try changing your filters to find more shows.
            </p>

            <button onClick={clearFilters}>
              Reset Filters
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default TVShows;

