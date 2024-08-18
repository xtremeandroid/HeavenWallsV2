import Link from "next/link";

export default function Header() {
  return (
    <header className="h-14 w-full bg-black text-white flex items-center justify-center rounded-b-sm">
      <Link href="/">HeavenWalls</Link>
    </header>
  );
}
