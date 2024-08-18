import { WallsCard } from "@/components/WallsCard";
import { useQuery } from "@tanstack/react-query";

export default function PageContent() {
  const fetchTodo = async () => {
    const response = await fetch(
      `https://heaven-walls-api.vercel.app/api/wallhaven/random`
    );
    if (!response.ok) {
      throw new Error("API ERROR");
    }
    return response.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["walls"],
    queryFn: () => fetchTodo(),
  });

  if (isLoading) {
    return <div className="min-h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="min-h-screen">Error loading data</div>;
  }

  console.log(data);

  return (
    <div className="min-h-screen md:max-w-7xl mx-auto p-8 flex justify-center">
      <div className="w-full h-fit flex gap-4 flex-wrap justify-center md:justify-start">
        {data?.data?.length > 0 &&
          data?.data?.map((wall: any) => (
            <WallsCard
              key={wall.id}
              imageUrl={wall?.thumbs?.small}
              id={wall.id}
            />
          ))}
      </div>
    </div>
  );
}
