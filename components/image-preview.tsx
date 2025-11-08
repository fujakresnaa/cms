"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface ImagePreviewProps {
  src?: string
  alt?: string
  onRemove?: () => void
  isLoading?: boolean
}

export function ImagePreview({ src, alt, onRemove, isLoading }: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false)

  if (!src) return null

  return (
    <div className="relative inline-block">
      <img
        src={src || "/placeholder.svg"}
        alt={alt || "Preview"}
        className="max-w-xs max-h-48 object-cover rounded-lg"
        onError={() => setImageError(true)}
      />
      {imageError && <p className="text-red-500 text-sm mt-2">Failed to load image</p>}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}
