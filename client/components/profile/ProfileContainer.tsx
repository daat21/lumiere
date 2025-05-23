import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import { Button } from '../ui/button'

export async function ProfileContainerV2() {
  const user = await getCurrentUser()
  // console.log(user)

  return (
    <div className="relative flex items-center gap-5">
      <Avatar className="border-ring bg-background size-35 border">
        <AvatarImage src={user?.avatar_url} alt={user?.username} />
        <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">@{user?.username}</h1>
          <p className="text-muted-foreground">
            {user?.bio
              ? user.bio
              : "This person is lazy and hasn't written their bio."}
          </p>
          <p className="text-muted-foreground text-sm italic">
            Last login:{' '}
            {user?.last_login
              ? new Date(user.last_login).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>
        <Button variant="outline" className="mt-4">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  )
}
