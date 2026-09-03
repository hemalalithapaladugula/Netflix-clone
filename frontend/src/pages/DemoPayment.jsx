import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

function DemoPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const plan = location.state?.plan;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [error, setError] = useState("");

  if (!plan) {
    return (
      <div className="payment-page">
        <Navbar />

        <div className="payment-error">
          <h1>No plan selected</h1>

          <button onClick={() => navigate("/subscription")}>
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = (event) => {
    event.preventDefault();

    setError("");

    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        setError("Please enter your UPI ID.");
        return;
      }

      if (!upiId.includes("@")) {
        setError("Please enter a valid UPI ID.");
        return;
      }
    }

    if (paymentMethod === "card") {
      if (
        !cardNumber.trim() ||
        !cardName.trim() ||
        !expiry.trim() ||
        !cvv.trim()
      ) {
        setError("Please fill all card details.");
        return;
      }
    }

    navigate("/payment-success", {
      state: {
        plan,
        paymentMethod,
      },
    });
  };

  return (
    <div className="payment-page">
      <Navbar />

      <main className="payment-container">

        <button
          className="payment-back"
          onClick={() => navigate("/subscription")}
        >
          ← Back
        </button>

        <div className="payment-box">

          <div className="payment-header">
            <p>STEP 2 OF 2</p>

            <h1>Complete your payment</h1>

            <span>
              You're subscribing to the {plan.name} plan.
            </span>
          </div>

          <div className="selected-plan-box">

            <div>
              <span>{plan.name}</span>
              <small>Monthly subscription</small>
            </div>

            <strong>
              ₹{plan.price}/month
            </strong>

          </div>

          <div className="payment-methods">

            <button
              type="button"
              className={
                paymentMethod === "upi"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => {
                setPaymentMethod("upi");
                setError("");
              }}
            >
              📱 UPI
            </button>

            <button
              type="button"
              className={
                paymentMethod === "card"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => {
                setPaymentMethod("card");
                setError("");
              }}
            >
              💳 Card
            </button>

          </div>

          <form
            className="payment-form"
            onSubmit={handlePayment}
          >

            {paymentMethod === "upi" && (
              <div className="upi-section">

                <label>
                  UPI ID
                </label>

                <input
                  type="text"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(event) =>
                    setUpiId(event.target.value)
                  }
                />

                <p className="demo-note">
                  Demo payment only. No real money will be
                  charged.
                </p>

              </div>
            )}

            {paymentMethod === "card" && (
              <div className="card-section">

                <label>
                  Card Number
                </label>

                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  value={cardNumber}
                  onChange={(event) =>
                    setCardNumber(event.target.value)
                  }
                />

                <label>
                  Cardholder Name
                </label>

                <input
                  type="text"
                  placeholder="Your Name"
                  value={cardName}
                  onChange={(event) =>
                    setCardName(event.target.value)
                  }
                />

                <div className="card-row">

                  <div>
                    <label>
                      Expiry
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiry}
                      onChange={(event) =>
                        setExpiry(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>
                      CVV
                    </label>

                    <input
                      type="password"
                      placeholder="123"
                      maxLength="3"
                      value={cvv}
                      onChange={(event) =>
                        setCvv(event.target.value)
                      }
                    />
                  </div>

                </div>

                <p className="demo-note">
                  Demo payment only. Do not enter real card
                  details.
                </p>

              </div>
            )}

            {error && (
              <p className="payment-error-text">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="pay-now-button"
            >
              Pay ₹{plan.price}
            </button>

          </form>

        </div>

      </main>
    </div>
  );
}

export default DemoPayment;