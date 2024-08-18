import { WallsCard } from "@/components/WallsCard";
import useWallsCartStore from "@/store/wallsCart.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function PageContent() {
  const { inView, ref } = useInView();
  const { walls } = useWallsCartStore();

  console.log("Selected Walls: ", walls);

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
      return lastPage?.data?.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  if (status === "pending")
    return (
      <div className="min-h-screen flex justify-center items-center font-medium text-2xl">
        Loading...
      </div>
    );
  if (status === "error")
    return (
      <div className="min-h-screen flex justify-center items-center font-medium text-2xl">
        Error Message: {error.message}
      </div>
    );

  const content = data?.pages.map((pages: any) => {
    return pages?.data?.map((wall: any, index: number) => {
      return (
        <WallsCard key={wall.id} id={wall.id} imageUrl={wall?.thumbs?.small} />
      );
    });
  });

  return (
    <div className="min-h-screen p-8 flex justify-center">
      <div className="w-full h-fit flex gap-4 flex-wrap justify-center items-center">
        {content}
        <div
          ref={ref}
          className="flex justify-center items-center w-full text-2xl font-medium my-8"
        >
          {isFetchingNextPage && (
            <p className="font-semibold">{`Loading More Walls.....`}</p>
          )}
          {!hasNextPage && (
            <p className="font-semibold">{`No More Walls! Check Back Later :)`}</p>
          )}
        </div>
      </div>
    </div>
  );
}
