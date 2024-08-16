"use client";
import PageContent from "./components/PageContent";
export default function Page({ params }: { params: { id: number } }) {
  return <PageContent id={params.id} />;
}
