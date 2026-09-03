import { createContext, useContext, useEffect, useState } from "react";

const WatchHistoryContext = createContext();

export function WatchHistoryProvider({ children }) {
  const [watchHistory, setWatchHistory] = useState(() => {
    const savedHistory = localStorage.getItem("netflixWatchHistory");

    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "netflixWatchHistory",
      JSON.stringify(watchHistory)
    );
  }, [watchHistory]);

  const addToHistory = (movie) => {
    if (!movie) return;

    setWatchHistory((currentHistory) => {
      const filteredHistory = currentHistory.filter(
        (item) => item.id !== movie.id
      );

      const historyItem = {
        ...movie,
        watchedAt: new Date().toISOString(),
      };

      return [historyItem, ...filteredHistory];
    });
  };

  const removeFromHistory = (movieId) => {
    setWatchHistory((currentHistory) =>
      currentHistory.filter((item) => item.id !== movieId)
    );
  };

  const clearHistory = () => {
    setWatchHistory([]);
  };

  return (
    <WatchHistoryContext.Provider
      value={{
        watchHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  return useContext(WatchHistoryContext);
}