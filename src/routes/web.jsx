import { group } from "./helpers";

// Public pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import OTPVerification from "@/pages/OTPVerification";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Support from "@/pages/Support";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

// Authenticated pages
import Dashboard from "@/pages/Dashboard";
import Wallet from "@/pages/Wallet";
import Budgets from "@/pages/Budgets";
import CreateBudget from "@/pages/CreateBudget";
import BudgetEdit from "@/pages/BudgetEdit";
import BudgetDetail from "@/pages/BudgetDetail";
import BudgetCategoryList from "@/pages/BudgetCategoryList";
import BudgetCategoryCreate from "@/pages/BudgetCategoryCreate";
import BudgetCategoryEdit from "@/pages/BudgetCategoryEdit";
import ExpensesList from "@/pages/ExpensesList";
import ExpenseCreate from "@/pages/ExpenseCreate";
import UserList from "@/pages/UserList";
import UserCreate from "@/pages/UserCreate";
import UserEdit from "@/pages/UserEdit";
import RoleList from "@/pages/RoleList";
import Profile from "@/pages/Profile";
import Password from "@/pages/Password";
import Appearance from "@/pages/Appearance";
import AdminFeeManagement from "@/pages/AdminFeeManagement";

// 🧭 Static Laravel-style routes
export const routes = [
  // 🔓 Public Routes
  { path: "/", element: <Home />, name: "Home", middleware: ["guest"] },
  { path: "/login", element: <Login />, name: "Login", middleware: ["guest"] },
  { path: "/register", element: <Register />, name: "Register", middleware: ["guest"] },
  { path: "/verify-otp", element: <OTPVerification />, name: "Verify OTP", middleware: ["guest"] },
  { path: "/forgot-password", element: <ForgotPassword />, name: "Forgot Password", middleware: ["guest"] },
  { path: "/reset-password", element: <ResetPassword />, name: "Reset Password", middleware: ["guest"] },
  { path: "/about", element: <About />, name: "About", middleware: ["guest"] },
  { path: "/support", element: <Support />, name: "Support", middleware: ["guest"] },
  { path: "/unauthorized", element: <Unauthorized />, name: "Unauthorized", middleware: ["guest"] },

  // 🔐 Authenticated routes (wrapped in auth middleware)
  ...group({ middleware: ["auth"] }, [
    // Dashboard & Settings
    { path: "/dashboard", element: <Dashboard />, name: "Dashboard", permissions: ["read:dashboard"] },
    { path: "/wallet", element: <Wallet />, name: "Wallet", permissions: ["read:dashboard"] },
    { path: "/profile", element: <Profile />, name: "Profile", permissions: ["read:dashboard"] },
    { path: "/password", element: <Password />, name: "Password", permissions: ["read:dashboard"] },
    { path: "/appearance", element: <Appearance />, name: "Appearance", permissions: ["read:dashboard"] },

    // Budgets
    { path: "/budgets", element: <Budgets />, name: "Budgets", permissions: ["read:dashboard"] },
    { path: "/budgets/create", element: <CreateBudget />, name: "CreateBudget", permissions: ["read:dashboard"] },
    { path: "/budgets/:id/edit", element: <BudgetEdit />, name: "BudgetEdit", permissions: ["read:dashboard"] },
    { path: "/budgets/:id", element: <BudgetDetail />, name: "BudgetDetail", permissions: ["read:dashboard"] },
    { path: "/budgets/categories", element: <BudgetCategoryList />, name: "BudgetCategoryList", permissions: ["read:dashboard"] },
    { path: "/budgets/categories/create", element: <BudgetCategoryCreate />, name: "BudgetCategoryCreate", permissions: ["read:dashboard"] },
    { path: "/budgets/categories/:id/edit", element: <BudgetCategoryEdit />, name: "BudgetCategoryEdit", permissions: ["read:dashboard"] },

    // Expenses
    { path: "/expenses", element: <ExpensesList />, name: "ExpensesList", permissions: ["read:dashboard"] },
    { path: "/expenses/create", element: <ExpenseCreate />, name: "ExpenseCreate", permissions: ["read:dashboard"] },

    // Admin
    { path: "/admin/users", element: <UserList />, name: "UserList", permissions: ["read:dashboard"] },
    { path: "/admin/users/create", element: <UserCreate />, name: "UserCreate", permissions: ["read:dashboard"] },
    { path: "/admin/users/:id/edit", element: <UserEdit />, name: "UserEdit", permissions: ["read:dashboard"] },
    { path: "/admin/roles", element: <RoleList />, name: "RoleList", permissions: ["read:dashboard"] },
    { path: "/admin/fees", element: <AdminFeeManagement />, name: "AdminFeeManagement", permissions: ["read:dashboard"] },
  ]),

  // 🚫 404
  { path: "*", element: <NotFound />, name: "NotFound", middleware: ["guest"] },
];
