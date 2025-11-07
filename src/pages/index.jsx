import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import { routes } from "@/routes/web";

export default function AppRouter() {
  const publicRoutes = routes.filter((r) => r.middleware?.includes("guest"));
  const protectedRoutes = routes.filter((r) => r.middleware?.includes("auth"));
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<Layout />}>
          {publicRoutes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Authenticated Pages inside Layout */}
        <Route element={<Layout />}>
          {protectedRoutes.map((route, i) => (
            <Route key={i} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
