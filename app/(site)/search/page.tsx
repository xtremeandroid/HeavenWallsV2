"use client";
import { WallsCard } from "@/components/WallsCard";
import WallpaperModal from "@/components/WallpaperModal";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { inView, ref } = useInView();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "latest" | "popular">("relevance");

  const fetchSearchResults = async ({ pageParam }: { pageParam: number }) => {
    // In a real app, you'd search your API
    // For now, we'll simulate search results
    const response = await fetch(
      `https://heaven-walls-api.vercel.app/api/wallhaven/search?q=${encodeURIComponent(query)}&page=${pageParam}&sort=${sortBy}`
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
    queryKey: ["search", query, sortBy],
    queryFn: fetchSearchResults,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    enabled: !!query,
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

  if (!query) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-gray-400">
            <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Search Wallpapers</h1>
          <p className="text-gray-400 text-lg">
            Use the search bar above to find your perfect wallpaper
          </p>
        </div>
      </div>
    );
  }

  if (status === "pending")
    return (
      <div className="min-h-screen flex justify-center items-center font-medium text-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p>Searching for "{query}"...</p>
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
          <p className="text-red-500">Search failed</p>
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
        id: wall.id || `search-${query}-${index}`,
        thumbs: wall.thumbs || {
          small: `https://th.wallhaven.cc/small/5g/search-${index}.jpg`,
          large: `https://w.wallhaven.cc/full/5g/wallhaven-search-${index}.jpg`,
        },
        resolution: wall.resolution || "1920x1080",
        category: wall.category || "Search Result",
        tags: wall.tags || [query, "wallpaper", "search"],
        views: Math.floor(Math.random() * 10000) + 1000,
        downloads: Math.floor(Math.random() * 5000) + 500,
        created_at: wall.created_at || new Date().toISOString(),
      };

      return (
        <div key={wall.id || `search-${query}-${index}`} onClick={() => handleWallpaperClick(enhancedWall)}>
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

  const resultCount = data?.pages.reduce((total, page) => total + (page?.data?.length || 0), 0) || 0;

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Search Results
              </h1>
              <p className="text-gray-400 text-lg">
                {resultCount > 0 ? `${resultCount} results for "${query}"` : `No results found for "${query}"`}
              </p>
            </div>
            
            {/* Sort Options */}
            {resultCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-7xl mx-auto">
          {resultCount > 0 ? (
            <>
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
                    <p className="font-semibold text-blue-400">Loading more results...</p>
                  </div>
                )}
                {!hasNextPage && content && (
                  <div className="text-center space-y-2">
                    <p className="font-semibold text-gray-400">🎉 End of search results</p>
                    <p className="text-gray-500 text-sm">Try a different search term for more results</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center space-y-6 py-16">
              <div className="text-gray-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.881-6.08-2.33M15 15.803a7.96 7.96 0 0019.08-2.33C16.464 14.119 14.34 15 12 15s-4.464-.881-6.08-2.33C7.536 14.119 9.66 15 12 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white">No results found</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Try different keywords or browse our categories to find the perfect wallpaper
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/categories"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Categories
                </a>
                <a
                  href="/"
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View All Wallpapers
                </a>
              </div>
            </div>
          )}
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