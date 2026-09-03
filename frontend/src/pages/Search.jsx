import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { movies } from "../data/movies";

function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const results = useMemo(() => {
    const searchQuery = query.trim().toLowerCase();

    if (!searchQuery) {
      return [];
    }

    return movies.filter((movie) => {
      const title = movie.title?.toLowerCase() || "";

      const category = movie.category?.toLowerCase() || "";

      const genre = Array.isArray(movie.genre)
        ? movie.genre.join(" ").toLowerCase()
        : movie.genre?.toLowerCase() || "";

      const genres = Array.isArray(movie.genres)
        ? movie.genres.join(" ").toLowerCase()
        : movie.genres?.toLowerCase() || "";

      const type = movie.type?.toLowerCase() || "";

      const mediaType = movie.mediaType?.toLowerCase() || "";

      return (
        title.includes(searchQuery) ||
        category.includes(searchQuery) ||
        genre.includes(searchQuery) ||
        genres.includes(searchQuery) ||
        type.includes(searchQuery) ||
        mediaType.includes(searchQuery)
      );
    });
  }, [query]);

  const handleClearSearch = () => {
    navigate("/");
  };

  return (
    <div className="search-page-wrapper">

      <Navbar />

      <main className="search-page">

        <div className="search-header">

          <button
            className="watch-back"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

          <div className="search-heading">

            <p className="search-label">
              SEARCH
            </p>

            <h1>
              Results for{" "}
              <span>"{query}"</span>
            </h1>

            {query && (
              <p className="search-count">
                {results.length}{" "}
                {results.length === 1
                  ? "title"
                  : "titles"}{" "}
                found
              </p>
            )}

          </div>

        </div>

        {results.length > 0 ? (

          <div className="search-results">

            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}

          </div>

        ) : (

          <div className="no-search-results">

            <div className="search-empty-icon">
              🔍
            </div>

            {query ? (
              <>
                <h2>
                  No results found
                </h2>

                <p>
                  We couldn't find anything matching{" "}
                  <strong>"{query}"</strong>.
                </p>

                <p className="search-suggestion">
                  Try searching for a different title,
                  genre, or category.
                </p>
              </>
            ) : (
              <>
                <h2>
                  Search for a movie or TV show
                </h2>

                <p>
                  Use the search bar above to discover
                  something to watch.
                </p>
              </>
            )}

            <button
              className="search-clear-button"
              onClick={handleClearSearch}
            >
              Back to Browse
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default Search;