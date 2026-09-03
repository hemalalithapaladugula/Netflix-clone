import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useMyList } from "../context/MyListContext";

function MyList() {
  const navigate = useNavigate();

  const { myList } = useMyList();

  return (
    <div className="my-list-wrapper">

      <Navbar />

      <main className="my-list-page">

        <button
          className="watch-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="my-list-header">

          <div>
            <p className="my-list-label">
              YOUR COLLECTION
            </p>

            <h1>
              My List
            </h1>

            <p className="my-list-subtitle">
              Your favourite movies and shows, all in one place.
            </p>
          </div>

          {myList.length > 0 && (
            <div className="my-list-count">
              {myList.length}{" "}
              {myList.length === 1
                ? "title"
                : "titles"}
            </div>
          )}

        </div>

        {myList.length > 0 ? (

          <div className="my-list-results">

            {myList.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}

          </div>

        ) : (

          <div className="empty-my-list">

            <div className="empty-my-list-icon">
              ＋
            </div>

            <h2>
              Your list is empty
            </h2>

            <p>
              Movies and TV shows you add to My List
              will appear here.
            </p>

            <button
              className="browse-button"
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

export default MyList;