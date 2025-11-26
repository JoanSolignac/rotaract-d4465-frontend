import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AppNavbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ImageCarousel from '../components/ImageCarousel';
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
    const [representative, setRepresentative] = useState(null);

    useEffect(() => {
        // Fetch representative info
        const fetchRepresentative = async () => {
            try {
                const response = await fetch('https://rotaractd4465api.up.railway.app/api/v1/miembros/public/representante');
                const data = await response.json();
                setRepresentative(data);
            } catch (err) {
                console.error('Error fetching representative:', err);
            }
        };

        fetchRepresentative();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#050506]">
            {/* Navigation */}
            <AppNavbar />

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <HeroSection />

                {/* Image Carousel Section */}
                <section className="py-12 bg-[#050506]">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <ImageCarousel />
                        </motion.div>
                    </div>
                </section>

                {/* Representative Info Section */}
                {representative && (
                    <section className="py-12 bg-neutral-900/50">
                        <div className="max-w-screen-xl mx-auto px-4 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Representante Distrital
                                </h3>
                                <p className="text-xl text-[#E51A4C] font-semibold">
                                    {representative.nombre}
                                </p>
                                {representative.correo && (
                                    <p className="text-gray-400 mt-1">{representative.correo}</p>
                                )}
                            </motion.div>
                        </div>
                    </section>
                )}

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
