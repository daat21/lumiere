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
import { KeyRound, Loader2 } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { updateCurrentUserPassword } from '@/lib/server/user/updateCurrentUserPassword'

export function EditAccount({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(
    updateCurrentUserPassword,
    undefined
  )
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      toast.success('Password updated successfully')
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
          <KeyRound className="h-4 w-4" />
          Edit Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                defaultValue={email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
              />
              {state?.errors?.currentPassword && (
                <p className="text-sm text-red-500">
                  {state.errors.currentPassword}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" />
              {state?.errors?.newPassword && (
                <p className="text-sm text-red-500">
                  {state.errors.newPassword}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmNewPassword">Confirm Password</Label>
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
              />
              {state?.errors?.confirmNewPassword && (
                <p className="text-sm text-red-500">
                  {state.errors.confirmNewPassword}
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
              {isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
