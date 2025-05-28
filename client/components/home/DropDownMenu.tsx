import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { House, Binoculars, Bookmark, User } from 'lucide-react'

export function DropdownMenuComponent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Bars3Icon className="text-foreground h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 ml-8 flex w-40 flex-col gap-3">
        <Link href="/">
          <DropdownMenuItem>
            <House className="h-6 w-6" />
            <span className="text-lg font-bold">Home</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/discover">
          <DropdownMenuItem>
            <Binoculars className="h-6 w-6" />
            <span className="text-lg font-bold">Discover</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/watchlist">
          <DropdownMenuItem>
            <Bookmark className="h-6 w-6" />
            <span className="text-lg font-bold">Watchlist</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile">
          <DropdownMenuItem>
            <User className="h-6 w-6" />
            <span className="text-lg font-bold">Profile</span>
          </DropdownMenuItem>
        </Link>
        {/* <Link href="/settings">
          <DropdownMenuItem>
            <Settings className="h-6 w-6" />
            <span className="text-lg font-bold">Settings</span>
          </DropdownMenuItem>
        </Link> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
