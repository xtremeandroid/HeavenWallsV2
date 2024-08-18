export interface WallsCartState {
  walls: Set<string>;
  addWall: (wallId: string) => void;
  removeWall: (wallId: string) => void;
  isPresent: (wallId: string) => boolean;
}
