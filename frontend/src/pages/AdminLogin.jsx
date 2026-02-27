import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2'

/**
 * Admin login page using Supabase Auth (email / password).
 */
export default function AdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            toast.success('Login successful!')
            navigate('/admin/dashboard')
        } catch (err) {
            toast.error(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-ap-dark px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-ap-red/5 blur-[120px]" />
                <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-ap-gold/5 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-md animate-fadeInUp">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-ap-red to-ap-gold items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                        AP
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to manage your portfolio</p>
                </div>

                {/* Card */}
                <form
                    onSubmit={handleLogin}
                    className="rounded-2xl bg-ap-dark-card border border-white/5 p-8 space-y-6"
                >
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-ap-dark border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 focus:ring-1 focus:ring-ap-gold/30 transition-colors pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ap-gold transition-colors"
                            >
                                {showPw ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-ap-red to-ap-red-dark text-white font-semibold text-lg shadow-lg shadow-ap-red/25 hover:shadow-xl hover:shadow-ap-red/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <HiLockClosed className="text-lg" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-6">
                    <a href="/" className="hover:text-ap-gold transition-colors">← Back to website</a>
                </p>
            </div>
        </div>
    )
}
