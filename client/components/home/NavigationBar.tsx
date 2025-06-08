import Link from 'next/link'
import { Button } from '../ui/button'
import { ModeToggle } from '@/components/darkmode'
import { DropdownMenuComponent } from './DropDownMenu'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { SearchBar } from './SearchBar'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import UserDropdownMenu from './UserDropdownMenu'
import Image from 'next/image'

export async function NavigationBar() {
  const user = await getCurrentUser()

  return (
    <nav className="flex items-center justify-between p-3 px-4 sm:p-4 md:p-5 md:px-10">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <DropdownMenuComponent />
        <Link href="/" className="flex items-center gap-2">
          <Image src="/lumiere-01-1.svg" alt="Lumiere" width={50} height={50} />
          <span className="hidden text-lg font-bold md:text-2xl lg:inline">
            Lumiere
          </span>
        </Link>
      </div>
      <div className="relative w-full max-w-[450px]">
        <SearchBar />
      </div>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        <Link
          href="/watchlist"
          className="group flex items-center gap-1 sm:gap-2"
        >
          <BookmarkIcon className="text-foreground group-hover:fill-foreground h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden font-semibold sm:inline">Watchlist</span>
        </Link>
        {user ? (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <p className="hidden text-sm md:block lg:text-base">
              Hi, {user.username}
            </p>
            <UserDropdownMenu
              avatarUrl={user.avatar_url}
              username={user.username}
            />
          </div>
        ) : (
          <>
            <Button
              asChild
              variant="outline"
              className="hidden text-sm sm:inline-flex"
            >
              <Link href="/signup" className="font-semibold">
                Sign Up
              </Link>
            </Button>
            <Button asChild className="px-2 py-1 text-xs sm:px-3 sm:text-sm">
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
