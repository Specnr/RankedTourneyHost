import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between p-4 border-b sticky top-0 z-20 bg-background">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">Ranked Tourney Host</h1>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost">Admin</Button>
        </Link>
      </div>
    </header>
  );
}