import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'

/**
 * Sticky top navigation bar with Asian Paints branding.
 */
export default function Navbar() {
    const [open, setOpen] = useState(false)

    const links = [
        { label: 'Home', href: '#home' },
        { label: 'Services', href: '#services' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-ap-dark/95 backdrop-blur-lg border-b border-ap-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#home" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ap-red to-ap-gold flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                            KS
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">KUMARAGURU S</h1>
                            <p className="text-ap-gold text-xs tracking-wider">AUTHORIZED ASIAN PAINTS AGENT</p>
                        </div>
                    </a>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-ap-gold transition-colors rounded-lg hover:bg-white/5"
                            >
                                {l.label}
                            </a>
                        ))}
                        <Link
                            to="/admin"
                            className="ml-4 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-ap-red to-ap-red-dark text-white hover:shadow-lg hover:shadow-ap-red/25 transition-all"
                        >
                            Admin
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        {open ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-ap-dark border-t border-ap-gold/10 animate-fadeInUp">
                    <div className="px-4 py-4 space-y-2">
                        {links.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="block px-4 py-3 text-gray-300 hover:text-ap-gold hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                        <Link
                            to="/admin"
                            onClick={() => setOpen(false)}
                            className="block px-4 py-3 text-center font-semibold rounded-lg bg-gradient-to-r from-ap-red to-ap-red-dark text-white"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
