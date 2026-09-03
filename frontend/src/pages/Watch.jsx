import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { movies } from "../data/movies";
import { useWatchHistory } from "../context/WatchHistoryContext";
import "./watch.css";

const API_BASE_URL = "http://localhost:5000/api";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const { addToHistory } = useWatchHistory();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [showControls, setShowControls] = useState(true);

  // --------------------------------------------------
  // Find local movie
  // --------------------------------------------------
  const localMovie = movies.find(
    (item) => String(item.id) === String(id)
  );

  // --------------------------------------------------
  // Fetch backend movie
  // --------------------------------------------------
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");

        let backendMovie = null;

        try {
          const response = await fetch(
            `${API_BASE_URL}/movies/${id}`
          );

          if (response.ok) {
            backendMovie = await response.json();
          }
        } catch (backendError) {
          console.log("Backend movie fetch skipped:", backendError);
        }

        // --------------------------------------------------
        // Combine local + backend data
        // --------------------------------------------------
        if (localMovie) {
          const combinedMovie = {
            ...localMovie,

            ...(backendMovie || {}),

            // Keep existing numeric ID
            id: localMovie.id,

            // Keep local image
            image:
              localMovie.image ||
              backendMovie?.poster ||
              "",

            // IMPORTANT:
            // Always use Cloudinary URL from local movies.js
            // Backend old/stale video URL will NOT override it.
            trailerUrl: localMovie.trailerUrl,

            // Backend information
            year:
              backendMovie?.releaseYear ||
              localMovie.year,

            rating:
              backendMovie?.rating ||
              localMovie.rating,

            duration:
              backendMovie?.duration ||
              localMovie.duration,

            description:
              backendMovie?.description ||
              localMovie.description,

            language:
              backendMovie?.language ||
              "English",
          };

          setMovie(combinedMovie);
        } else if (backendMovie) {
          // If no local movie exists, use backend movie
          const backendOnlyMovie = {
            ...backendMovie,

            id: backendMovie._id,

            image:
              backendMovie.poster ||
              backendMovie.backdrop ||
              "",

            trailerUrl:
              backendMovie.videoUrl ||
              backendMovie.trailerUrl ||
              "",
          };

          setMovie(backendOnlyMovie);
        } else {
          setMovie(null);
          setError("Movie not found");
        }
      } catch (err) {
        console.error("Movie loading error:", err);
        setError("Unable to load movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, localMovie]);

  // --------------------------------------------------
  // Add movie to watch history
  // --------------------------------------------------
  useEffect(() => {
    if (!movie) return;

    addToHistory(movie);
  }, [movie]);

  // --------------------------------------------------
  // Video loaded
  // --------------------------------------------------
  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    console.log("Video loaded successfully");
    console.log("Video URL:", video.currentSrc);
    console.log("Duration:", video.duration);
  };

  // --------------------------------------------------
  // Save watch progress
  // --------------------------------------------------
  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || !movie) return;

    if (video.duration > 0) {
      const progress =
        (video.currentTime / video.duration) * 100;

      if (progress > 5) {
        localStorage.setItem(
          `watch-progress-${movie.id}`,
          JSON.stringify({
            currentTime: video.currentTime,
            duration: video.duration,
          })
        );
      }
    }
  };

  // --------------------------------------------------
  // Video ended
  // --------------------------------------------------
  const handleVideoEnded = () => {
    if (!movie) return;

    localStorage.removeItem(
      `watch-progress-${movie.id}`
    );

    addToHistory(movie);
  };

  // --------------------------------------------------
  // Restore previous watch position
  // --------------------------------------------------
  useEffect(() => {
    if (!movie) return;

    const video = videoRef.current;

    if (!video) return;

    const restoreProgress = () => {
      try {
        const savedProgress = localStorage.getItem(
          `watch-progress-${movie.id}`
        );

        if (!savedProgress) return;

        const progress = JSON.parse(savedProgress);

        if (
          progress?.currentTime &&
          progress.currentTime > 0 &&
          progress.currentTime < video.duration
        ) {
          video.currentTime = progress.currentTime;
        }
      } catch (err) {
        console.log("Unable to restore progress:", err);
      }
    };

    video.addEventListener(
      "loadedmetadata",
      restoreProgress
    );

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        restoreProgress
      );
    };
  }, [movie]);

  // --------------------------------------------------
  // Language selection
  // --------------------------------------------------
  const languages = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Malayalam",
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setShowLanguageMenu(false);
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="watch-page">
        <div className="watch-loading">
          Loading...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error / Movie not found
  // --------------------------------------------------
  if (error || !movie) {
    return (
      <div className="watch-page">
        <div className="watch-error">
          <h2>{error || "Movie not found"}</h2>

          <button
            onClick={() => navigate("/")}
            className="back-home-btn"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Main Watch Page
  // --------------------------------------------------
  return (
    <div className="watch-page">
      {/* Top Bar */}
      <div className="watch-topbar">
        <button
          className="watch-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="watch-title">
          {movie.title}
        </div>

        <div className="watch-language-wrapper">
          <button
            className="language-btn"
            onClick={() =>
              setShowLanguageMenu(!showLanguageMenu)
            }
          >
            🔊 {selectedLanguage} ▾
          </button>

          {showLanguageMenu && (
            <div className="language-menu">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() =>
                    handleLanguageChange(language)
                  }
                  className={
                    selectedLanguage === language
                      ? "active-language"
                      : ""
                  }
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Section */}
      <div
        className="watch-video-container"
        onMouseMove={() => {
          setShowControls(true);

          clearTimeout(window.watchControlsTimer);

          window.watchControlsTimer = setTimeout(() => {
            setShowControls(false);
          }, 3000);
        }}
      >
        <video
          ref={videoRef}
          className="watch-video"
          controls={showControls}
          autoPlay
          playsInline
          poster={movie.image}
          src={movie.trailerUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnded}
          onError={(event) => {
            console.error(
              "Video playback error:",
              event
            );

            console.error(
              "Video URL:",
              movie.trailerUrl
            );
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Movie Information */}
      <div className="watch-info">
        <div className="watch-info-header">
          <div>
            <h1>{movie.title}</h1>

            <div className="watch-meta">
              <span>{movie.year}</span>

              <span>•</span>

              <span>{movie.rating}</span>

              <span>•</span>

              <span>{movie.duration}</span>

              <span>•</span>

              <span>{movie.language}</span>
            </div>
          </div>
        </div>

        <p className="watch-description">
          {movie.description}
        </p>

        {/* Genres */}
        {movie.genre && movie.genre.length > 0 && (
          <div className="watch-genres">
            {movie.genre.map((genre, index) => (
              <span key={index}>
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}