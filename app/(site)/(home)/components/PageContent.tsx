import { WallsCard } from "@/components/WallsCard";
import WallpaperModal from "@/components/WallpaperModal";
import { WallpaperGridSkeleton } from "@/components/Skeletons";
import useWallsCartStore from "@/store/wallsCart.store";
import { useInfiniteQuery } from "@tanstack/react-query";
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

export default function PageContent() {
  const { inView, ref } = useInView();
  const { walls } = useWallsCartStore();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Selected Walls: ", walls);

  const fetchTodo = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `https://heaven-walls-api.vercel.app/api/wallhaven/random?page=${pageParam}`
    );
    return response.json();
  };

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["walls"],
    queryFn: fetchTodo,
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
  }, [inView, hasNextPage, isFetchingNextPage]);

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
      <div className="min-h-screen p-4 md:p-8">
        {/* Header Section Skeleton */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center space-y-4">
            <div className="h-10 bg-gray-800 rounded-lg w-96 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded-lg w-2/3 mx-auto animate-pulse"></div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-8 text-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 w-16 bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wallpapers Grid Skeleton */}
        <div className="max-w-7xl mx-auto">
          <WallpaperGridSkeleton count={20} />
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
          <p className="text-red-500">Failed to load wallpapers</p>
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
      // Enhanced wallpaper data with mock additional info
      const enhancedWall: Wallpaper = {
        id: wall.id,
        thumbs: wall.thumbs,
        resolution: wall.resolution || "1920x1080",
        category: wall.category || ["Nature", "Abstract", "Technology", "Space", "Cars"][Math.floor(Math.random() * 5)],
        tags: wall.tags || ["wallpaper", "background", "desktop"],
        views: Math.floor(Math.random() * 10000) + 1000,
        downloads: Math.floor(Math.random() * 5000) + 500,
        created_at: wall.created_at || new Date().toISOString(),
      };

      return (
        <div key={wall.id} onClick={() => handleWallpaperClick(enhancedWall)}>
          <WallsCard 
            id={wall.id} 
            imageUrl={wall?.thumbs?.small}
            fullImageUrl={wall?.thumbs?.large || wall?.thumbs?.original}
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
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Discover Amazing Wallpapers
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              High-quality wallpapers for your desktop, mobile, and tablet. Browse thousands of stunning images.
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-8 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-400">10K+</p>
                <p className="text-gray-400 text-sm">Wallpapers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">50K+</p>
                <p className="text-gray-400 text-sm">Downloads</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">100+</p>
                <p className="text-gray-400 text-sm">Categories</p>
              </div>
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
                <p className="font-semibold text-blue-400">Loading more wallpapers...</p>
              </div>
            )}
            {!hasNextPage && content && (
              <div className="text-center space-y-2">
                <p className="font-semibold text-gray-400">🎉 You've seen all available wallpapers!</p>
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
