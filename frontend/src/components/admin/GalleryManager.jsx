import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { HiTrash, HiCloudArrowUp, HiPhoto, HiPlayCircle } from 'react-icons/hi2'

const API_URL = import.meta.env.VITE_API_URL || ''

/**
 * Gallery manager – upload & delete images/videos from Supabase Storage.
 */
export default function GalleryManager({ token }) {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef(null)

    const headers = { Authorization: `Bearer ${token}` }

    const fetchGallery = () => {
        setLoading(true)
        fetch(`${API_URL}/api/gallery`)
            .then((r) => r.json())
            .then((d) => setItems(d.data || []))
            .catch(() => toast.error('Failed to load gallery'))
            .finally(() => setLoading(false))
    }

    useEffect(fetchGallery, [])

    const handleUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast.error('File too large. Max size is 50MB.')
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch(`${API_URL}/api/admin/gallery/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            if (!res.ok) throw new Error('Upload failed')
            toast.success('File uploaded!')
            fetchGallery()
        } catch {
            toast.error('Upload failed')
        } finally {
            setUploading(false)
            if (fileRef.current) fileRef.current.value = ''
        }
    }

    const handleDelete = async (filename) => {
        if (!confirm(`Delete "${filename}"?`)) return
        try {
            await fetch(`${API_URL}/api/admin/gallery/${encodeURIComponent(filename)}`, {
                method: 'DELETE',
                headers,
            })
            toast.success('File deleted')
            setItems((prev) => prev.filter((i) => i.name !== filename))
        } catch {
            toast.error('Delete failed')
        }
    }

    return (
        <div>
            {/* Upload area */}
            <div className="mb-8">
                <label
                    className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${uploading
                            ? 'border-ap-gold/50 bg-ap-gold/5'
                            : 'border-white/10 hover:border-ap-gold/30 hover:bg-white/5'
                        }`}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                    {uploading ? (
                        <div className="w-8 h-8 border-4 border-ap-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <HiCloudArrowUp className="text-4xl text-gray-400 mb-2" />
                            <p className="text-gray-400 text-sm">Click to upload an image or video</p>
                            <p className="text-gray-500 text-xs mt-1">Max 50MB – JPG, PNG, MP4, WEBM</p>
                        </>
                    )}
                </label>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-ap-gold border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Empty */}
            {!loading && items.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <HiPhoto className="mx-auto text-5xl mb-3" />
                    <p>No files in gallery. Upload your first image or video!</p>
                </div>
            )}

            {/* Grid */}
            {!loading && items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div key={item.name} className="group relative rounded-xl overflow-hidden bg-ap-dark border border-white/5">
                            {item.type === 'video' ? (
                                <div className="aspect-square flex items-center justify-center bg-ap-dark">
                                    <HiPlayCircle className="text-ap-gold text-5xl" />
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="aspect-square w-full object-cover"
                                    loading="lazy"
                                />
                            )}
                            {/* Overlay with delete */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(item.name)}
                                    className="p-3 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <HiTrash size={20} />
                                </button>
                            </div>
                            <div className="p-2">
                                <p className="text-gray-400 text-xs truncate">{item.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
