"use client";
import { WallsCard } from "@/components/WallsCard";
import WallpaperModal from "@/components/WallpaperModal";
import useFavoritesStore from "@/store/favorites.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Wallpaper {
  id: string;
  thumbs: {
    small: string;
    large?: string;
    original?: string;
  };
  resolution?: string;
  category?: string;
  tags?: string[];
  views?: number;
  downloads?: number;
  created_at?: string;
}

export default function FavoritesPage() {
  const { getFavorites, clearFavorites } = useFavoritesStore();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const favoriteIds = getFavorites();

  // Fetch wallpaper details for favorites
  const { data: favoriteWallpapers, isLoading, error } = useQuery({
    queryKey: ["favorites", favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      
      // In a real app, you'd fetch these from your API
      // For now, we'll create mock data based on the IDs
      return favoriteIds.map((id) => ({
        id,
        thumbs: {
          small: `https://th.wallhaven.cc/small/5g/${id}.jpg`,
          large: `https://w.wallhaven.cc/full/5g/wallhaven-${id}.jpg`,
        },
        resolution: "1920x1080",
        category: ["Nature", "Abstract", "Technology", "Space", "Cars"][Math.floor(Math.random() * 5)],
        tags: ["wallpaper", "background", "desktop"],
        views: Math.floor(Math.random() * 10000) + 1000,
        downloads: Math.floor(Math.random() * 5000) + 500,
        created_at: new Date().toISOString(),
      }));
    },
    enabled: favoriteIds.length > 0,
  });

  const handleWallpaperClick = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWallpaper(null);
  };

  const handleClearFavorites = () => {
    if (confirm("Are you sure you want to clear all favorites?")) {
      clearFavorites();
    }
  };

  if (favoriteIds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-gray-400">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">No Favorites Yet</h1>
          <p className="text-gray-400 text-lg">
            Start exploring wallpapers and click the heart icon to add them to your favorites!
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Wallpapers
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-xl font-medium text-white">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-red-500">Failed to load favorites</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Your Favorites
              </h1>
              <p className="text-gray-400 text-lg">
                {favoriteIds.length} wallpaper{favoriteIds.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
            
            {favoriteIds.length > 0 && (
              <button
                onClick={handleClearFavorites}
                className="px-4 py-2 text-red-400 border border-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {favoriteWallpapers?.map((wallpaper) => (
              <div key={wallpaper.id} onClick={() => handleWallpaperClick(wallpaper)}>
                <WallsCard
                  id={wallpaper.id}
                  imageUrl={wallpaper.thumbs.small}
                  fullImageUrl={wallpaper.thumbs.large || (wallpaper.thumbs as any).original || wallpaper.thumbs.small}
                  resolution={wallpaper.resolution}
                  category={wallpaper.category}
                  tags={wallpaper.tags}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallpaper Detail Modal */}
      <WallpaperModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        wallpaper={selectedWallpaper ? {
          id: selectedWallpaper.id,
          imageUrl: selectedWallpaper.thumbs.small,
          fullImageUrl: selectedWallpaper.thumbs.large || selectedWallpaper.thumbs.original || selectedWallpaper.thumbs.small,
          resolution: selectedWallpaper.resolution,
          category: selectedWallpaper.category,
          tags: selectedWallpaper.tags,
          views: selectedWallpaper.views,
          downloads: selectedWallpaper.downloads,
          uploadDate: selectedWallpaper.created_at,
        } : null}
      />
    </>
  );
}