
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies as localMovies } from "../data/movies";
import Navbar from "../components/Navbar";
import { useMyList } from "../context/MyListContext";
import { getMovieById } from "../api";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toggleMyList, isInMyList } = useMyList();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD MOVIE DETAILS
  // =========================
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const numericId = Number(id);

        // Find movie from existing local data
        // because the current routes use numeric IDs.
        const localMovie = localMovies.find(
          (item) => item.id === numericId
        );

        if (!localMovie) {
          setMovie(null);
          return;
        }

        // Try to find matching backend movie
        const backendData = await getMovieById(
          localMovie.id
        );

        let backendMovie = null;

        if (
          backendData &&
          backendData.success &&
          backendData.movie
        ) {
          backendMovie = backendData.movie;
        }

        // Combine backend information with
        // existing local images and IDs.
        const combinedMovie = {
          ...localMovie,

          ...(backendMovie || {}),

          // Keep existing numeric ID
          id: localMovie.id,

          // Keep existing local poster
          image:
            localMovie.image ||
            backendMovie?.poster ||
            "",

          // Use local image as backdrop if backend
          // backdrop is empty.
          backdrop:
            backendMovie?.backdrop ||
            localMovie.image ||
            "",

          // Backend year
          year:
            backendMovie?.releaseYear ||
            localMovie.year,

          // Backend video
          trailerUrl:
            backendMovie?.trailerUrl ||
            backendMovie?.videoUrl ||
            localMovie.trailerUrl,

          // Backend duration
          duration:
            backendMovie?.duration ||
            localMovie.duration,

          // Backend rating
          rating:
            backendMovie?.rating ||
            localMovie.rating,

          // Backend description
          description:
            backendMovie?.description ||
            localMovie.description,

          // Backend language
          language:
            backendMovie?.language ||
            "English",
        };

        setMovie(combinedMovie);
      } catch (error) {
        console.error(
          "Movie Details API Error:",
          error
        );

        setError(
          "Unable to load movie details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="details-page">
        <Navbar />

        <div className="details-not-found">
          <h1>Loading...</h1>

          <p>
            Please wait while movie details are loaded.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="details-page">
        <Navbar />

        <div className="details-not-found">
          <h1>Unable to load movie</h1>

          <p>{error}</p>

          <button
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // MOVIE NOT FOUND
  // =========================
  if (!movie) {
    return (
      <div className="details-page">
        <Navbar />

        <div className="details-not-found">
          <h1>Movie not found</h1>

          <button
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // PLAY
  // =========================
  const handlePlay = () => {
    navigate(`/watch/${movie.id}`);
  };

  // =========================
  // MY LIST
  // =========================
  const handleMyList = () => {
    toggleMyList(movie);
  };

  // =========================
  // GENRE
  // =========================
  const movieGenres = Array.isArray(movie.genre)
    ? movie.genre
    : movie.genre
    ? [movie.genre]
    : [];

  const movieGenre =
    movieGenres.length > 0
      ? movieGenres.join(" • ")
      : "Drama";

  // =========================
  // SIMILAR MOVIES
  // =========================
  const similarMovies = localMovies
    .filter((item) => {
      if (item.id === movie.id) {
        return false;
      }

      if (
        item.category &&
        movie.category &&
        item.category === movie.category
      ) {
        return true;
      }

      if (
        item.genre &&
        movie.genre
      ) {
        const itemGenre = Array.isArray(item.genre)
          ? item.genre
          : [item.genre];

        const currentGenre = Array.isArray(movie.genre)
          ? movie.genre
          : [movie.genre];

        return itemGenre.some((genre) =>
          currentGenre.some(
            (current) =>
              String(genre).toLowerCase() ===
              String(current).toLowerCase()
          )
        );
      }

      return false;
    })
    .slice(0, 6);

  return (
    <div className="details-page">

      <Navbar />

      {/* =========================
          BACKGROUND
      ========================= */}
      <div
        className="details-background"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(0, 0, 0, 0.98),
              rgba(0, 0, 0, 0.75),
              rgba(0, 0, 0, 0.25)
            ),
            linear-gradient(
              to top,
              #141414 0%,
              transparent 45%
            ),
            url(${movie.backdrop || movie.image})
          `,
        }}
      />

      {/* =========================
          MAIN DETAILS
      ========================= */}
      <div className="details-content">

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="details-label">
          NETFLIX ORIGINAL
        </div>

        <h1>{movie.title}</h1>

        {/* =========================
            META INFORMATION
        ========================= */}
        <div className="details-meta">

          {movie.year && (
            <span>
              {movie.year}
            </span>
          )}

          {movie.rating && (
            <span className="details-rating">
              ⭐ {movie.rating}
            </span>
          )}

          {movie.duration && (
            <span>
              {movie.duration}
            </span>
          )}

          <span>
            HD
          </span>

          <span>
            {movieGenre}
          </span>

        </div>

        {/* =========================
            DESCRIPTION
        ========================= */}
        <p className="details-description">
          {movie.description ||
            `Watch ${movie.title} and discover an exciting story filled with unforgettable characters, suspense and entertainment.`}
        </p>

        {/* =========================
            BUTTONS
        ========================= */}
        <div className="details-buttons">

          <button
            className="details-play"
            onClick={handlePlay}
          >
            ▶ Play
          </button>

          <button
            className={
              isInMyList(movie)
                ? "details-list details-list-active"
                : "details-list"
            }
            onClick={handleMyList}
          >
            {isInMyList(movie)
              ? "✓ In My List"
              : "+ My List"}
          </button>

        </div>

        {/* =========================
            EXTRA INFORMATION
        ========================= */}
        <div className="details-extra">

          <div>
            <span className="details-extra-label">
              Genres
            </span>

            <span>
              {movieGenre}
            </span>
          </div>

          <div>
            <span className="details-extra-label">
              Language
            </span>

            <span>
              {movie.language || "English"}
            </span>
          </div>

          <div>
            <span className="details-extra-label">
              Quality
            </span>

            <span>
              HD
            </span>
          </div>

        </div>

      </div>

      {/* =========================
          SIMILAR TITLES
      ========================= */}
      {similarMovies.length > 0 && (
        <section className="similar-section">

          <h2>
            More Like This
          </h2>

          <div className="similar-grid">

            {similarMovies.map(
              (similarMovie) => (
                <div
                  key={similarMovie.id}
                  className="similar-card"
                  onClick={() =>
                    navigate(
                      `/movie/${similarMovie.id}`
                    )
                  }
                >

                  <img
                    src={similarMovie.image}
                    alt={similarMovie.title}
                  />

                  <div className="similar-card-info">

                    <strong>
                      {similarMovie.title}
                    </strong>

                    <span>
                      {similarMovie.year || "2026"}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}

export default MovieDetails;

