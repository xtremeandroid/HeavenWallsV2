import { WallsCard } from "@/components/WallsCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function PageContent() {
  const { inView, ref } = useInView();

  const fetchTodo = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch(
      `https://heaven-walls-api.vercel.app/api/wallhaven/random?page=${pageParam}`
    );
    return response.json();
  };

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["walls"],
    queryFn: fetchTodo,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error Message: {error.message}</div>;

  const content = data?.pages.map((page: any) => {
    return page.data.map((wall: any) => {
      return (
        <WallsCard key={wall.id} id={wall.id} imageUrl={wall?.thumbs?.small} />
      );
    });
  });

  return (
    <div className="min-h-screen md:max-w-7xl mx-auto p-8 flex justify-center">
      <div className="w-full h-fit flex gap-4 flex-wrap justify-center md:justify-start">
        {content}
        <div ref={ref} className="h-10 w-full flex justify-center items-center">
          {isFetchingNextPage && (
            <div className="font-semibold text-lg">Loading more Walls...</div>
          )}
        </div>
      </div>
    </div>
  );
}
