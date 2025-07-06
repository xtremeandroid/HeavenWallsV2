"use client";
import Image from "next/image";
import { useEffect } from "react";
import useFavoritesStore from "@/store/favorites.store";
import useWallsCartStore from "@/store/wallsCart.store";

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: {
    id: string;
    imageUrl: string;
    fullImageUrl?: string;
    resolution?: string;
    category?: string;
    tags?: string[];
    views?: number;
    downloads?: number;
    uploadDate?: string;
  } | null;
}

export default function WallpaperModal({ isOpen, onClose, wallpaper }: WallpaperModalProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addWall, removeWall, isPresent } = useWallsCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !wallpaper) return null;

  const handleDownload = async (quality: 'original' | 'hd' | 'medium' = 'original') => {
    try {
      const downloadUrl = wallpaper.fullImageUrl || wallpaper.imageUrl;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper-${wallpaper.id}-${quality}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleFavorite = () => {
    toggleFavorite(wallpaper.id);
  };

  const handleSelect = () => {
    if (isPresent(wallpaper.id)) {
      removeWall(wallpaper.id);
    } else {
      addWall(wallpaper.id);
    }
  };

  const downloadOptions = [
    { label: 'Original Quality', value: 'original', resolution: wallpaper.resolution || '1920x1080' },
    { label: 'HD Quality', value: 'hd', resolution: '1920x1080' },
    { label: 'Medium Quality', value: 'medium', resolution: '1280x720' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Wallpaper Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Image Section */}
          <div className="flex-1 relative bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
            <Image
              src={wallpaper.fullImageUrl || wallpaper.imageUrl}
              alt={`wallpaper-${wallpaper.id}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-80 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resolution:</span>
                    <span className="text-white">{wallpaper.resolution || '1920x1080'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{wallpaper.category || 'General'}</span>
                  </div>
                  {wallpaper.views && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views:</span>
                      <span className="text-white">{wallpaper.views.toLocaleString()}</span>
                    </div>
                  )}
                  {wallpaper.downloads && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Downloads:</span>
                      <span className="text-white">{wallpaper.downloads.toLocaleString()}</span>
                    </div>
                  )}
                  {wallpaper.uploadDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Upload Date:</span>
                      <span className="text-white">{new Date(wallpaper.uploadDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {wallpaper.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Actions</h3>
                
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                      isFavorite(wallpaper.id)
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={isFavorite(wallpaper.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isFavorite(wallpaper.id) ? 'Favorited' : 'Favorite'}
                  </button>
                  
                  <button
                    onClick={handleSelect}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-colors ${
                      isPresent(wallpaper.id)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isPresent(wallpaper.id) ? 'Selected' : 'Select'}
                  </button>
                </div>

                {/* Download Options */}
                <div className="space-y-2">
                  {downloadOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDownload(option.value as any)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{option.label}</span>
                      </div>
                      <span className="text-sm text-green-200">{option.resolution}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}