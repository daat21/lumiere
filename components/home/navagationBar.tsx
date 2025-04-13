import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/darkmode";
import { DropdownMenuComponent } from "./dropdownMenu";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/outline";

export function NavigationBar() {
  return (
    <nav className="flex items-center justify-between p-5 px-10">
      <div className="flex items-center gap-4">
        <DropdownMenuComponent />
        <Link href="/">
          <span className="font-bold text-2xl">Lumiere</span>
        </Link>
      </div>
      <div className="relative w-1/4">
        <MagnifyingGlassIcon className="h-6 w-6 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input placeholder="Search..." className="pl-10" />
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/watchlist"
          className="group flex items-center gap-1 w-40 flex-1"
        >
          <BookmarkIcon className="h-6 w-6 text-foreground group-hover:fill-foreground" />
          <span className="font-semibold">Watchlist</span>
        </Link>
        <Button asChild variant="outline">
          <Link href="/signup" className="font-semibold">
            Sign Up
          </Link>
        </Button>
        <Button asChild>
          <Link href="/login" className="font-semibold">
            Login
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </nav>
  );
}
