import React from 'react';
import { motion } from 'framer-motion';
import heroDesktop from '../assets/images/rotaractd4465.png';
import heroMobile from '../assets/images/rotaractd4465_mini.jpg';

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[45vh] sm:min-h-[55vh] md:min-h-[70vh] pt-20 md:pt-24">
            
            <motion.div
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full overflow-hidden"
            >
                {/* RESPONSIVE HERO IMAGE */}
                <picture>
                    {/* Mobile image HASTA 1178px */}
                    <source srcSet={heroMobile} media="(max-width: 1178px)" />
                    
                    {/* Desktop image DESDE 1179px */}
                    <img
                        src={heroDesktop}
                        alt="Rotaract D4465 Hero"
                        className="w-full h-full object-cover"
                    />
                </picture>

                {/* Overlay suave */}
                <div className="absolute inset-0 bg-black/10" />

                {/* Fade profesional hacia el fondo */}
                <div className="absolute inset-0 bg-gradient-to-b 
                    from-transparent
                    via-black/5
                    to-[#050506]/90
                " />
            </motion.div>

            {/* Espaciador para evitar que el contenido choque */}
            <div className="relative w-full min-h-[45vh] sm:min-h-[55vh] md:min-h-[70vh]" />
        </section>
    );
};

export default HeroSection;
