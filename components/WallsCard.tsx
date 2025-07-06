"use client";
import useWallsCartStore from "@/store/wallsCart.store";
import useFavoritesStore from "@/store/favorites.store";
import Image from "next/image";
import { useState } from "react";

interface Props {
  id: string;
  imageUrl: string;
  fullImageUrl?: string;
  resolution?: string;
  category?: string;
  tags?: string[];
}

export const WallsCard = ({ 
  imageUrl, 
  id, 
  fullImageUrl, 
  resolution = "1920x1080",
  category = "General",
  tags = []
}: Props) => {
  const { addWall, removeWall, isPresent } = useWallsCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleOnChange = () => {
    if (isPresent(id)) {
      removeWall(id);
    } else {
      addWall(id);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const downloadUrl = fullImageUrl || imageUrl;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCardClick = () => {
    // Click handling is now done by parent component
  };

  return (
    <div 
      className="group relative bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image container */}
      <div className="h-52 aspect-video relative">
        <Image
          src={imageUrl}
          fill
          alt={`wallpaper-${id}`}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top controls */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPresent(id)}
            className="h-4 w-4 rounded border-2 border-white bg-black/50 text-blue-500 focus:ring-blue-500 cursor-pointer"
            onChange={handleOnChange}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={handleFavorite}
            className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200"
          >
            <svg 
              className={`w-4 h-4 ${isFavorite(id) ? 'text-red-500 fill-current' : 'text-white'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Bottom info and actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transform transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{resolution}</p>
              <p className="text-gray-300 text-xs truncate">{category}</p>
            </div>
            <button
              onClick={handleDownload}
              className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              title="Download wallpaper"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-800/80 text-gray-300 rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-800/80 text-gray-300 rounded-full backdrop-blur-sm">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
