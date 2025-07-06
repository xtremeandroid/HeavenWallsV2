import { create } from "zustand";

interface FavoritesState {
  favorites: Set<string>;
  addFavorite: (wallId: string) => void;
  removeFavorite: (wallId: string) => void;
  isFavorite: (wallId: string) => boolean;
  toggleFavorite: (wallId: string) => void;
  getFavorites: () => string[];
  clearFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: new Set<string>(),
  
  addFavorite: (wallId: string) =>
    set((state) => {
      const newFavorites = new Set(state.favorites);
      newFavorites.add(wallId);
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return { favorites: newFavorites };
    }),
  
  removeFavorite: (wallId: string) =>
    set((state) => {
      const newFavorites = new Set(state.favorites);
      newFavorites.delete(wallId);
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return { favorites: newFavorites };
    }),
  
  isFavorite: (wallId: string) => {
    return get().favorites.has(wallId);
  },
  
  toggleFavorite: (wallId: string) => {
    const { favorites, addFavorite, removeFavorite } = get();
    if (favorites.has(wallId)) {
      removeFavorite(wallId);
    } else {
      addFavorite(wallId);
    }
  },
  
  getFavorites: () => {
    return Array.from(get().favorites);
  },
  
  clearFavorites: () => {
    localStorage.removeItem('favorites');
    set({ favorites: new Set() });
  },
}));

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    try {
      const favoritesArray = JSON.parse(storedFavorites);
      useFavoritesStore.setState({ favorites: new Set(favoritesArray) });
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }
}

export default useFavoritesStore;