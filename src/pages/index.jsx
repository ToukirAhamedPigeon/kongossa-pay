import Layout from "./Layout.jsx";

import LoginPage from "./Login";
import RegisterPage from "./Register";
import OTPVerificationPage from "./OTPVerification";
// import SetPasswordPage from "./SetPassword";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";



import Dashboard from "./Dashboard";

import Wallet from "./Wallet";

import Budgets from "./Budgets.jsx";

import CreateBudget from "./CreateBudget.jsx";

import BudgetDetail from "./BudgetDetail.jsx";
import BudgetEdit from "./BudgetEdit.jsx";

import BudgetCategoryList from "./BudgetCategoryList.jsx";
import BudgetCategoryEdit from "./BudgetCategoryEdit.jsx";
import BudgetCategoryCreate from "./BudgetCategoryCreate.jsx";
import BudgetCategoryShow from "./BudgetCategoryShow.jsx";

import ExpensesList from "./ExpensesList.jsx"
import ExpenseCreate from "./ExpenseCreate.jsx"



import SendMoney from "./SendMoney";

import Tontine from "./Tontine";
import TontineCreate from "./TontineCreate";
import TontineEdit from "./TontineEdit";
import TontinesList from "./TontinesList";
import TontineInvite from "./TontineInvite";
import PublicInvitation from "./PublicInvitation";

import UserList from "./UserList";
import UserCreate from "./UserCreate";
import UserEdit from "./UserEdit";
import UserShow from "./UserShow";

import RoleList from "./RoleList";

import CheckoutSuccess from "./CheckoutSuccess";



import Profile from "./Profile";
import Password from "./Password.jsx";
import Appearance from "./Appearance.jsx";

import Home from "./Home";

import Personal from "./Personal";

import Business from "./Business";

import Agent from "./Agent";

import About from "./About";

import Support from "./Support";

import AdminFeeManagement from "./AdminFeeManagement";

import ApiAccess from "./ApiAccess";

import CurrencyExchange from "./CurrencyExchange";

import CryptoExchange from "./CryptoExchange";

import History from "./History";

import AgentCRM from "./AgentCRM";

import AgentDashboard from "./AgentDashboard";

import Onboarding from "./Onboarding";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Login: LoginPage,

    Register: RegisterPage,
    
    OTPVerification: OTPVerificationPage,
    
    // SetPassword: SetPasswordPage,
    
    ResetPassword: ResetPassword,
    
    ForgotPassword: ForgotPassword,
    
    Dashboard: Dashboard,
    
    Wallet: Wallet,
    Budgets: Budgets,
    CreateBudget: CreateBudget,
    BudgetDetail:BudgetDetail,
    BudgetEdit:BudgetEdit,
    
    SendMoney: SendMoney,
    
    UserList: UserList,
    UserCreate:UserCreate,
    UserEdit:UserEdit,
    UserShow:UserShow,

    
    RoleList: RoleList,
    
    CheckoutSuccess: CheckoutSuccess,
    
    Tontine: Tontine,
    TontineCreate:TontineCreate,
    TontineEdit:TontineEdit,
    TontinesList:TontinesList,
    TontineInvite:TontineInvite,
    PublicInvitation:PublicInvitation,
    
    Profile: Profile,
    Password: Password,
    Appearance: Appearance,
    
    Home: Home,
    
    Personal: Personal,
    
    Business: Business,
    
    Agent: Agent,
    
    About: About,
    
    Support: Support,
    
    AdminFeeManagement: AdminFeeManagement,
    
    ApiAccess: ApiAccess,
    
    CurrencyExchange: CurrencyExchange,
    
    CryptoExchange: CryptoExchange,
    
    History: History,
    
    AgentCRM: AgentCRM,
    
    AgentDashboard: AgentDashboard,
    
    Onboarding: Onboarding,

    BudgetCategoryList: BudgetCategoryList,
    BudgetCategoryEdit: BudgetCategoryEdit,
    BudgetCategoryCreate: BudgetCategoryCreate,
    BudgetCategoryShow: BudgetCategoryShow,



    ExpensesList: ExpensesList,
    ExpenseCreate: ExpenseCreate,



}

function _getCurrentPage(url) {
  const cleanUrl = url.replace(/\/+$/, "").split("?")[0];
  const urlLastPart = cleanUrl.split("/").pop();

  if (!urlLastPart || urlLastPart === "") return "Home";

  const pageName = Object.keys(PAGES).find(
    page => page.toLowerCase() === urlLastPart.toLowerCase()
  );

  return pageName || "Home";
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<OTPVerificationPage />} />
                {/* <Route path="/SetPassword" element={<SetPasswordPage />} /> */}
                
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Wallet" element={<Wallet />} />
                <Route path="/Budgets" element={<Budgets />} />
                <Route path="/CreateBudget" element={<CreateBudget />} />
                <Route path="/budgets/:id/edit" element={<BudgetEdit />} />
                <Route path="/budgets/:id" element={<BudgetDetail />} />

                <Route path="/Tontine" element={<Tontine />} />
                <Route path="/TontineCreate" element={<TontineCreate />} />
                <Route path="/tontines/:id/edit" element={<TontineEdit />} />
                <Route path="/TontinesList" element={<TontinesList />} />
                <Route path="/TontineInvite" element={<TontineInvite />} />
                <Route path="/PublicInvitation" element={<PublicInvitation />} />
                
                <Route path="/UserList" element={<UserList />} />
                <Route path="/UserCreate" element={<UserCreate />} />
                <Route path="/users/:id/edit" element={<UserEdit />} />
                <Route path="/users/:id" element={<UserShow />} />

                <Route path="/RoleList" element={<RoleList />} />                
                
                <Route path="/CheckoutSuccess" element={<CheckoutSuccess />} />
                
                 <Route path="/BudgetCategoryList" element={<BudgetCategoryList />} />

                 <Route path="/ExpensesList" element={<ExpensesList />} />
                
                <Route path="/SendMoney" element={<SendMoney />} />
                
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Password" element={<Password />} />
                <Route path="/Appearance" element={<Appearance />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Personal" element={<Personal />} />
                
                <Route path="/Business" element={<Business />} />
                
                <Route path="/Agent" element={<Agent />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/AdminFeeManagement" element={<AdminFeeManagement />} />
                
                <Route path="/ApiAccess" element={<ApiAccess />} />
                
                <Route path="/CurrencyExchange" element={<CurrencyExchange />} />
                
                <Route path="/CryptoExchange" element={<CryptoExchange />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/AgentCRM" element={<AgentCRM />} />
                
                <Route path="/AgentDashboard" element={<AgentDashboard />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}