import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { resendOtp, verifyOtp } from "../api/auth";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser, setRefreshTokenExpires } from "@/store/authSlice";
import { showToast } from "@/store/toastSlice"; 

export default function OTPVerificationPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = params.get("email");
  const purpose = params.get("purpose") || "register";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // ✅ Removed local toast state — now handled globally via Redux
  const handleResendOtp = async () => {
    setErrorMessage("");
    setResendLoading(true);
    try {
      await resendOtp(email, purpose);
      // ✅ Trigger global success toast
      dispatch(
        showToast({
          type: "success",
          message: "A new OTP has been sent to your email",
          position: "top-right",
          animation: "slide-right-in",
          duration: 4000,
        })
      );
    } catch (err) {
      const msg = err?.response?.data?.message?.message || "Failed to resend OTP.";
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

  async function handleVerify() {
    setErrorMessage("");
    setLoading(true);
    try {
      const resp = await verifyOtp({
        email,
        code: otp,
        purpose,
      });

      console.log(resp);

      if (resp.message?.toLowerCase().includes("success")) {
        // ✅ Update Redux auth state
        if (resp.accessToken) dispatch(setAccessToken(resp.accessToken));
        if (resp.user) dispatch(setUser(resp.user));
        if (resp.refreshTokenExpires)
          dispatch(setRefreshTokenExpires(resp.refreshTokenExpires));

        // ✅ Success toast
        // dispatch(
        //   showToast({
        //     type: "success",
        //     message: "OTP verified successfully!",
        //     position: "top-center",
        //     animation: "slide-down-in",
        //     duration: 3000,
        //   })
        // );

        setVerified(true);
        setTimeout(() => {
          if (purpose === "login") navigate("/Dashboard");
          else navigate("/Login");
        }, 1500);
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message?.message || "Verification failed.";
      setErrorMessage(msg);

      // ✅ Show error toast only for server/internet issue
      if (msg.toLowerCase().includes("failed") || msg.toLowerCase().includes("network")) {
        dispatch(
          showToast({
            type: "danger",
            message: msg,
            position: "top-right",
            animation: "slide-right-in",
          })
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f7f9] flex items-center justify-center p-6 relative">
      {/* ✅ Removed local AnimatePresence toast, now global ToastContainer handles it */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8"
      >
        {!verified ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden -mt-12 mb-4 shadow-md flex items-center justify-center bg-green-600">
                <ShieldCheck className="text-white w-12 h-12" />
              </div>

              <h1 className="text-2xl font-extrabold text-[#0b1226] text-center leading-tight">
                Verify Your Email
                <br />
                <span className="inline-block text-lg font-bold">
                  Enter the OTP sent to {email}
                </span>
              </h1>
              <p className="text-sm text-[#6b7280] mt-2 text-center">
                Please check your inbox or spam folder
              </p>
            </div>

            {/* OTP Form */}
            <div className="mt-6 space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9] focus:border-transparent shadow-sm tracking-widest text-center text-lg font-semibold"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={handleVerify}
                className={`w-full py-3 rounded-xl text-white font-medium mt-4 shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] ${
                  loading
                    ? "bg-[#101827] opacity-80 cursor-not-allowed"
                    : "bg-[#0b1226] hover:brightness-105"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>

              {errorMessage && (
                <div className="mt-3 text-sm text-red-600 text-center">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="text-sm text-[#6b7280] mt-6 text-center">
              Didn’t receive the code?{" "}
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className={`text-[#0b1226] font-medium ${
                  resendLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </>
        ) : (
          // ✅ Success Animation
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center py-16"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
              <motion.span
                className="absolute inset-0 rounded-full bg-green-400/30 blur-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: 0 }}
              />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#0b1226]">OTP Verified!</h2>
            <p className="text-[#6b7280] mt-2 text-sm">
              Redirecting you to the next step...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
