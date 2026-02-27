import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiTrash } from 'react-icons/hi2'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Table of customer enquiries with delete buttons.
 */
export default function EnquiriesTable({ token }) {
    const [enquiries, setEnquiries] = useState([])
    const [loading, setLoading] = useState(true)

    const headers = { Authorization: `Bearer ${token}` }

    const fetchData = () => {
        setLoading(true)
        fetch(`${API_URL}/api/admin/enquiries`, { headers })
            .then((r) => r.json())
            .then((d) => setEnquiries(d.data || []))
            .catch(() => toast.error('Failed to load enquiries'))
            .finally(() => setLoading(false))
    }

    useEffect(fetchData, [])

    const handleDelete = async (id) => {
        if (!confirm('Delete this enquiry?')) return
        try {
            await fetch(`${API_URL}/api/admin/enquiries/${id}`, {
                method: 'DELETE',
                headers,
            })
            toast.success('Enquiry deleted')
            setEnquiries((prev) => prev.filter((e) => e.id !== id))
        } catch {
            toast.error('Failed to delete')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-ap-gold border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (enquiries.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No enquiries yet.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/10">
                        {['#', 'Name', 'Address', 'Contact', 'PIN', 'Date', 'Message', ''].map((h) => (
                            <th key={h} className="py-3 px-4 text-gray-400 text-sm font-semibold whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {enquiries.map((e, i) => (
                        <tr
                            key={e.id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            <td className="py-3 px-4 text-gray-500 text-sm">{i + 1}</td>
                            <td className="py-3 px-4 text-white text-sm font-medium">{e.name}</td>
                            <td className="py-3 px-4 text-gray-300 text-sm max-w-[200px] truncate">{e.address}</td>
                            <td className="py-3 px-4 text-gray-300 text-sm">{e.contact_number}</td>
                            <td className="py-3 px-4 text-gray-300 text-sm">{e.pin_code}</td>
                            <td className="py-3 px-4 text-gray-400 text-sm whitespace-nowrap">
                                {new Date(e.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td className="py-3 px-4 text-gray-400 text-sm max-w-[200px] truncate">{e.message || '—'}</td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => handleDelete(e.id)}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                    title="Delete"
                                >
                                    <HiTrash size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
