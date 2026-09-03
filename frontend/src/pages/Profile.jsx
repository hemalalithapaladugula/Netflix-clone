
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );

  const [savedName, setSavedName] = useState(
    currentUser?.displayName || ""
  );

  const [message, setMessage] = useState("");

  const subscription = JSON.parse(
    localStorage.getItem("netflixSubscription") || "null"
  );

  const handleSaveProfile = () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setMessage("Please enter your name.");
      return;
    }

    localStorage.setItem("netflixDisplayName", trimmedName);

    setSavedName(trimmedName);
    setMessage("Profile updated successfully.");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const avatarLetter =
    savedName?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      <main className="profile-page">

        <button
          className="profile-back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="profile-page-header">
          <p>ACCOUNT</p>
          <h1>Profile</h1>
        </div>

        <section className="profile-card">

          <div className="profile-main">

            <div className="profile-large-avatar">
              {avatarLetter}
            </div>

            <div className="profile-main-info">
              <h2>
                {savedName || "Netflix User"}
              </h2>

              <p>
                {currentUser?.email || "No email available"}
              </p>
            </div>

          </div>

          <div className="profile-divider"></div>

          <div className="profile-section">

            <h3>Personal Information</h3>

            <label>Display Name</label>

            <input
              type="text"
              value={displayName}
              placeholder="Enter your name"
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
            />

            <label>Email</label>

            <input
              type="email"
              value={currentUser?.email || ""}
              disabled
            />

            <button
              className="profile-save-button"
              onClick={handleSaveProfile}
            >
              Save Changes
            </button>

            {message && (
              <p className="profile-message">
                {message}
              </p>
            )}

          </div>

          <div className="profile-divider"></div>

          <div className="profile-section">

            <h3>My Netflix</h3>

            <div className="profile-action-row">

              <div>
                <strong>My List</strong>
                <span>
                  Your saved movies and shows
                </span>
              </div>

              <button
                onClick={() => navigate("/my-list")}
              >
                Open
              </button>

            </div>

            <div className="profile-action-row">

              <div>
                <strong>Watch History</strong>
                <span>
                  Recently watched movies and shows
                </span>
              </div>

              <button
                onClick={() =>
                  navigate("/watch-history")
                }
              >
                Open
              </button>

            </div>

          </div>

          <div className="profile-divider"></div>

          <div className="profile-section">

            <h3>Subscription</h3>

            {subscription?.active ? (
              <div className="profile-subscription">

                <div>
                  <strong>
                    {subscription.planName}
                  </strong>

                  <span>
                    ₹{subscription.price}/month
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate("/subscription")
                  }
                >
                  Manage Plan
                </button>

              </div>
            ) : (
              <div className="profile-subscription">

                <div>
                  <strong>
                    No active plan
                  </strong>

                  <span>
                    Choose a plan to start watching
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate("/subscription")
                  }
                >
                  View Plans
                </button>

              </div>
            )}

          </div>

          <div className="profile-divider"></div>

          <div className="profile-section danger-section">

            <h3>Account</h3>

            <button
              className="profile-signout-page"
              onClick={handleLogout}
            >
              Sign out
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;

