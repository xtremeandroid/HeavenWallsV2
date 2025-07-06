"use client";
import Link from "next/link";

const categories = [
  {
    name: "Nature",
    slug: "nature",
    description: "Beautiful landscapes, forests, mountains, and natural scenery",
    icon: "🌿",
    count: 2500,
    image: "https://th.wallhaven.cc/small/5g/wallhaven-5g8lv9.jpg"
  },
  {
    name: "Abstract",
    slug: "abstract",
    description: "Creative and artistic abstract designs and patterns",
    icon: "🎨",
    count: 1800,
    image: "https://th.wallhaven.cc/small/kx/wallhaven-kxgl7q.jpg"
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Futuristic tech, gadgets, and digital art",
    icon: "💻",
    count: 1200,
    image: "https://th.wallhaven.cc/small/yx/wallhaven-yxk7pd.jpg"
  },
  {
    name: "Space",
    slug: "space",
    description: "Galaxies, planets, stars, and cosmic landscapes",
    icon: "🚀",
    count: 900,
    image: "https://th.wallhaven.cc/small/m9/wallhaven-m9x5vq.jpg"
  },
  {
    name: "Cars",
    slug: "cars",
    description: "Sports cars, vintage automobiles, and racing",
    icon: "🏎️",
    count: 750,
    image: "https://th.wallhaven.cc/small/dp/wallhaven-dp87vm.jpg"
  },
  {
    name: "Animals",
    slug: "animals",
    description: "Wildlife, pets, and beautiful animal photography",
    icon: "🦁",
    count: 1100,
    image: "https://th.wallhaven.cc/small/xl/wallhaven-xl83vd.jpg"
  },
  {
    name: "Art",
    slug: "art",
    description: "Digital art, paintings, and creative illustrations",
    icon: "🖼️",
    count: 1600,
    image: "https://th.wallhaven.cc/small/wy/wallhaven-wyq8xl.jpg"
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Video game screenshots, characters, and gaming art",
    icon: "🎮",
    count: 950,
    image: "https://th.wallhaven.cc/small/g8/wallhaven-g8eo9x.jpg"
  },
  {
    name: "Anime",
    slug: "anime",
    description: "Anime characters, scenes, and Japanese animation",
    icon: "⛩️",
    count: 1350,
    image: "https://th.wallhaven.cc/small/d6/wallhaven-d6k9xl.jpg"
  },
  {
    name: "Architecture",
    slug: "architecture",
    description: "Buildings, cities, and architectural photography",
    icon: "🏛️",
    count: 600,
    image: "https://th.wallhaven.cc/small/1k/wallhaven-1kg9xl.jpg"
  },
  {
    name: "Minimalist",
    slug: "minimalist",
    description: "Clean, simple, and minimalistic designs",
    icon: "⚪",
    count: 800,
    image: "https://th.wallhaven.cc/small/p8/wallhaven-p8x9xl.jpg"
  },
  {
    name: "Dark",
    slug: "dark",
    description: "Dark themed wallpapers and moody atmospheres",
    icon: "🌙",
    count: 1050,
    image: "https://th.wallhaven.cc/small/z8/wallhaven-z8x9xl.jpg"
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Browse Categories
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our collection of wallpapers organized by themes and subjects
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              {/* Background Image */}
              <div className="h-48 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x300/374151/9CA3AF?text=${category.icon}`;
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 text-sm font-medium">
                      {category.count.toLocaleString()} wallpapers
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .sort((a, b) => b.count - a.count)
              .slice(0, 4)
              .map((category) => (
                <Link
                  key={`featured-${category.slug}`}
                  href={`/category/${category.slug}`}
                  className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-white font-medium">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.count.toLocaleString()}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}