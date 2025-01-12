import Link from "next/link";

export default function NavBar() {
  return (
    <div className="text-xl">
      <Link className="pr-4" href="/">
        Home
      </Link>
      |
      <Link className="px-4" href="/admin">
        Admin
      </Link>
    </div>
  );
}