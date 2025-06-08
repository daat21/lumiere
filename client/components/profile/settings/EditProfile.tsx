'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateCurrentUserProfile } from '@/lib/server/user/updateCurrentUserProfile'
import { Loader2, Pencil } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type User = {
  username: string
  email: string
  bio: string
  avatar_url: string
}

export function EditProfile({ user }: { user: User }) {
  const [bio, setBio] = useState(user.bio)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url)

  const [state, formAction, isPending] = useActionState(
    updateCurrentUserProfile,
    undefined
  )
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      toast.success('Profile updated successfully')
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder={user.username}
                // defaultValue={user.username}
              />
              {state?.errors?.username && (
                <p className="text-sm text-red-500">{state.errors.username}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder={user.email}
                defaultValue={user.email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder={user.bio}
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
              {state?.errors?.bio && (
                <p className="text-sm text-red-500">{state.errors.bio}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatar_url" className="text-xs sm:text-sm">
                Upload your online Avatar
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                type="text"
                placeholder={avatarUrl}
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Paste the image URL (right click an online image &rarr; Copy
                Image Address)
              </p>
              {state?.errors?.avatar_url && (
                <p className="text-sm text-red-500">
                  {state.errors.avatar_url}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
