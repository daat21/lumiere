import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { House, Bookmark, User, Settings } from "lucide-react";

export function DropdownMenuComponent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Bars3Icon className="h-8 w-8 text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-3 mt-2 ml-8 w-40">
        <Link href="/">
          <DropdownMenuItem>
            <House className="w-6 h-6" />
            <span className="text-lg font-bold">Home</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/watchlist">
          <DropdownMenuItem>
            <Bookmark className="w-6 h-6" />
            <span className="text-lg font-bold">Watchlist</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile">
          <DropdownMenuItem>
            <User className="w-6 h-6" />
            <span className="text-lg font-bold">Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem>
            <Settings className="w-6 h-6" />
            <span className="text-lg font-bold">Settings</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
