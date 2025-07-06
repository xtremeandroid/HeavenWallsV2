"use client";
import { WallsCard } from "@/components/WallsCard";
import WallpaperModal from "@/components/WallpaperModal";
import { API_CONFIG, fetchWithFallback } from "@/config/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

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

const categoryInfo: Record<string, { name: string; description: string; icon: string }> = {
  nature: {
    name: "Nature",
    description: "Beautiful landscapes, forests, mountains, and natural scenery",
    icon: "🌿"
  },
  abstract: {
    name: "Abstract",
    description: "Creative and artistic abstract designs and patterns",
    icon: "🎨"
  },
  technology: {
    name: "Technology",
    description: "Futuristic tech, gadgets, and digital art",
    icon: "💻"
  },
  space: {
    name: "Space",
    description: "Galaxies, planets, stars, and cosmic landscapes",
    icon: "🚀"
  },
  cars: {
    name: "Cars",
    description: "Sports cars, vintage automobiles, and racing",
    icon: "🏎️"
  },
  animals: {
    name: "Animals",
    description: "Wildlife, pets, and beautiful animal photography",
    icon: "🦁"
  },
  art: {
    name: "Art",
    description: "Digital art, paintings, and creative illustrations",
    icon: "🖼️"
  }
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { inView, ref } = useInView();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "random">("latest");

  const category = categoryInfo[slug] || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Wallpapers in the ${slug} category`,
    icon: "📁"
  };

  const fetchCategoryWallpapers = async ({ pageParam }: { pageParam: number }) => {
    // For category filtering, we'll use the search endpoint with category query
    const searchQuery = slug === 'all' ? '' : slug;
    const endpoint = sortBy === 'random' ? API_CONFIG.ENDPOINTS.RANDOM : 
                    sortBy === 'popular' ? API_CONFIG.ENDPOINTS.TOP : 
                    API_CONFIG.ENDPOINTS.LATEST;
    
    const params: Record<string, any> = { page: pageParam };
    
    if (searchQuery && endpoint === API_CONFIG.ENDPOINTS.RANDOM) {
      // For search with category, use search endpoint
      const searchParams = {
        ...params,
        q: searchQuery,
        sort: sortBy === 'popular' ? 'toplist' : 'date_added'
      };
      const response = await fetchWithFallback(API_CONFIG.ENDPOINTS.SEARCH, searchParams);
      return response.json();
    } else {
      // Use specific endpoint
      if (sortBy === 'popular') {
        params.toprange = '1M'; // Top of the month
      }
      
      const response = await fetchWithFallback(endpoint, params);
      return response.json();
    }
  };

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["category-walls", slug, sortBy],
    queryFn: fetchCategoryWallpapers,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleWallpaperClick = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWallpaper(null);
  };

  if (status === "pending")
    return (
      <div className="min-h-screen flex justify-center items-center font-medium text-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p>Loading {category.name} wallpapers...</p>
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div className="min-h-screen flex justify-center items-center font-medium text-2xl">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-500">Failed to load {category.name} wallpapers</p>
          <p className="text-gray-500 text-base">Error: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const content = data?.pages.map((pages: any) => {
    return pages?.data?.map((wall: any, index: number) => {
      const enhancedWall: Wallpaper = {
        id: wall.id || `${slug}-${index}`,
        thumbs: wall.thumbs || {
          small: `https://th.wallhaven.cc/small/5g/${slug}-${index}.jpg`,
          large: `https://w.wallhaven.cc/full/5g/wallhaven-${slug}-${index}.jpg`,
        },
        resolution: wall.resolution || "1920x1080",
        category: category.name,
        tags: wall.tags || [slug, "wallpaper", "background"],
        views: Math.floor(Math.random() * 10000) + 1000,
        downloads: Math.floor(Math.random() * 5000) + 500,
        created_at: wall.created_at || new Date().toISOString(),
      };

      return (
        <div key={wall.id || `${slug}-${index}`} onClick={() => handleWallpaperClick(enhancedWall)}>
          <WallsCard 
            id={enhancedWall.id}
            imageUrl={enhancedWall.thumbs.small}
            fullImageUrl={enhancedWall.thumbs.large || enhancedWall.thumbs.original}
            resolution={enhancedWall.resolution}
            category={enhancedWall.category}
            tags={enhancedWall.tags}
          />
        </div>
      );
    });
  });

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{category.icon}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {category.name} Wallpapers
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                {category.description}
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="random">Random</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wallpapers Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {content}
          </div>
          
          {/* Loading indicator */}
          <div
            ref={ref}
            className="flex justify-center items-center w-full text-xl font-medium my-12"
          >
            {isFetchingNextPage && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="font-semibold text-blue-400">Loading more {category.name} wallpapers...</p>
              </div>
            )}
            {!hasNextPage && content && (
              <div className="text-center space-y-2">
                <p className="font-semibold text-gray-400">🎉 You&apos;ve seen all {category.name} wallpapers!</p>
                <p className="text-gray-500 text-sm">Check back later for new additions</p>
              </div>
            )}
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