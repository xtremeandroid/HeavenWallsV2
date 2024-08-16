import Link from "next/link";

export default function Header() {
  return (
    <header className="h-14 w-full bg-black text-white flex px-8 items-center justify-center rounded-b-sm gap-x-12">
      <Link href="/">Home</Link>
      <Link href="/top">Top Rated</Link>
      <Link href="/latest">Latest</Link>
      <Link href="/random">Random</Link>
    </header>
  );
}
