import { createContext, useContext, useEffect, useState } from "react";

const MyListContext = createContext();

export function MyListProvider({ children }) {
  const [myList, setMyList] = useState(() => {
    const savedList = localStorage.getItem("netflixMyList");

    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "netflixMyList",
      JSON.stringify(myList)
    );
  }, [myList]);

  const isInMyList = (movieId) => {
    return myList.some(
      (movie) => movie.id === movieId
    );
  };

  const toggleMyList = (movie) => {
    setMyList((currentList) => {
      const exists = currentList.some(
        (item) => item.id === movie.id
      );

      if (exists) {
        return currentList.filter(
          (item) => item.id !== movie.id
        );
      }

      return [...currentList, movie];
    });
  };

  return (
    <MyListContext.Provider
      value={{
        myList,
        toggleMyList,
        isInMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  return useContext(MyListContext);
}