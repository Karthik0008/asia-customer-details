import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiPaperAirplane, HiMapPin, HiPhone, HiEnvelope } from 'react-icons/hi2'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Customer enquiry form that POSTs to /api/enquiries.
 */
export default function ContactForm() {
    const [form, setForm] = useState({
        name: '',
        address: '',
        contact_number: '',
        pin_code: '',
        message: '',
    })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic client-side validation
        if (!form.name || !form.address || !form.contact_number || !form.pin_code) {
            toast.error('Please fill all required fields')
            return
        }
        if (form.contact_number.length < 10) {
            toast.error('Enter a valid contact number')
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error('Submission failed')
            toast.success('Enquiry submitted successfully! We will contact you soon.')
            setForm({ name: '', address: '', contact_number: '', pin_code: '', message: '' })
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const contactInfo = [
        { icon: HiMapPin, label: 'Visit Us', value: 'Chennai, Tamil Nadu, India' },
        { icon: HiPhone, label: 'Call Us', value: '+91 7448973059' },
        { icon: HiEnvelope, label: 'Email', value: 'guru109717@gmail.com' },
    ]

    return (
        <section id="contact" className="py-24 bg-ap-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-ap-gold/10 text-ap-gold text-sm font-semibold mb-4">
                        GET IN TOUCH
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Send Us an <span className="text-ap-gold">Enquiry</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Fill out the form and we'll get back to you within 24 hours with a free quote.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact info cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {contactInfo.map((c) => (
                            <div
                                key={c.label}
                                className="flex items-start gap-4 p-5 rounded-xl bg-ap-dark-card border border-white/5 hover:border-ap-gold/20 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-ap-red to-ap-gold flex items-center justify-center flex-shrink-0">
                                    <c.icon className="text-white text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">{c.label}</h4>
                                    <p className="text-gray-400 text-sm">{c.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="lg:col-span-3 rounded-2xl bg-ap-dark-card border border-white/5 p-8 space-y-5"
                    >
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Full Name *</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-2">Contact Number *</label>
                                <input
                                    name="contact_number"
                                    value={form.contact_number}
                                    onChange={handleChange}
                                    placeholder="+91 99999 99999"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Address *</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Full address"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">PIN Code *</label>
                            <input
                                name="pin_code"
                                value={form.pin_code}
                                onChange={handleChange}
                                placeholder="400001"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">Message (optional)</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your project…"
                                className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-ap-red to-ap-red-dark text-white font-semibold text-lg shadow-lg shadow-ap-red/25 hover:shadow-xl hover:shadow-ap-red/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <HiPaperAirplane className="text-lg" />
                                    Submit Enquiry
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
