import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">

        <p className="hero-label">
          #1 in Movies Today
        </p>

        <h1 className="hero-title">
          STRANGER THINGS
        </h1>

        <div className="hero-meta">
          <span>2026</span>
          <span>16+</span>
          <span>2h 15m</span>
          <span>Drama</span>
        </div>

        <p className="hero-description">
          A group of friends discover a mysterious world hidden beneath
          their quiet town. As strange events unfold, they must uncover
          the truth before it is too late.
        </p>

        <div className="hero-buttons">

          {/* Play Button */}
          <button
            className="play-button"
            onClick={() => navigate("/watch/1")}
          >
            ▶
            <span>Play</span>
          </button>

          {/* More Info Button */}
          <button
            className="info-button"
            onClick={() => navigate("/movie/1")}
          >
            ⓘ
            <span>More Info</span>
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;