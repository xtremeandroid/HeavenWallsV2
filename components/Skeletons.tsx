export const WallpaperCardSkeleton = () => {
  return (
    <div className="h-52 aspect-video rounded-lg bg-gray-800 animate-pulse">
      <div className="h-full w-full bg-gray-700 rounded-lg"></div>
    </div>
  );
};

export const WallpaperGridSkeleton = ({ count = 20 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <WallpaperCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-800"></div>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-6 h-6 bg-gray-700 rounded"></div>
          <div className="w-20 h-5 bg-gray-700 rounded"></div>
        </div>
        <div className="w-full h-4 bg-gray-700 rounded mb-3"></div>
        <div className="w-3/4 h-3 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export const HeaderSkeleton = () => {
  return (
    <header className="bg-black text-white h-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="w-32 h-6 bg-gray-700 rounded"></div>
        <div className="flex-1 max-w-lg mx-8">
          <div className="w-full h-10 bg-gray-800 rounded-lg"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    </header>
  );
};