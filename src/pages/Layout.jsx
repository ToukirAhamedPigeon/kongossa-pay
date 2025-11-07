// ✅ src/pages/Layout.jsx
import React, { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Wallet,
  Settings,
  Users,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { logoutUser } from "@/api/auth";
import { showLoader, hideLoader } from "@/store/loaderSlice";
import { showToast } from "@/store/toastSlice";
import { logout, refreshAccessToken } from "@/store/authSlice";
import { LanguageProvider } from "@/components/common/LanguageProvider";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, accessToken, loading } = useSelector((state) => state.auth);

  // 🔁 Refresh token on mount
  useEffect(() => {
    dispatch(refreshAccessToken());
  }, [dispatch]);

  // 🌐 Public pages
  const marketingPages = [
    "Home",
    "Personal",
    "Business",
    "Agent",
    "About",
    "Support",
    "Privacy",
    "Terms",
    "Login",
    "Register",
    "PublicInvitation",
  ];
  const currentPageName = location.pathname.replace(/\//g, "") || "Home";
  const isMarketingPage = marketingPages.includes(currentPageName);

  // 🚪 Logout
  const handleLogout = async () => {
    dispatch(showLoader({ message: "Logging out..." }));
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      dispatch(
        showToast({
          message:
            err?.response?.data?.message || err.message || "Logout failed.",
          type: "danger",
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  // 🧭 Sidebar Navigation (role-based)
  const userNavItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Wallet", url: "/wallet", icon: Wallet },
    {
      title: "Budgets",
      icon: FileText,
      children: [
        { title: "All Budgets", url: "/budgets", icon: FileText },
        { title: "Categories", url: "/budgets/categories", icon: FileText },
      ],
    },
    { title: "Expenses", url: "/expenses", icon: FileText },
    {
      title: "Admin",
      icon: Users,
      children: [
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Roles", url: "/admin/roles", icon: Users },
        { title: "Fees", url: "/admin/fees", icon: Users },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      children: [
        { title: "Profile", url: "/profile", icon: Settings },
        { title: "Password", url: "/password", icon: Settings },
        { title: "Appearance", url: "/appearance", icon: Settings },
      ],
    },
  ];

  // ⏳ Loading State
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  // 🌍 Public layout
  if (isMarketingPage) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-white">
          <header className="sticky top-0 bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <div className="flex items-center gap-4">
                {!accessToken || !user ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </LanguageProvider>
    );
  }

  // 🔐 Authenticated Layout
  if (!user) return null;

  return (
    <LanguageProvider>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r p-6 hidden md:block">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <img
              src={user?.profileImage || `https://avatar.vercel.sh/${user.email}`}
              alt={user.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.fullName}</p>
              <Badge>{user.role}</Badge>
            </div>
          </div>

          <nav>
            <ul className="space-y-1">
              {userNavItems.map((item) => (
                <li key={item.title}>
                  {item.children ? (
                    <div>
                      <div className="flex items-center gap-3 px-3 py-2 font-semibold text-gray-800">
                        <item.icon className="w-5 h-5" /> {item.title}
                      </div>
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              to={sub.url}
                              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                                location.pathname === sub.url
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-blue-50"
                              }`}
                            >
                              <sub.icon className="w-4 h-4" /> {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                        location.pathname === item.url
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" /> {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </LanguageProvider>
  );
}
