
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../api";
import { movies as localMovies } from "../data/movies";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [genre, setGenre] = useState("All");
  const [year, setYear] = useState("All");
  const [rating, setRating] = useState("All");

  // =========================
  // LOAD MOVIES FROM BACKEND
  // =========================
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);

        const data = await getMovies();

        if (data.success) {
          setMovies(data.movies || []);
        } else {
          setError("Failed to load movies");
        }
      } catch (error) {
        console.error("Movies API Error:", error);
        setError("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // =========================
  // MOVIE LIST
  // =========================
  const movieList = movies;

  // =========================
  // GENRES
  // =========================
  const genres = [
    "All",
    ...new Set(
      movieList
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
      movieList
        .map((movie) => movie.year || movie.releaseYear)
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;

    return Number(b) - Number(a);
  });

  // =========================
  // FILTER MOVIES
  // =========================
  const filteredMovies = useMemo(() => {
    return movieList.filter((movie) => {
      const movieGenres = Array.isArray(movie.genre)
        ? movie.genre
        : Array.isArray(movie.genres)
        ? movie.genres
        : movie.genre
        ? [movie.genre]
        : [];

      const movieYear = movie.year || movie.releaseYear;

      const ratingMatchValue = parseFloat(
        String(movie.rating || "").replace("+", "")
      );

      const genreMatch =
        genre === "All" ||
        movieGenres.some(
          (item) =>
            String(item).toLowerCase() ===
            String(genre).toLowerCase()
        );

      const yearMatch =
        year === "All" ||
        String(movieYear) === String(year);

      const ratingMatch =
        rating === "All" ||
        (rating === "8+" && ratingMatchValue >= 8) ||
        (rating === "7+" && ratingMatchValue >= 7) ||
        (rating === "6+" && ratingMatchValue >= 6);

      return genreMatch && yearMatch && ratingMatch;
    });
  }, [movieList, genre, year, rating]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="browse-page">
        <Navbar />

        <main className="browse-container">
          <div className="browse-empty">
            <div className="browse-empty-icon">🎬</div>

            <h2>Loading movies...</h2>

            <p>
              Please wait while movies are loaded.
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

            <h2>Unable to load movies</h2>

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
          <div>
            <p className="browse-label">
              EXPLORE
            </p>

            <h1>Movies</h1>

            <p className="browse-description">
              Explore movies and find something great to watch.
            </p>
          </div>
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
                <option
                  key={item}
                  value={item}
                >
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
                <option
                  key={item}
                  value={item}
                >
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
              <option value="All">
                All Ratings
              </option>

              <option value="8+">
                8+ Rating
              </option>

              <option value="7+">
                7+ Rating
              </option>

              <option value="6+">
                6+ Rating
              </option>
            </select>
          </div>

          <button
            className="clear-filters"
            onClick={() => {
              setGenre("All");
              setYear("All");
              setRating("All");
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* =========================
            RESULT COUNT
        ========================= */}
        <div className="browse-result-info">
          <span>
            {filteredMovies.length}{" "}
            {filteredMovies.length === 1
              ? "title"
              : "titles"}
          </span>
        </div>

        {/* =========================
            MOVIE GRID
        ========================= */}
        {filteredMovies.length > 0 ? (
          <div className="browse-grid">

            {filteredMovies.map((movie) => {

              // Find matching movie from existing
              // local movies data using title.
              const localMovie = localMovies.find(
                (item) =>
                  item.title === movie.title
              );

              return (
                <MovieCard
                  key={movie._id || movie.id}
                  movie={{
                    ...movie,

                    // Keep existing numeric ID
                    // so Movie Details and Watch
                    // pages continue working.
                    id:
                      localMovie?.id ||
                      movie.id,

                    // Use existing local image
                    // because backend poster is empty.
                    image:
                      localMovie?.image ||
                      movie.poster,

                    // Backend releaseYear
                    // becomes frontend year.
                    year:
                      movie.releaseYear ||
                      movie.year,

                    // Backend video URL
                    // becomes frontend trailerUrl.
                    trailerUrl:
                      movie.trailerUrl ||
                      movie.videoUrl,
                  }}
                />
              );
            })}

          </div>
        ) : (
          <div className="browse-empty">

            <div className="browse-empty-icon">
              🎬
            </div>

            <h2>
              No movies found
            </h2>

            <p>
              Try changing your filters to find
              more movies.
            </p>

            <button
              onClick={() => {
                setGenre("All");
                setYear("All");
                setRating("All");
              }}
            >
              Reset Filters
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default Movies;

