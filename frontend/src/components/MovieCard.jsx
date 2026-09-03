import { useNavigate } from "react-router-dom";
import { useMyList } from "../context/MyListContext";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  const {
    toggleMyList,
    isInMyList,
  } = useMyList();

  const added = isInMyList(movie.id);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePlayClick = (event) => {
    event.stopPropagation();

    navigate(`/watch/${movie.id}`);
  };

  const handleAddClick = (event) => {
    event.stopPropagation();

    toggleMyList(movie);
  };

  const handleInfoClick = (event) => {
    event.stopPropagation();

    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      className="movie-card"
      onClick={handleCardClick}
    >

      <img
        src={movie.image}
        alt={movie.title}
        className="movie-card-image"
        loading="lazy"
      />

      <div className="movie-card-overlay">

        <h3>{movie.title}</h3>

        <div className="movie-card-info">
          <span>{movie.year}</span>
          <span>{movie.rating}</span>
          <span>{movie.duration}</span>
        </div>

        <div className="movie-card-actions">

          <button
            aria-label={`Play ${movie.title}`}
            onClick={handlePlayClick}
          >
            ▶
          </button>

          <button
            aria-label={
              added
                ? `Remove ${movie.title} from My List`
                : `Add ${movie.title} to My List`
            }
            onClick={handleAddClick}
          >
            {added ? "✓" : "+"}
          </button>

          <button
            aria-label={`More information about ${movie.title}`}
            onClick={handleInfoClick}
          >
            ⓘ
          </button>

        </div>

      </div>

    </div>
  );
}

export default MovieCard;