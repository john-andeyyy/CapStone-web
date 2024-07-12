import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './Guest/GuestComponents/Footer'
import GuestNavBar from "./Guest/GuestNavigation/GuestNavBar";
import CreateAccount from "./Guest/GuestPages/CreateAccount";
import LandingPage from "./Guest/GuestPages/LandingPage";
import AdminLogin from './Pages/AdminLogin';


function App() {

  return (
    <>
      <Router>
        <div className="sticky top-0 z-10"> <GuestNavBar /></div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/CreateAccount" element={<CreateAccount />} /> //! walang create kasi admin side lang ang web
          <Route path="/AdminLogin" element={<AdminLogin/> }/>
        </Routes>
      </Router>
      <Footer />
    </>
    // <div id="Parent" className="bg-base-200">
    //   {/* <LandingPage /> */}
    //   <CreateAccount />
    // </div>
  );
}

export default App;
