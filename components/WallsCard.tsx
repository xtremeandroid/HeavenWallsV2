import Image from "next/image";

interface Props {
  id: string;
  imageUrl: string;
}

export const WallsCard = ({ imageUrl, id }: Props) => {
  return (
    <div className="h-52 aspect-video rounded-lg hover:scale-105 relative">
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
