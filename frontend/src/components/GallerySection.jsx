import { useEffect, useState } from 'react'
import { HiPhoto, HiPlayCircle, HiXMark } from 'react-icons/hi2'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Masonry-style gallery with lightbox for images and inline video playback.
 */
export default function GallerySection() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [lightbox, setLightbox] = useState(null)

    useEffect(() => {
        fetch(`${API_URL}/api/gallery`)
            .then((r) => r.json())
            .then((d) => setItems(d.data || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <section id="gallery" className="py-24 bg-gradient-to-b from-ap-dark to-ap-dark-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-ap-gold/10 text-ap-gold text-sm font-semibold mb-4">
                        OUR GALLERY
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Our <span className="text-ap-gold">Work</span> Speaks
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Browse through our recent projects and see the transformation we bring to every home.
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-video rounded-xl bg-ap-dark-card animate-shimmer" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && items.length === 0 && (
                    <div className="text-center py-20">
                        <HiPhoto className="mx-auto text-6xl text-gray-600 mb-4" />
                        <p className="text-gray-500 text-lg">Gallery coming soon! The admin will upload images and videos.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && items.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
                        {items.map((item, i) => (
                            <div
                                key={item.name}
                                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer animate-fadeInUp opacity-0"
                                onClick={() => setLightbox(item)}
                            >
                                {item.type === 'video' ? (
                                    <div className="w-full h-full bg-ap-dark-card">
                                        <video
                                            src={item.url}
                                            muted
                                            loop
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute bottom-3 left-3 text-white text-xs bg-black/50 px-2 py-1 rounded z-10">Video</span>
                                    </div>
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-ap-gold transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <HiXMark size={32} />
                    </button>
                    <div
                        className="max-w-4xl max-h-[85vh] animate-fadeInUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {lightbox.type === 'video' ? (
                            <video src={lightbox.url} controls autoPlay muted playsInline className="max-h-[85vh] rounded-xl" />
                        ) : (
                            <img src={lightbox.url} alt={lightbox.name} className="max-h-[85vh] rounded-xl object-contain" />
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
