import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiPlus, HiPencil, HiTrash, HiXMark, HiCheck } from 'react-icons/hi2'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * CRUD manager for paint services.
 */
export default function ServicesManager({ token }) {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null) // service id being edited
    const [form, setForm] = useState({ title: '', description: '', image_url: '' })

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const fetchServices = () => {
        setLoading(true)
        fetch(`${API_URL}/api/services`)
            .then((r) => r.json())
            .then((d) => setServices(d.data || []))
            .catch(() => toast.error('Failed to load services'))
            .finally(() => setLoading(false))
    }

    useEffect(fetchServices, [])

    const resetForm = () => {
        setForm({ title: '', description: '', image_url: '' })
        setShowForm(false)
        setEditing(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title || !form.description) {
            toast.error('Title and description are required')
            return
        }

        try {
            if (editing) {
                // Update
                const res = await fetch(`${API_URL}/api/admin/services/${editing}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(form),
                })
                if (!res.ok) throw new Error()
                toast.success('Service updated')
            } else {
                // Create
                const res = await fetch(`${API_URL}/api/admin/services`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(form),
                })
                if (!res.ok) throw new Error()
                toast.success('Service created')
            }
            resetForm()
            fetchServices()
        } catch {
            toast.error('Operation failed')
        }
    }

    const handleEdit = (service) => {
        setForm({
            title: service.title,
            description: service.description,
            image_url: service.image_url || '',
        })
        setEditing(service.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this service?')) return
        try {
            await fetch(`${API_URL}/api/admin/services/${id}`, {
                method: 'DELETE',
                headers,
            })
            toast.success('Service deleted')
            setServices((prev) => prev.filter((s) => s.id !== id))
        } catch {
            toast.error('Delete failed')
        }
    }

    return (
        <div>
            {/* Add button */}
            {!showForm && (
                <button
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-ap-red to-ap-red-dark text-white font-semibold hover:shadow-lg hover:shadow-ap-red/25 transition-all mb-6"
                >
                    <HiPlus size={20} />
                    Add Service
                </button>
            )}

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-ap-dark border border-white/10 p-6 mb-8 space-y-4 animate-fadeInUp"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold text-lg">
                            {editing ? 'Edit Service' : 'New Service'}
                        </h3>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <HiXMark size={20} />
                        </button>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Title *</label>
                        <input
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="Interior Painting"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-ap-dark-card border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Description *</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            rows={3}
                            placeholder="Describe this service…"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-ap-dark-card border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Image URL (optional)</label>
                        <input
                            value={form.image_url}
                            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 rounded-xl bg-ap-dark-card border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-ap-gold/50 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-ap-gold to-ap-gold-light text-ap-dark font-semibold hover:shadow-lg transition-all"
                    >
                        <HiCheck size={20} />
                        {editing ? 'Update' : 'Create'}
                    </button>
                </form>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-ap-gold border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* List */}
            {!loading && services.length === 0 && !showForm && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No services yet. Add your first paint service!</p>
                </div>
            )}

            {!loading && services.length > 0 && (
                <div className="space-y-4">
                    {services.map((s) => (
                        <div
                            key={s.id}
                            className="flex items-center gap-4 p-5 rounded-xl bg-ap-dark border border-white/5 hover:border-ap-gold/20 transition-colors"
                        >
                            {s.image_url ? (
                                <img src={s.image_url} alt={s.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-ap-red/20 to-ap-gold/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-ap-gold text-xl font-bold">{s.title.charAt(0)}</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold truncate">{s.title}</h4>
                                <p className="text-gray-400 text-sm truncate">{s.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(s)}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-ap-gold transition-colors"
                                    title="Edit"
                                >
                                    <HiPencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                    title="Delete"
                                >
                                    <HiTrash size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
