import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { stripeCheckoutSuccess } from "../api/tontineContributions";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setMessage("No session found.");
      setTimeout(() => navigate("/tontine-contributions"), 5000);
      return;
    }

    const stripeCheckout = async () => {
      try {
        const res = await stripeCheckoutSuccess(sessionId);

        if (res.data.success) {
          setMessage("Payment successful! Redirecting...");
        } else {
          setMessage("Payment succeeded but contribution failed.");
        }
      } catch (err) {
        console.error("Stripe success API failed", err);
        setMessage("Payment could not be verified.");
      } finally {
         setTimeout(() => navigate("/tontine-contributions"), 5000);
      }
    };

    stripeCheckout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      <p>{message}</p>
    </div>
  );
}
