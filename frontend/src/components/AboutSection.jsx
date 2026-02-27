import { HiCheckBadge, HiStar, HiUsers, HiClock } from 'react-icons/hi2'

/**
 * About the agent section with stats cards.
 */
export default function AboutSection() {
    const stats = [
        { icon: HiCheckBadge, value: '15+', label: 'Years Experience' },
        { icon: HiUsers, value: '2000+', label: 'Happy Customers' },
        { icon: HiStar, value: '4.9★', label: 'Customer Rating' },
        { icon: HiClock, value: '24/7', label: 'Support Available' },
    ]

    return (
        <section id="about" className="py-24 bg-ap-dark-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left – Text */}
                    <div>
                        <span className="inline-block px-4 py-1 rounded-full bg-ap-red/10 text-ap-red text-sm font-semibold mb-4">
                            ABOUT US
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Your Trusted <span className="text-ap-gold">Asian Paints</span> Partner
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            With over 15 years of experience as an authorized Asian Paints dealer, we
                            bring quality paint products and professional services right to your doorstep.
                            Our team of skilled painters ensures every project is completed with precision
                            and care.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            We specialize in interior & exterior painting, texture finishes, waterproofing,
                            and colour consultation. Whether it's a single room or an entire building, we
                            deliver on time and within budget.
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex px-8 py-3 rounded-xl bg-gradient-to-r from-ap-red to-ap-red-dark text-white font-semibold hover:shadow-lg hover:shadow-ap-red/25 hover:-translate-y-0.5 transition-all"
                        >
                            Get In Touch
                        </a>
                    </div>

                    {/* Right – Stats grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="group rounded-2xl bg-ap-dark border border-white/5 p-6 text-center hover:border-ap-gold/30 hover:-translate-y-1 transition-all duration-300"
                            >
                                <s.icon className="mx-auto text-3xl text-ap-gold mb-3 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                                <div className="text-gray-400 text-sm">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
