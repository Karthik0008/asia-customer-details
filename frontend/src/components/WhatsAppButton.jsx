import { FaWhatsapp } from 'react-icons/fa'

/**
 * Floating WhatsApp click-to-chat button (bottom-right).
 */
export default function WhatsAppButton() {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'
    const message = encodeURIComponent(
        'Hi! I am interested in your paint services. Can you share more details?'
    )

    return (
        <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 transition-all animate-float"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp className="text-white text-3xl" />
        </a>
    )
}
