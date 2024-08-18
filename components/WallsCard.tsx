import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  imageUrl: string;
}

export const WallsCard = ({ imageUrl, id }: Props) => {
  return (
    <div className="h-52 aspect-video relative rounded-lg hover:scale-105">
      <Link href={`/wall/${id}`}>
        <Image
          src={imageUrl}
          fill
          alt="wall-card"
          objectFit="cover"
          className="rounded-lg"
        />
      </Link>
    </div>
  );
};
