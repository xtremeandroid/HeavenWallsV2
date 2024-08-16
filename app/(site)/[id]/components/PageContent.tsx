import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface props {
  id: number;
}

export default function PageContent({ id }: props) {
  const fetchTodo = async (id: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );
    if (!response.ok) {
      throw new Error("API ERROR");
    }
    return response.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["walls", id],
    queryFn: () => fetchTodo(id),
  });

  if (isLoading) {
    return <div className="min-h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="min-h-screen">Error loading data</div>;
  }

  return (
    <div className="min-h-screen">
      <h1>Todo</h1>
      <p>ID: {data.id}</p>
      <p>Title: {data.title}</p>
      <p>Completed: {data.completed ? "Yes" : "No"}</p>
      <Link href={`/${Number(id) + 1}`}>Next</Link>
    </div>
  );
}
