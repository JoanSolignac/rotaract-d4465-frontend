import { motion } from 'framer-motion';
import AppNavbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MetricsSection from '../components/MetricsSection';
import HowItWorks from '../components/HowItWorks';
import ClubsGrid from '../components/ClubsGrid';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

/**
 * Landing Page Component
 * Main landing page integrating all sections
 */
export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#050506]">
            {/* Navigation */}
            <AppNavbar />

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <HeroSection />

                {/* Metrics Section - Dynamic API Data */}
                <MetricsSection />

                {/* How It Works Section */}
                <HowItWorks />

                {/* Clubs Grid Section */}
                <ClubsGrid />

                {/* Call to Action Section */}
                <CTASection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
