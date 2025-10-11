import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser as loginApi } from "../api/auth"; // updated import
import { setAccessToken, setUser } from "../store/authSlice";
import * as z from "zod";
import PasswordInput from "./../components/common/PasswordInput";
import { showToast } from "@/store/toastSlice";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const [errorMessage, setErrorMessage] = useState("");

 const onSubmit = async (values) => {
  setErrorMessage("");
  setLoading(true); // ✅ start loading
  try {
    const data = await loginApi(values);

    if (data.otp_required) {
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}&purpose=login`);
    } else {
      dispatch(setUser(data.userInfo));
      dispatch(setAccessToken(data.accessToken));
      dispatch(
        showToast({type: "success",message: "Login Successful!",position: "top-right",animation: "slide-right-in",duration: 4000,})
      );
      navigate("/dashboard");
    }
  } catch (err) {
    console.error(err);
    const msg = err?.response?.data?.message?.message || err?.message || "Login failed";
    dispatch(showToast({ message: msg, type: "danger", duration:10000 }));
    setErrorMessage(msg);
  } finally {
    setLoading(false); // ✅ stop loading
  }
};

  return (
    <div className="min-h-screen bg-[#f3f7f9] flex items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8"
        style={{ boxShadow: "0 14px 30px rgba(3,16,28,0.08)" }}
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden -mt-12 mb-4 shadow-md flex items-center justify-center bg-blue-600">
            <Wallet className="text-white w-12 h-12" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b1226] text-center leading-tight">
            Welcome to Kongossa-Pay
            <br />
            <span className="inline-block text-lg font-bold">
              The Future of Digital Payments
            </span>
          </h1>
          <p className="text-sm text-[#6b7280] mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <label className="block text-sm font-medium text-[#475569] mb-2">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:outline-none focus:ring-2 focus:ring-[#e6eef9] focus:border-transparent shadow-sm"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}

          <label className="block text-sm font-medium text-[#475569] mt-4 mb-2">Password</label>
          <PasswordInput register={register} name="password" />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}

          <motion.button
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading} // ✅ disable while loading
            className={`w-full py-3 rounded-xl text-white font-medium mt-6 shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] ${
              loading ? "bg-[#101827] opacity-80 cursor-not-allowed" : "bg-[#0b1226] hover:brightness-105"
            }`}
          >
            {loading ? "Signing In..." : "Sign in"} {/* ✅ text change */}
          </motion.button>

          {errorMessage && <div className="mt-4 text-sm text-center text-red-600">{errorMessage}</div>}

          <div className="flex items-center justify-between mt-4 text-sm">
            <button
              type="button"
              className="text-[#0b5ed7] font-medium px-3 py-1 rounded"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
            <div className="text-[#6b7280]">
              Need an account?{" "}
              <Link to="/register" className="text-[#0b1226] font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
