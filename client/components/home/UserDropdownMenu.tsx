import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserRoundPen, LogOut } from 'lucide-react'
import Link from 'next/link'
import { deleteSession } from '@/lib/server/user/deleteSession'

export default function UserDropdownMenu({
  avatarUrl,
  username,
}: {
  avatarUrl?: string
  username?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 outline-none focus:outline-none focus-visible:outline-none">
        <Avatar className="border-ring border">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-sm font-bold">
          Your Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem>
            <UserRoundPen className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <form action={deleteSession}>
            <button type="submit" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
