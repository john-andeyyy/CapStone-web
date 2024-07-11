import Footer from "./Guest/GuestComponents/Footer";
import GuestNavBar from "./Guest/GuestNavigation/GuestNavBar";
import LandingPage from "./Guest/GuestPages/LandingPage";


function App() {

  return (
    <div id="Parent" className="bg-base-200">
      <div className="sticky top-0 z-10"> <GuestNavBar /></div>
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;
