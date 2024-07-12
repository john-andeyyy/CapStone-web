import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  const isLogin = localStorage.getItem('Islogin');

  return (
    <Router>
      {isLogin ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-0 md:ml-60">
            <div className='text-center'>
              <ThemeController />
            </div>

            <div className="p-8 flex-1">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/add_procedure" element={<Add_Procedure />} />
              </Routes>
            </div>
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