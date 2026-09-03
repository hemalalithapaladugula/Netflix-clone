import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Email / Password Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (error.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups and try again.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Netflix Logo */}
        <h1 className="auth-logo">NETFLIX</h1>

        {/* Login Box */}
        <div className="auth-box">

          <h2>Sign In</h2>

          {/* Error Message */}
          {error && <p className="auth-error">{error}</p>}

          {/* Email Login Form */}
          <form onSubmit={handleLogin}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button type="submit" disabled={loading || googleLoading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          {/* Signup Link */}
          <p className="auth-footer">
            New to Netflix?{" "}
            <Link to="/signup">Sign up now.</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;