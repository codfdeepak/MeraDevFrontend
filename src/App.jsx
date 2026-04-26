import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/AppLayout";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Enquiry from "./pages/Enquiry";
import Home from "./pages/Home";
import Partners from "./pages/Partners";
import PaymentPolicy from "./pages/PaymentPolicy";
import ProfileDetails from "./pages/ProfileDetails";
import Projects from "./pages/Projects";
import ServiceCategoryPage from "./pages/ServiceCategoryPage";
import ServiceDetails from "./pages/ServiceDetails";
import Services from "./pages/Services";
import Technologies from "./pages/Technologies";

function AppShell() {
  return (
    <>
      <AppLayout />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/category" element={<Navigate to="/services" replace />} />
        <Route path="/services/category/:categoryKey" element={<ServiceCategoryPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/payment-policy" element={<PaymentPolicy />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/technologies" element={<Technologies />} />
        <Route path="/profile/:userId" element={<ProfileDetails />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
