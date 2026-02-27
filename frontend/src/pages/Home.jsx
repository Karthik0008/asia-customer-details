import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import ServicesSection from '../components/ServicesSection'
import GallerySection from '../components/GallerySection'
import AboutSection from '../components/AboutSection'
import ContactForm from '../components/ContactForm'
import WhatsAppButton from '../components/WhatsAppButton'

/**
 * Public-facing home page – single-page layout with all portfolio sections.
 */
export default function Home() {
    return (
        <div className="bg-ap-dark min-h-screen">
            <Navbar />
            <HeroSection />
            <ServicesSection />
            <GallerySection />
            <AboutSection />
            <ContactForm />

            {/* Footer */}
            <footer className="bg-ap-dark-card border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ap-red to-ap-gold flex items-center justify-center text-white font-bold text-sm">
                            AP
                        </div>
                        <span className="text-white font-semibold">Asian Paints – Authorized Agent</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Asian Paints Agent Portfolio. All rights reserved.
                    </p>
                </div>
            </footer>

            <WhatsAppButton />
        </div>
    )
}
