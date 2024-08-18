import useWallsCartStore from "@/store/wallsCart.store";
import Image from "next/image";

interface Props {
  id: string;
  imageUrl: string;
}

export const WallsCard = ({ imageUrl, id }: Props) => {
  const { addWall, removeWall, isPresent } = useWallsCartStore();

  const handleOnChange = () => {
    if (isPresent(id)) {
      removeWall(id);
    } else {
      addWall(id);
    }
  };

  return (
    <div className="h-52 aspect-video rounded-lg hover:scale-105 relative">
      <input
        type="checkbox"
        checked={isPresent(id)}
        className="h-5 w-5 decoration-blue z-10 absolute left-0 top-0 m-2 rounded-lg opacity-[75%] cursor-pointer"
        onChange={handleOnChange}
      />
      <Image
        src={imageUrl}
        fill
        alt={`wall-card-${id}`}
        className="rounded-lg object-cover"
        sizes="100%"
      />
    </div>
  );
};
