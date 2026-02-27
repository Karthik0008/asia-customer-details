import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
    HiInboxStack,
    HiPhoto,
    HiPaintBrush,
    HiArrowRightOnRectangle,
    HiBars3,
    HiXMark,
} from 'react-icons/hi2'
import EnquiriesTable from '../components/admin/EnquiriesTable'
import GalleryManager from '../components/admin/GalleryManager'
import ServicesManager from '../components/admin/ServicesManager'

const tabs = [
    { id: 'enquiries', label: 'Enquiries', icon: HiInboxStack },
    { id: 'gallery', label: 'Gallery', icon: HiPhoto },
    { id: 'services', label: 'Services', icon: HiPaintBrush },
]

/**
 * Admin dashboard with a sidebar and tabbed content area.
 */
export default function AdminDashboard({ session }) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('enquiries')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const token = session?.access_token || ''

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Logged out')
        navigate('/admin')
    }

    return (
        <div className="flex h-screen bg-ap-dark overflow-hidden">
            {/* ── Sidebar ─────────────────────────────────────────── */}
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-ap-dark-card border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ap-red to-ap-gold flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        AP
                    </div>
                    <div>
                        <h2 className="text-white font-bold leading-tight">Admin Panel</h2>
                        <p className="text-ap-gold text-xs">Dashboard</p>
                    </div>
                    <button
                        className="lg:hidden ml-auto text-gray-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <HiXMark size={22} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setActiveTab(t.id)
                                setSidebarOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === t.id
                                    ? 'bg-gradient-to-r from-ap-red/20 to-ap-gold/10 text-ap-gold border border-ap-gold/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <t.icon size={20} />
                            {t.label}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <HiArrowRightOnRectangle size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Main content ─────────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-ap-dark/90 backdrop-blur-lg border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <HiBars3 size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-white capitalize">
                            {activeTab === 'enquiries' && '📋 Customer Enquiries'}
                            {activeTab === 'gallery' && '🖼️ Gallery Manager'}
                            {activeTab === 'services' && '🎨 Paint Services'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ap-red to-ap-gold flex items-center justify-center text-white text-xs font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6">
                    <div className="rounded-2xl bg-ap-dark-card border border-white/5 p-6">
                        {activeTab === 'enquiries' && <EnquiriesTable token={token} />}
                        {activeTab === 'gallery' && <GalleryManager token={token} />}
                        {activeTab === 'services' && <ServicesManager token={token} />}
                    </div>
                </div>
            </main>
        </div>
    )
}
