import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import { EditProfile } from './settings/EditProfile'
import { EditAccount } from './settings/EditAccount'

export async function ProfileContainerV2() {
  const user = await getCurrentUser()

  return (
    <div className="relative flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:text-left sm:gap-5">
      <Avatar className="border-ring bg-background size-24 sm:size-35 border">
        <AvatarImage src={user?.avatar_url} alt={user?.username} />
        <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="w-full sm:w-auto">
        <div className="flex flex-col gap-2 sm:gap-1">
          <h1 className="text-xl sm:text-2xl font-bold">@{user?.username}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {user?.bio
              ? user.bio
              : "This person is lazy and hasn't written their bio."}
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm italic">
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
        {/* <Button variant="outline" className="mt-4">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button> */}
        <div className="mt-4 flex flex-col gap-2 w-full sm:flex-row sm:gap-4 sm:w-auto">
          <EditProfile user={user} />
          <EditAccount email={user?.email} />
        </div>
      </div>
    </div>
  )
}
