import '../custom.css'; /* Import your custom file */

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
// import Tooth2d from './try/Tooth2d';
import Tooth2d from './AdminDashBoard/Components/Tooth2d';
import Appointment from './AdminDashBoard/Pages/Appointments';
import AppointmentDetail from './AdminDashBoard/Pages/AppointmentDetails';
import { useState, useEffect } from 'react';
import Notification_bell from './AdminDashBoard/Components/Notification_bell'
import NotificationPage from './AdminDashBoard//Components/NotificationPage';
import Dentist from './AdminDashBoard/Pages/Dentist';
import AnnouncementPage from './AdminDashBoard/Components/AnnouncementPage';
import Annoucement_Notification from './AdminDashBoard/Pages/Annoucement_Notification';
import ToastNotification from './AdminDashBoard/Components/ToastNotification';


import CalendarComponent from './try/Calendar';
import AllServices from './Guest/GuestPages/AllServices';
import The_DeanTeam from './Guest/GuestComponents/The_DeanTeam';
import OurService from './Guest/GuestComponents/OurService';
import AddGroupMember from './Landing-infopage/GroupMembers/AddGroupMember';
import Grouplist from './Landing-infopage/GroupMembers/Grouplist';
import DentistSchedule from './AdminDashBoard/Components/Dentist/DentistsSchedule';
import Total_procedures from './AdminDashBoard/Pages/ReportPages/Pages/Total_procedures';
import Report_Monthly_Appointment from './AdminDashBoard/Pages/ReportPages/Pages/Report_Monthly_Appointment';
import ShowChart from './try/ShowChart';
import Patient_Visits from './AdminDashBoard/Pages/ReportPages/Pages/Patient_Visits';
import Contactus_Crud from './Landing-infopage/Contact_us/Contactus_Crud';
import Hero_Crud from './Landing-infopage/LandingPage_Hero/Hero_Crud';
import Forget_pass from './Guest/GuestPages/Forget_pass';

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
    <div className={`flex-1 ${isProfilePage ? '' : 'p-8 pt-0.5'}`}>
      <Notification_bell />
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
        <Route path="/Annoucement_Notification" element={<Annoucement_Notification />} />
        <Route path="/admindashboard" element={<Dashboard />} />
        <Route path="/CalendarComponent" element={<CalendarComponent />} />
        <Route path="/DentistSchedule/:id" element={<DentistSchedule />} />

        {/* //! REPORTS */}
        <Route path="/Total_procedures" element={< Total_procedures />} />
        <Route path="/Report_Monthly_Appointment" element={< Report_Monthly_Appointment />} />
        <Route path="/Patient_Visits" element={< Patient_Visits />} />

        {/* //! components only! */}
        <Route path="/NotificationPage" element={<NotificationPage />} />
        <Route path="/AnnouncementPage" element={<AnnouncementPage />} />


        {/*//! edit of the info page and landing Pages */}
        <Route path="/AddGroupMember" element={<AddGroupMember />} />
        <Route path="/Grouplist" element={<Grouplist />} />
        <Route path="/Contactus_edit" element={<Contactus_Crud />} />
        <Route path="/Hero_edit" element={<Hero_Crud />} />


        {/* //! palyground */}

        <Route path="/Chart" element={<ShowChart />} />



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
    //   <Notification_bell/>
    // </>
    <Router>
      <div className="hidden">
        <ThemeController />
      </div>
      <ToastNotification />
      
      {isLogin && !isExpired ? (
        <div className="flex flex-col md:flex-row">
          <Sidebar />
          <div className="flex-1 ml-0 md:ml-42 lg:ml-60">
            <AdminRoutes />
          </div>
        </div>

      ) : (
        <>
          <div className="sticky top-0 z-10">
            <GuestNavBar />
              {alert(import.meta.env.VITE_BASEURL)}
          </div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/admindashboard" element={<Dashboard />} />
            <Route path="/AllServices" element={<AllServices />} />
            <Route path="/The_DeanTeam" element={<The_DeanTeam />} />
              <Route path="/Forget_pass" element={<Forget_pass />} />

          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
