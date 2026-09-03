import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MovieDetails from "./pages/MovieDetails";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import MyList from "./pages/MyList";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieRow from "./components/MovieRow";

import { MyListProvider } from "./context/MyListContext";
import { WatchHistoryProvider } from "./context/WatchHistoryContext";
import { movies } from "./data/movies";

import Subscription from "./pages/Subscription";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Movies from "./pages/Movies";
import DemoPayment from "./pages/DemoPayment";
import TVShows from "./pages/TvShows";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import WatchHistory from "./pages/WatchHistory";
import ContentManagement from "./pages/ContentManagement";
import PaymentSuccess from "./pages/PaymentSuccess";

import { getMovies } from "./api";

import "./App.css";


// =========================
// HOME PAGE
// =========================

function Home() {

  const trendingMovies = movies.filter(
    (movie) => movie.category === "Trending"
  );

  const popularMovies = movies.filter(
    (movie) => movie.category === "Popular"
  );

  const newMovies = movies.filter(
    (movie) => movie.category === "New"
  );

  const top10Movies = movies.filter(
    (movie) => movie.category === "Top10"
  );

  return (
    <div className="home-page">

      <Navbar />

      <main>

        <Hero />

        <div className="movie-sections">

          {/* TV SHOWS */}
          <section id="tv-shows">
            <MovieRow
              title="Trending Now"
              movies={trendingMovies}
            />
          </section>


          {/* MOVIES */}
          <section id="movies">
            <MovieRow
              title="Popular on Netflix"
              movies={popularMovies}
            />
          </section>


          {/* NEW & POPULAR */}
          <section id="new-popular">

            <MovieRow
              title="New Releases"
              movies={newMovies}
            />

            <MovieRow
              title="Top 10"
              movies={top10Movies}
            />

          </section>

        </div>

      </main>

    </div>
  );
}


// =========================
// MAIN APP
// =========================

function App() {

  // =========================
  // BACKEND API TEST
  // =========================

  useEffect(() => {

    const testBackend = async () => {

      try {

        const data = await getMovies();

        console.log("Backend Movies:", data);

      } catch (error) {

        console.error(
          "Backend API Error:",
          error
        );

      }

    };

    testBackend();

  }, []);


  return (
    <BrowserRouter>

      <MyListProvider>

        <WatchHistoryProvider>

          <Routes>

            {/* LOGIN */}
            <Route
              path="/login"
              element={<Login />}
            />


            {/* SIGNUP */}
            <Route
              path="/signup"
              element={<Signup />}
            />


            {/* HOME */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />


            {/* MOVIE DETAILS */}
            <Route
              path="/movie/:id"
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              }
            />


            {/* WATCH */}
            <Route
              path="/watch/:id"
              element={
                <ProtectedRoute>
                  <Watch />
                </ProtectedRoute>
              }
            />


            {/* SEARCH */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />


            {/* MY LIST */}
            <Route
              path="/my-list"
              element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              }
            />


            {/* WATCH HISTORY */}
            <Route
              path="/watch-history"
              element={
                <ProtectedRoute>
                  <WatchHistory />
                </ProtectedRoute>
              }
            />


            {/* SUBSCRIPTION */}
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              }
            />


            {/* DEMO PAYMENT */}
            <Route
              path="/demo-payment"
              element={
                <ProtectedRoute>
                  <DemoPayment />
                </ProtectedRoute>
              }
            />


            {/* PAYMENT SUCCESS */}
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />


            {/* MOVIES */}
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              }
            />


            {/* TV SHOWS */}
            <Route
              path="/tv-shows"
              element={
                <ProtectedRoute>
                  <TVShows />
                </ProtectedRoute>
              }
            />


            {/* PROFILE */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />


            {/* ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />


            {/* ADMIN USERS */}
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <UserManagement />
                </ProtectedAdminRoute>
              }
            />


            {/* ADMIN CONTENT */}
            <Route
              path="/admin/content"
              element={
                <ProtectedAdminRoute>
                  <ContentManagement />
                </ProtectedAdminRoute>
              }
            />

          </Routes>

        </WatchHistoryProvider>

      </MyListProvider>

    </BrowserRouter>
  );
}


export default App;