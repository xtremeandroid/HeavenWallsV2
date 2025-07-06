// API Configuration for HeavenWalls
const API_FALLBACK_URLS = [
  'https://heavenwallsapi.vercel.app',
  'https://heavenwalls-api.vercel.app', 
  'https://heaven-walls-api.vercel.app'
];

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || API_FALLBACK_URLS[0],
  FALLBACK_URLS: API_FALLBACK_URLS,
  ENDPOINTS: {
    RANDOM: '/api/wallhaven/random',
    LATEST: '/api/wallhaven/latest', 
    TOP: '/api/wallhaven/topwalls',
    HOME: '/api/wallhaven/home',
    SEARCH: '/api/wallhaven/search',
    WALLPAPER: '/api/wallhaven/w',
  }
};

export const buildApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  
  return url.toString();
};

// Utility function to try multiple API URLs if the primary fails
export const fetchWithFallback = async (endpoint: string, params?: Record<string, any>): Promise<Response> => {
  const urls = [API_CONFIG.BASE_URL, ...API_CONFIG.FALLBACK_URLS.filter(url => url !== API_CONFIG.BASE_URL)];
  
  for (const baseUrl of urls) {
    try {
      const url = new URL(endpoint, baseUrl);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(url.toString());
      
      if (response.ok) {
        return response;
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${baseUrl}${endpoint}:`, error);
      continue; // Try next URL
    }
  }
  
  throw new Error(`All API endpoints failed for ${endpoint}`);
};