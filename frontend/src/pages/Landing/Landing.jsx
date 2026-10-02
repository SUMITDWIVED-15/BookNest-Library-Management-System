import Navbar from "../../component/Landing/Navbar";
import HeroSection from "../../component/Landing/HeroSection";
import FeaturesSection from "../../component/Landing/FeaturesSection";
import ImpactSection from "../../component/Landing/ImpactSection";
import TestimonialsSection from "../../component/Landing/TestimonialsSection";
import CommunitySection from "../../component/Landing/CommunitySection";
import Footer from "../../component/Landing/Footer";

function Landing() {
    return (
        <div className="min-h-screen bg-[#f8f9ff] text-gray-900">
            <Navbar />

            <main>
                <HeroSection />
                <FeaturesSection />
                <ImpactSection />
                <TestimonialsSection />
                <CommunitySection />
            </main>

            <Footer />
        </div>
    );
}

export default Landing;