import React, { useEffect, useState } from "react";
import Pages from "@/pages/index.jsx"; // your router with Layout
import GlobalLoader from "@/components/common/GlobalLoader";
import ToastContainer from "@/components/common/ToastContainer";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "@/store/authSlice";
import useNetworkToast from "@/utils/useNetworkToast";

export default function App() {
  useNetworkToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const authLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap();
      } catch (err) {
        console.log("Token refresh failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <GlobalLoader />
      <Pages />
      <ToastContainer />
      <Toaster />
    </>
  );
}
