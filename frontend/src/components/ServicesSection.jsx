import { useEffect, useState } from 'react'
import { HiPaintBrush } from 'react-icons/hi2'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Card grid showing all paint services fetched from the backend.
 */
export default function ServicesSection() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/services`)
            .then((r) => r.json())
            .then((d) => setServices(d.data || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    // Fallback demo services shown until real data is loaded
    const fallbackServices = [
        { id: '1', title: 'Interior Painting', description: 'Beautiful interior painting with premium Asian Paints products for a flawless finish.', image_url: '' },
        { id: '2', title: 'Exterior Painting', description: 'Weather-proof exterior coatings that protect and beautify your home for years.', image_url: '' },
        { id: '3', title: 'Texture Painting', description: 'Stunning textured walls that add depth and character to any room.', image_url: '' },
        { id: '4', title: 'Waterproofing', description: 'Advanced waterproofing solutions to keep your home dry and damage-free.', image_url: '' },
        { id: '5', title: 'Wood Finishing', description: 'Expert wood polishing and coating to bring out the natural beauty of wood.', image_url: '' },
        { id: '6', title: 'Colour Consultation', description: 'Professional colour guidance to find the perfect palette for your space.', image_url: '' },
    ]

    const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices)

    return (
        <section id="services" className="py-24 bg-ap-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-ap-red/10 text-ap-red text-sm font-semibold mb-4">
                        OUR SERVICES
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Paint Services We <span className="text-ap-gold">Offer</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        From interior makeovers to weatherproof exteriors, we deliver professional
                        painting solutions with genuine Asian Paints products.
                    </p>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-2xl bg-ap-dark-card animate-shimmer" />
                        ))}
                    </div>
                )}

                {/* Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
                        {displayServices.map((s) => (
                            <div
                                key={s.id}
                                className="group relative rounded-2xl bg-ap-dark-card border border-white/5 p-8 hover:border-ap-gold/30 hover:-translate-y-1 transition-all duration-300 animate-fadeInUp opacity-0"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ap-red/5 to-ap-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    {s.image_url ? (
                                        <img src={s.image_url} alt={s.title} className="w-full h-40 object-cover rounded-xl mb-6" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ap-red to-ap-gold flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                            <HiPaintBrush className="text-white text-2xl" />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
