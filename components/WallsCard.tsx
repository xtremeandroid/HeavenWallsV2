import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  imageUrl: string;
}

export const WallsCard = ({ imageUrl, id }: Props) => {
  return (
    <Link
      href={`/wall/${id}`}
      className="relative h-52 aspect-video rounded-lg hover:scale-105"
    >
      <Image
        src={imageUrl}
        fill
        alt="wall-card"
        className="rounded-lg object-cover"
        sizes="100%"
      />
    </Link>
  );
};
