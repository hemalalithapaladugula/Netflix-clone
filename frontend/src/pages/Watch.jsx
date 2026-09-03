
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { movies as localMovies } from "../data/movies";
import { getMovieById } from "../api";
import { useWatchHistory } from "../context/WatchHistoryContext";
import Navbar from "../components/Navbar";
import "./Watch.css";

function Watch() {
  const { addToHistory } = useWatchHistory();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const videoRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieError, setMovieError] = useState("");

  const [showLanguages, setShowLanguages] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState("English");
  const [subtitleLanguage, setSubtitleLanguage] =
    useState("English");

  const [savedProgress, setSavedProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const subscription = JSON.parse(
    localStorage.getItem("netflixSubscription") || "null"
  );

  const hasSubscription = subscription?.active === true;

  const progressKey = `watchProgress_${id}`;

  // =========================
  // LOAD MOVIE
  // =========================
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setMovieError("");

        const numericId = Number(id);

        // Existing local movie
        const localMovie = localMovies.find(
          (item) => item.id === numericId
        );

        if (!localMovie) {
          setMovie(null);
          return;
        }

        // Try backend movie
        let backendMovie = null;

        try {
          const data = await getMovieById(localMovie.id);

          if (
            data &&
            data.success &&
            data.movie
          ) {
            backendMovie = data.movie;
          }
        } catch (backendError) {
          console.warn(
            "Backend movie details unavailable. Using local data.",
            backendError
          );
        }

        // Combine local + backend data
        const combinedMovie = {
          ...localMovie,

          ...(backendMovie || {}),

          // Keep existing numeric ID
          id: localMovie.id,

          // Existing local image
          image:
            localMovie.image ||
            backendMovie?.poster ||
            "",

          // Backend video first, local video fallback
          trailerUrl:
            backendMovie?.videoUrl ||
            backendMovie?.trailerUrl ||
            localMovie.trailerUrl,

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
      } catch (error) {
        console.error(
          "Watch Movie API Error:",
          error
        );

        setMovieError(
          "Unable to load movie"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  // =========================
  // LOAD SAVED PROGRESS
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem(progressKey);

    if (saved) {
      setSavedProgress(Number(saved));
    }
  }, [progressKey]);

  // =========================
  // SAVE VIDEO PROGRESS
  // =========================
  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.currentTime > 0) {
      localStorage.setItem(
        progressKey,
        String(video.currentTime)
      );
    }
  };

  // =========================
  // RESTORE VIDEO POSITION
  // =========================
  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setVideoDuration(video.duration);

    const saved = Number(
      localStorage.getItem(progressKey) || 0
    );

    if (
      saved > 0 &&
      saved < video.duration - 5
    ) {
      video.currentTime = saved;
    }

    if (movie) {
      addToHistory(movie);
    }
  };

  // =========================
  // VIDEO ENDED
  // =========================
  const handleVideoEnded = () => {
    localStorage.removeItem(progressKey);
    setSavedProgress(0);
  };

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (seconds) => {
    if (
      !seconds ||
      Number.isNaN(seconds)
    ) {
      return "0:00";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds = Math.floor(
      seconds % 60
    );

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // =========================
  // PROGRESS PERCENTAGE
  // =========================
  const getProgressPercentage = () => {
    if (
      !savedProgress ||
      !videoDuration
    ) {
      return 0;
    }

    return Math.min(
      (savedProgress / videoDuration) * 100,
      100
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="watch-page">
        <Navbar />

        <div className="watch-error">
          <h1>Loading...</h1>

          <p>
            Please wait while the video is loaded.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (movieError) {
    return (
      <div className="watch-page">
        <Navbar />

        <div className="watch-error">
          <h1>
            Unable to load movie
          </h1>

          <p>{movieError}</p>

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
      <div className="watch-page">
        <Navbar />

        <div className="watch-error">
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
  // SUBSCRIPTION REQUIRED
  // =========================
  if (!hasSubscription) {
    return (
      <div className="watch-page">
        <Navbar />

        <main className="subscription-required">

          <div className="subscription-required-box">

            <div className="lock-icon">
              🔒
            </div>

            <p className="required-label">
              SUBSCRIPTION REQUIRED
            </p>

            <h1>
              Choose a plan to watch
            </h1>

            <p>
              Start your Netflix-style streaming
              experience by choosing a subscription plan.
            </p>

            <button
              className="required-button"
              onClick={() =>
                navigate("/subscription", {
                  state: {
                    from: location.pathname,
                    movieId: movie.id,
                  },
                })
              }
            >
              View Plans
            </button>

            <button
              className="required-back"
              onClick={() =>
                navigate("/")
              }
            >
              ← Back to Browse
            </button>

          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="watch-page">

      <Navbar />

      <main className="watch-container">

        {/* =========================
            BACK BUTTON
        ========================= */}
        <button
          className="watch-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* =========================
            VIDEO PLAYER
        ========================= */}
        <div className="video-wrapper">

          <video
            ref={videoRef}
            className="watch-video"
            controls
            autoPlay
            playsInline
            poster={movie.image}
            src={movie.trailerUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={
              handleLoadedMetadata
            }
            onEnded={handleVideoEnded}
          >
            Your browser does not support
            the video tag.
          </video>

        </div>

        {/* =========================
            RESUME INFORMATION
        ========================= */}
        {savedProgress > 0 &&
          videoDuration > 0 && (
            <div className="resume-info">

              <span>
                Resume position:{" "}
                <strong>
                  {formatTime(
                    savedProgress
                  )}
                </strong>
              </span>

              <span>
                {Math.round(
                  getProgressPercentage()
                )}
                % watched
              </span>

            </div>
          )}

        {/* =========================
            AUDIO & SUBTITLES
        ========================= */}
        <div className="language-control">

          <button
            className="audio-subtitle-button"
            onClick={() =>
              setShowLanguages(
                (previous) => !previous
              )
            }
          >
            ⚙ Audio & Subtitles
          </button>

          {showLanguages && (
            <div className="language-panel">

              {/* AUDIO */}
              <div className="language-section">

                <h3>
                  Audio
                </h3>

                {[
                  "English",
                  "Hindi",
                  "Telugu",
                  "Tamil",
                  "Malayalam",
                ].map((language) => (
                  <button
                    key={language}
                    className={
                      audioLanguage === language
                        ? "language-option selected-language"
                        : "language-option"
                    }
                    onClick={() =>
                      setAudioLanguage(
                        language
                      )
                    }
                  >
                    {audioLanguage === language
                      ? "✓ "
                      : ""}
                    {language}
                  </button>
                ))}

              </div>

              {/* SUBTITLES */}
              <div className="language-section">

                <h3>
                  Subtitles
                </h3>

                {[
                  "Off",
                  "English",
                  "Hindi",
                  "Telugu",
                  "Tamil",
                  "Malayalam",
                ].map((language) => (
                  <button
                    key={language}
                    className={
                      subtitleLanguage === language
                        ? "language-option selected-language"
                        : "language-option"
                    }
                    onClick={() =>
                      setSubtitleLanguage(
                        language
                      )
                    }
                  >
                    {subtitleLanguage === language
                      ? "✓ "
                      : ""}
                    {language}
                  </button>
                ))}

              </div>

              {/* SELECTED LANGUAGE */}
              <div className="selected-language-info">

                <span>
                  Audio:{" "}
                  <strong>
                    {audioLanguage}
                  </strong>
                </span>

                <span>
                  Subtitles:{" "}
                  <strong>
                    {subtitleLanguage}
                  </strong>
                </span>

              </div>

            </div>
          )}

        </div>

        {/* =========================
            MOVIE INFORMATION
        ========================= */}
        <div className="watch-info">

          <h1>
            {movie.title}
          </h1>

          <div className="watch-meta">

            <span>
              {movie.year || "2026"}
            </span>

            <span>•</span>

            <span>
              {movie.rating || "16+"}
            </span>

            <span>•</span>

            <span>
              HD
            </span>

          </div>

          <p>
            {movie.description ||
              `You're watching ${movie.title}. Enjoy your movie and continue watching your favourite shows.`}
          </p>

        </div>

      </main>

    </div>
  );
}

export default Watch;

