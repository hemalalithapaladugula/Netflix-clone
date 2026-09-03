
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

function Subscription() {
  const navigate = useNavigate();

  const [selectedPlanName, setSelectedPlanName] =
    useState("Standard");

  const plans = [
    {
      name: "Mobile",
      price: 149,
      quality: "Good",
      resolution: "480p",
      devices: "1",
      description: "For watching on mobile and tablet",
    },
    {
      name: "Basic",
      price: 199,
      quality: "Good",
      resolution: "720p",
      devices: "1",
      description: "For watching on your favourite devices",
    },
    {
      name: "Standard",
      price: 499,
      quality: "Great",
      resolution: "1080p",
      devices: "2",
      description: "For the whole family",
      popular: true,
    },
    {
      name: "Premium",
      price: 649,
      quality: "Best",
      resolution: "4K + HDR",
      devices: "4",
      description: "The ultimate Netflix experience",
    },
  ];

  const selectedPlan = plans.find(
    (plan) => plan.name === selectedPlanName
  );

  const handleContinue = () => {
    if (!selectedPlan) return;

    navigate("/demo-payment", {
      state: {
        plan: selectedPlan,
      },
    });
  };

  return (
    <div className="subscription-page">

      <Navbar />

      <main className="subscription-main">

        <button
          className="subscription-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <section className="subscription-hero">

          <span className="subscription-step">
            STEP 1 OF 2
          </span>

          <h1>
            Choose your plan
          </h1>

          <p>
            No commitments, cancel anytime.
          </p>

        </section>

        <section className="subscription-plans">

          {plans.map((plan) => {

            const isSelected =
              selectedPlanName === plan.name;

            return (
              <div
                key={plan.name}
                className={`subscription-plan ${
                  isSelected ? "active-plan" : ""
                }`}
                onClick={() =>
                  setSelectedPlanName(plan.name)
                }
              >

                {plan.popular && (
                  <div className="subscription-popular">
                    MOST POPULAR
                  </div>
                )}

                <div className="plan-top">

                  <h2>{plan.name}</h2>

                  <p className="plan-description">
                    {plan.description}
                  </p>

                </div>

                <div className="plan-price-box">

                  <span className="plan-currency">
                    ₹
                  </span>

                  <span className="plan-price-number">
                    {plan.price}
                  </span>

                  <span className="plan-month">
                    /month
                  </span>

                </div>

                <div className="plan-divider"></div>

                <div className="plan-feature">

                  <span>Video quality</span>

                  <strong>
                    {plan.quality}
                  </strong>

                </div>

                <div className="plan-feature">

                  <span>Resolution</span>

                  <strong>
                    {plan.resolution}
                  </strong>

                </div>

                <div className="plan-feature">

                  <span>Supported devices</span>

                  <strong>
                    {plan.devices}
                  </strong>

                </div>

                <div
                  className={`plan-select ${
                    isSelected ? "selected" : ""
                  }`}
                >

                  {isSelected ? (
                    <>
                      <span className="selected-check">
                        ✓
                      </span>
                      Selected
                    </>
                  ) : (
                    "Select"
                  )}

                </div>

              </div>
            );
          })}

        </section>

        <section className="subscription-info">

          <div className="subscription-info-item">
            <span>✓</span>
            <div>
              <strong>Unlimited entertainment</strong>
              <p>
                Watch thousands of movies and TV shows.
              </p>
            </div>
          </div>

          <div className="subscription-info-item">
            <span>✓</span>
            <div>
              <strong>Watch anywhere</strong>
              <p>
                Enjoy on your phone, TV, laptop and tablet.
              </p>
            </div>
          </div>

          <div className="subscription-info-item">
            <span>✓</span>
            <div>
              <strong>Cancel anytime</strong>
              <p>
                No contracts or cancellation fees.
              </p>
            </div>
          </div>

        </section>

        <section className="subscription-action">

          <div className="selected-summary">

            <span>
              Selected plan
            </span>

            <strong>
              {selectedPlan?.name}
            </strong>

            <small>
              ₹{selectedPlan?.price}/month
            </small>

          </div>

          <button
            className="subscription-continue"
            onClick={handleContinue}
          >
            Continue
          </button>

        </section>

        <p className="subscription-demo">
          Demo project · No real payment will be charged
        </p>

      </main>

    </div>
  );
}

export default Subscription;

