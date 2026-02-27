import { HiPaintBrush, HiArrowDown } from 'react-icons/hi2'

/**
 * Full-screen hero section with animated gradient background.
 */
export default function HeroSection() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ap-dark"
        >
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-ap-red/10 blur-[120px] animate-float" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-ap-gold/10 blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ap-gold/10 border border-ap-gold/20 text-ap-gold text-sm mb-8 animate-fadeInUp">
                    <HiPaintBrush className="text-lg" />
                    <span>Authorized Asian Paints Dealer</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    Transform Your Home <br />
                    <span className="bg-gradient-to-r from-ap-red via-ap-gold to-ap-red bg-clip-text text-transparent">
                        With Premium Paints
                    </span>
                </h1>

                <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    Bringing world-class Asian Paints products and expert painting services
                    to your doorstep. Quality you can trust, colours you'll love.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                    <a
                        href="#services"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-ap-red to-ap-red-dark text-white font-semibold text-lg shadow-lg shadow-ap-red/25 hover:shadow-xl hover:shadow-ap-red/30 hover:-translate-y-0.5 transition-all"
                    >
                        Explore Services
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 rounded-xl border-2 border-ap-gold/30 text-ap-gold font-semibold text-lg hover:bg-ap-gold/10 hover:-translate-y-0.5 transition-all"
                    >
                        Get a Quote
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <a
                href="#services"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ap-gold/60 animate-bounce"
            >
                <HiArrowDown size={28} />
            </a>
        </section>
    )
}
