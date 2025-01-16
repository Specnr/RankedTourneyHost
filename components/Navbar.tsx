import Link from "next/link";

export default function NavBar() {
  return (
    <div className="text-xl divide-x divide-gray-700 grid grid-cols-2 gap-4 justify-center">
      <Link className="pl-4" href="/">
        Home
      </Link>
      <Link className="pl-4" href="/admin">
        Admin
      </Link>
    </div>
  );
}