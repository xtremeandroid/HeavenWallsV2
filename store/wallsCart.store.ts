import { WallsCartState } from "@/types/wallStore";
import { create } from "zustand";

const useWallsCartStore = create<WallsCartState>((set) => ({
  walls: new Set(),
  addWall: (wallId: string) =>
    set((state) => {
      if (!state.walls.has(wallId)) {
        const newWalls = new Set(state.walls);
        newWalls.add(wallId);
        return { walls: newWalls };
      }
      return state;
    }),
  removeWall: (wallId: string) =>
    set((state) => {
      if (state.walls.has(wallId)) {
        const newWalls = new Set(state.walls);
        newWalls.delete(wallId);
        return { walls: newWalls };
      }
      return state;
    }),
  isPresent(wallId: string) {
    return this?.walls?.has(wallId);
  },
}));

export default useWallsCartStore;
