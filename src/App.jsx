import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './Guest/GuestComponents/Footer';
import GuestNavBar from "./Guest/GuestNavigation/GuestNavBar";
import CreateAccount from "./Guest/GuestPages/CreateAccount";
import LandingPage from "./Guest/GuestPages/LandingPage";
import AdminLogin from './Pages/AdminLogin';
import Sidebar from './AdminDashBoard/SideBard';
import Dashboard from './AdminDashBoard/Components/Dashboard';
import ThemeController from './Guest/GuestComponents/ThemeController';
import Patients from './AdminDashBoard/Pages/Patients';
import Add_Procedure from './AdminDashBoard/Pages/Add_Procedure';
import Medical_requests from './AdminDashBoard/Pages/Medical_requests';
import Colorpallete from './Colorpallete';
import ProfilePage from './AdminDashBoard/Pages/ProfilePage';

function AdminRoutes() {
  const location = useLocation();
  const isProfilePage = location.pathname === "/ProfilePage";

  return (
    <div className={`flex-1 ${isProfilePage ? '' : 'p-8'}`}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/add_procedure" element={<Add_Procedure />} />
        <Route path="/medical_requests" element={<Medical_requests />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

function App() {
  const isLogin = localStorage.getItem('Islogin');

  return (
    <Router>
      {/* <div className='text-center'><Colorpallete /><ThemeController /></div> */}
      {isLogin ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-0 md:ml-60">
            <AdminRoutes />
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-10">
            <GuestNavBar />
          </div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
