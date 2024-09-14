import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './Guest/GuestComponents/Footer';
import GuestNavBar from "./Guest/GuestNavigation/GuestNavBar";
import CreateAccount from "./Guest/GuestPages/CreateAccount";
import LandingPage from "./Guest/GuestPages/LandingPage";
import AdminLogin from './Guest/GuestPages/AdminLogin';
import Sidebar from './AdminDashBoard/SideBard';
import Dashboard from './AdminDashBoard/Components/Dashboard';
import ThemeController from './Guest/GuestComponents/ThemeController';
import Patients from './AdminDashBoard/Pages/Patients';
import Add_Procedure from './AdminDashBoard/Pages/Add_Procedure';
import Medical_requests from './AdminDashBoard/Pages/Medical_requests';
import Colorpallete from './Colorpallete';
import ProfilePage from './AdminDashBoard/Pages/ProfilePage';
import PatientProfile from './AdminDashBoard/Pages/PatientProfile ';
import Tooth2d from './try/Tooth2d';
import Appointment from './AdminDashBoard/Pages/Appointments';
import AppointmentDetail from './AdminDashBoard/Pages/AppointmentDetails';
import { useState, useEffect } from 'react';
import NotificationComponent from './AdminDashBoard/Pages/NotificationComponent'
import Dentist from './AdminDashBoard/Pages/Dentist';

function AdminRoutes() {
  const location = useLocation();
  const isProfilePage = location.pathname === "/ProfilePage";

  const [isExpired, setIsExpired] = useState(false);
  // Function to check if the time has expired
  function checkExpiration() {
    const timeout = parseInt(localStorage.getItem('expiresin'), 10);
    const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10);
    const expirationTime = lastActiveTime + timeout * 1000;

    if (new Date().getTime() >= expirationTime) {
      console.log('1 hour has passed since your last activity.');
      setIsExpired(true);
    }
  }

  // Event listeners to reset last active time and check expiration
  useEffect(() => {
    const handleActivity = () => {
      checkExpiration();
      const currentTime = new Date().getTime();
      localStorage.setItem('lastActiveTime', currentTime);
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);

    // Initial check when the component mounts
    checkExpiration();

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, []);

  return (
    <div className={`flex-1 ${isProfilePage ? '' : 'p-8'}`}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/add_procedure" element={<Add_Procedure />} />
        <Route path="/medical_requests" element={<Medical_requests />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/PatientProfile/:id" element={<PatientProfile />} />
        <Route path="/appointment/:id" element={<AppointmentDetail />} />
        <Route path="/Dentist" element={<Dentist />} />
      </Routes>
    </div>
  );
}

function App() {
  const [isExpired, setIsExpired] = useState(false);
  const isLogin = localStorage.getItem('Islogin');

  useEffect(() => {
    const timeout = parseInt(localStorage.getItem('expiresin'), 10);
    const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime'), 10);
    const expirationTime = lastActiveTime + timeout * 1000;

    if (new Date().getTime() >= expirationTime) {
      setIsExpired(true);
      localStorage.clear()
    }
  }, []);


  return (
    // <>
    //   <NotificationComponent/>
    // </>
    <Router>
      {isLogin && !isExpired ? (
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
