import Link from 'next/link'
import { Button } from '../ui/button'
import { ModeToggle } from '@/components/darkmode'
import { DropdownMenuComponent } from './DropDownMenu'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { SearchBar } from './SearchBar'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import UserDropdownMenu from './UserDropdownMenu'

export async function NavigationBar() {
  const user = await getCurrentUser()

  return (
    <nav className="flex items-center justify-between p-3 px-4 md:p-5 md:px-10">
      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenuComponent />
        <Link href="/">
          <span className="text-lg md:text-2xl font-bold">Lumiere</span>
        </Link>
      </div>
      {/* <div className="relative ml-40 w-1/3"> */}
      <div className="relative w-1/3 hidden sm:block">
        <SearchBar />
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <Link
          href="/watchlist"
          className="group flex w-auto md:w-40 flex-1 items-center gap-1"
        >
          <BookmarkIcon className="text-foreground group-hover:fill-foreground h-5 w-5 md:h-6 md:w-6" />
          <span className="font-semibold hidden sm:inline">Watchlist</span>
        </Link>
        {user ? (
          <div className="flex items-center gap-1 md:gap-4 md:mr-6">
            <p className="hidden md:block">Hi, {user.username}</p>
            <UserDropdownMenu
              avatarUrl={user.avatar_url}
              username={user.username}
            />
          </div>
        ) : (
          <>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/signup" className="font-semibold">
                Sign Up
              </Link>
            </Button>
            <Button asChild className="px-2 py-1 text-xs md:px-4 md:text-sm">
              <Link href="/login" className="font-semibold">
                Login
              </Link>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  )
}
