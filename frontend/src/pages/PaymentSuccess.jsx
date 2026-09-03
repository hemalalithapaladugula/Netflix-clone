import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const plan = location.state?.plan;
  const paymentMethod = location.state?.paymentMethod;

  useEffect(() => {
    if (plan) {
      const subscription = {
        active: true,
        planName: plan.name,
        price: plan.price,
        paymentMethod: paymentMethod,
        subscribedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "netflixSubscription",
        JSON.stringify(subscription)
      );
    }
  }, [plan, paymentMethod]);

  if (!plan) {
    return (
      <div className="payment-success-page">
        <Navbar />

        <main className="payment-success-container">
          <div className="success-box">
            <h1>No payment details found</h1>

            <button onClick={() => navigate("/subscription")}>
              Choose a Plan
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <Navbar />

      <main className="payment-success-container">
        <div className="success-box">

          <div className="success-icon">
            ✓
          </div>

          <p className="success-label">
            PAYMENT SUCCESSFUL
          </p>

          <h1>You're all set!</h1>

          <p className="success-message">
            Your subscription has been activated successfully.
          </p>

          <div className="success-plan">
            <div>
              <span>Plan</span>
              <strong>{plan.name}</strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>₹{plan.price}/month</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {paymentMethod === "upi" ? "UPI" : "Card"}
              </strong>
            </div>
          </div>

          <p className="success-demo">
            Demo payment completed successfully.
            <br />
            No real money has been charged.
          </p>

          <button
            className="success-home-button"
            onClick={() => navigate("/")}
          >
            Start Watching
          </button>

          <button
            className="success-plan-button"
            onClick={() => navigate("/subscription")}
          >
            View Plans
          </button>

        </div>
      </main>
    </div>
  );
}

export default PaymentSuccess;