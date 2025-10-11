import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Key, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../api/auth";
import PasswordInput from "./../components/common/PasswordInput";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/toastSlice"; // ✅ new import

const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must match password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (values) => {
    setLoading(true);
    setErrorMessage("");

    try {
      await resetPassword(token, values.password);
      setSuccess(true);

      // ✅ Success toast
    //   dispatch(
    //     showToast({
    //       type: "success",
    //       message: "Password reset successful! Redirecting to login...",
    //       position: "top-center",
    //       animation: "slide-down-in",
    //       duration: 4000,
    //     })
    //   );

      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      const msg = err?.response?.data?.message?.message || "Password reset failed.";
      setErrorMessage(msg);

      // ✅ Error toast for server/network issues
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

  return (
    <div className="min-h-screen bg-[#f3f7f9] flex items-center justify-center p-6 relative">
      {/* ✅ Toast handled globally */}

      {/* ✅ Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8"
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden -mt-12 mb-4 shadow-md flex items-center justify-center bg-blue-600">
                <Key className="text-white w-12 h-12" />
              </div>

              <h1 className="text-2xl font-extrabold text-[#0b1226] text-center leading-tight">
                Reset Your Password
              </h1>
              <p className="text-sm text-[#6b7280] mt-2 text-center">
                Enter and confirm your new password below.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">
                  New Password
                </label>
                <PasswordInput register={register} name="password" />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">
                  Confirm Password
                </label>
                <PasswordInput register={register} name="confirmPassword" />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-medium mt-4 shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] transition ${
                  loading
                    ? "bg-[#101827] opacity-80 cursor-not-allowed"
                    : "bg-[#0b1226] hover:brightness-105"
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </motion.button>

              {errorMessage && (
                <div className="text-sm text-red-600 text-center mt-2">
                  {errorMessage}
                </div>
              )}
            </form>
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
            <h2 className="text-2xl font-bold text-[#0b1226]">
              Password Reset Successful!
            </h2>
            <p className="text-[#6b7280] mt-2 text-sm">
              Redirecting you to login page...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
