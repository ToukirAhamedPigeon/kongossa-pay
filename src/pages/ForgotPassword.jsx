import { useState } from "react";
import { motion } from "framer-motion";
import { Unlock, CheckCircle2 } from "lucide-react";
import { sendForgotPassword } from "../api/auth";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/toastSlice"; // ✅ new import

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSend = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await sendForgotPassword(email);
      setSuccess(true);

      dispatch(
        showToast({
          type: "success",
          message: res.message || "Reset link sent successfully!",
          position: "top-right",
          animation: "slide-right-in",
          duration: 4000,
        })
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message?.message || "Failed to send reset email.";
      setErrorMessage(msg);

      dispatch(
        showToast({
          type: "danger",
          message: msg,
          position: "top-right",
          animation: "slide-right-in",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setResendLoading(true);
    try {
      const res = await sendForgotPassword(email);
      dispatch(
        showToast({
          type: "success",
          message: res.message || "New reset link sent!",
          position: "top-right",
          animation: "slide-right-in",
        })
      );
    } catch (err) {
      const msg =
        err?.response?.data?.message?.message || "Failed to resend email.";
      setErrorMessage(msg);
      dispatch(
        showToast({
          type: "danger",
          message: msg,
          position: "top-right",
          animation: "slide-right-in",
        })
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f9] flex items-center justify-center p-6 relative">
      {/* ✅ Global toast system handles toasts */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden -mt-12 mb-4 shadow-md flex items-center justify-center bg-red-600">
            <Unlock className="text-white w-12 h-12" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#0b1226] text-center leading-tight">
            Forgot Password
          </h1>
          <p className="text-sm text-[#6b7280] mt-2 text-center">
            Enter your registered email to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9] focus:border-transparent shadow-sm"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading || !email}
            onClick={success ? handleResend : handleSend}
            className={`w-full py-3 rounded-xl text-white font-medium mt-4 shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] ${
              loading
                ? "bg-[#101827] opacity-80 cursor-not-allowed"
                : "bg-[#0b1226] hover:brightness-105"
            }`}
          >
            {!success
              ? loading
                ? "Sending..."
                : "Send Reset Link"
              : resendLoading
              ? "Resending..."
              : "Resend Reset Link"}
          </motion.button>

          {errorMessage && (
            <div className="mt-3 text-sm text-red-600 text-center">
              {errorMessage}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
