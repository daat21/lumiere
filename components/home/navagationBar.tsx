import Link from 'next/link'
import { Button } from '../ui/button'
import { ModeToggle } from '@/components/darkmode'
import { DropdownMenuComponent } from './DropDownMenu'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { SearchBar } from './SearchBar'
export function NavigationBar() {
  return (
    <nav className="flex items-center justify-between p-5 px-10">
      <div className="flex items-center gap-4">
        <DropdownMenuComponent />
        <Link href="/">
          <span className="text-2xl font-bold">Lumiere</span>
        </Link>
      </div>
      <div className="relative ml-40 w-1/3">
        <SearchBar />
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/watchlist"
          className="group flex w-40 flex-1 items-center gap-1"
        >
          <BookmarkIcon className="text-foreground group-hover:fill-foreground h-6 w-6" />
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
  )
}
