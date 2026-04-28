import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { startWebAnalyticsTracking, trackPageView } from "./analytics/webAnalytics";
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

const resolveRouteAnalyticsMeta = (pathname) => {
  const cleanPath = String(pathname || "").trim() || "/";
  if (cleanPath.startsWith("/services/category/")) {
    return {
      routeKey: "service_category",
      categoryKey: cleanPath.split("/")[3] || "",
    };
  }
  if (cleanPath === "/services") {
    return { routeKey: "services" };
  }
  if (cleanPath.startsWith("/services/")) {
    return {
      routeKey: "service_details",
      serviceId: cleanPath.split("/")[2] || "",
    };
  }
  if (cleanPath === "/partners") return { routeKey: "partners" };
  if (cleanPath === "/contact-us") return { routeKey: "contact_us" };
  if (cleanPath === "/projects") return { routeKey: "projects" };
  if (cleanPath === "/about-us") return { routeKey: "about_us" };
  if (cleanPath === "/technologies") return { routeKey: "technologies" };
  if (cleanPath === "/enquiry") return { routeKey: "enquiry" };
  if (cleanPath === "/payment-policy") return { routeKey: "payment_policy" };
  if (cleanPath.startsWith("/profile/")) return { routeKey: "partner_profile" };
  return { routeKey: "home" };
};

function AppShell() {
  return (
    <>
      <AppLayout />
      <Footer />
    </>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const stopTracking = startWebAnalyticsTracking();
    return () => stopTracking();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search || ""}`;
    trackPageView(path, {
      route: location.pathname,
      ...resolveRouteAnalyticsMeta(location.pathname),
      hash: location.hash || "",
    });
  }, [location.pathname, location.search, location.hash]);

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
