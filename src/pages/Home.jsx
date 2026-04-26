import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConsultationModal from "../components/ConsultationModal";
import Hero from "../components/Hero";
import PageFrame from "../components/PageFrame";
import PartnerMarquee from "../components/PartnerMarquee";
import TechnologiesSection from "../components/TechnologiesSection";
import Projects from "./Projects";
import Services from "./Services";
import {
  selectPartners,
  selectPartnersError,
  selectPartnersStatus,
} from "../Redux/slices/partnerSlice";
import { fetchPartners } from "../Redux/thunks/partnerThunks";

function Home() {
  const dispatch = useDispatch();
  const partners = useSelector(selectPartners);
  const partnersStatus = useSelector(selectPartnersStatus);
  const partnersError = useSelector(selectPartnersError);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");

  useEffect(() => {
    if (partnersStatus === "idle") {
      dispatch(fetchPartners());
    }
  }, [dispatch, partnersStatus]);

  const openConsultationForm = (serviceName = "") => {
    setSelectedServiceName(serviceName);
    setIsConsultationOpen(true);
  };

  return (
    <PageFrame id="home">
      <Hero onDiscuss={openConsultationForm} />
      <PartnerMarquee
        partners={partners}
        status={partnersStatus}
        error={partnersError}
      />
      <Services embedded />
      <br />
      <br />
      <Projects embedded />
      <br />
      <br />
      <TechnologiesSection />

      {isConsultationOpen && (
        <ConsultationModal
          onClose={() => setIsConsultationOpen(false)}
          defaultServiceName={selectedServiceName}
        />
      )}
    </PageFrame>
  );
}

export default Home;
