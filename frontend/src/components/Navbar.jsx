
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [subscription] = useState(() => {
    const saved = localStorage.getItem("netflixSubscription");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchText.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    setSearchText("");
    setShowMobileMenu(false);
  };

  const handleSectionClick = (sectionId) => {
    setShowMobileMenu(false);

    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setShowProfile(false);
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">

        {/* LOGO */}
        <div
          className="navbar-logo"
          onClick={() => {
            navigate("/");
            setShowMobileMenu(false);
          }}
        >
          NETFLIX
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="navbar-links">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button onClick={() => navigate("/tv-shows")}>
            TV Shows
          </button>

          <button onClick={() => navigate("/movies")}>
            Movies
          </button>

          <button
            onClick={() => handleSectionClick("new-popular")}
          >
            New & Popular
          </button>

          <button onClick={() => navigate("/my-list")}>
            My List
          </button>

          <button onClick={() => navigate("/watch-history")}>
            History
          </button>

          <button onClick={() => navigate("/subscription")}>
            Plans
          </button>

        </div>
      </div>

      <div className="navbar-right">

        {/* SEARCH */}
        <form
          className="navbar-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Titles, people, genres"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />

          <button type="submit">
            🔍
          </button>
        </form>

        {/* PROFILE */}
        <div className="profile-container">

          <button
            className="profile-button"
            onClick={() =>
              setShowProfile((previous) => !previous)
            }
          >
            <span className="profile-avatar">
              {currentUser?.email
                ? currentUser.email.charAt(0).toUpperCase()
                : "U"}
            </span>

            <span className="profile-arrow">
              ▾
            </span>
          </button>

          {showProfile && (
            <div className="profile-dropdown">

              {/* USER */}
              <div className="profile-user">

                <span className="profile-small-avatar">
                  {currentUser?.email
                    ? currentUser.email.charAt(0).toUpperCase()
                    : "U"}
                </span>

                <div>
                  <button
  className="profile-name-button"
  onClick={() => {
    setShowProfile(false);
    navigate("/profile");
  }}
>
  Profile
</button>

                  <small>
                    {currentUser?.email || "User"}
                  </small>
                </div>

              </div>

              <div className="profile-divider"></div>

              {/* PLAN */}
              <div className="profile-plan">

                <div className="profile-plan-title">

                  <span>MY PLAN</span>

                  {subscription?.active && (
                    <span className="plan-active">
                      ● ACTIVE
                    </span>
                  )}

                </div>

                {subscription?.active ? (
                  <>
                    <strong>
                      {subscription.planName}
                    </strong>

                    <small>
                      ₹{subscription.price}/month
                    </small>

                    <button
                      className="profile-plan-button"
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/subscription");
                      }}
                    >
                      Manage Plan
                    </button>
                  </>
                ) : (
                  <>
                    <strong>
                      No active plan
                    </strong>

                    <small>
                      Choose a plan to start watching
                    </small>

                    <button
                      className="profile-plan-button"
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/subscription");
                      }}
                    >
                      Choose a Plan
                    </button>
                  </>
                )}

              </div>

              <div className="profile-divider"></div>

              {/* PROFILE MENU */}

              <button
                className="profile-menu-item"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/my-list");
                }}
              >
                My List
              </button>

              <button
                className="profile-menu-item"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/watch-history");
                }}
              >
                History
              </button>

              <button
                className="profile-menu-item"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/subscription");
                }}
              >
                Subscription
              </button>

              <div className="profile-divider"></div>

              {/* SIGN OUT */}

              <button
                className="profile-signout"
                onClick={handleSignOut}
              >
                Sign out
              </button>

            </div>
          )}

        </div>

        {/* HAMBURGER BUTTON */}

        <button
          className="mobile-menu-button"
          onClick={() =>
            setShowMobileMenu((previous) => !previous)
          }
        >
          ☰
        </button>

      </div>

      {/* MOBILE / HAMBURGER MENU */}

      {showMobileMenu && (
        <div className="mobile-menu">

          <button
            onClick={() => {
              navigate("/");
              setShowMobileMenu(false);
            }}
          >
            Home
          </button>

          <button
            onClick={() => {
              navigate("/tv-shows");
              setShowMobileMenu(false);
            }}
          >
            TV Shows
          </button>

          <button
            onClick={() => {
              navigate("/movies");
              setShowMobileMenu(false);
            }}
          >
            Movies
          </button>

          <button
            onClick={() =>
              handleSectionClick("new-popular")
            }
          >
            New & Popular
          </button>

          <button
            onClick={() => {
              navigate("/my-list");
              setShowMobileMenu(false);
            }}
          >
            My List
          </button>

          {/* ⭐ HISTORY — HAMBURGER */}
          <button
            onClick={() => {
              navigate("/watch-history");
              setShowMobileMenu(false);
            }}
          >
            History
          </button>

          <button
            onClick={() => {
              navigate("/subscription");
              setShowMobileMenu(false);
            }}
          >
            Plans
          </button>

        </div>
      )}

    </nav>
  );
}

export default Navbar;
