import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import { EditProfile } from './settings/EditProfile'
import { EditAccount } from './settings/EditAccount'

export async function ProfileContainerV2() {
  const user = await getCurrentUser()

  return (
    <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
      <Avatar className="border-ring bg-background size-24 border sm:size-35">
        <AvatarImage src={user?.avatar_url} alt={user?.username} />
        <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="w-full sm:w-auto">
        <div className="flex flex-col gap-2 sm:gap-1">
          <h1 className="text-xl font-bold sm:text-2xl">@{user?.username}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {user?.bio
              ? user.bio
              : "This person is lazy and hasn't written their bio."}
          </p>
          <p className="text-muted-foreground text-xs italic sm:text-sm">
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
        <div className="mt-4 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4">
          <EditProfile user={user} />
          <EditAccount email={user?.email} />
        </div>
      </div>
    </div>
  )
}
