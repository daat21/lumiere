'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'

const updateCurrentUserPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    }),
  confirmNewPassword: z.string(),
})

export type UpdateCurrentUserPasswordState =
  | {
      errors?: {
        currentPassword?: string[]
        newPassword?: string[]
        confirmNewPassword?: string[]
      }
      message?: string | null
      success?: boolean
      error?: string
    }
  | undefined

export const updateCurrentUserPassword = async (
  prevState: UpdateCurrentUserPasswordState,
  formData: FormData
) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) {
    return {
      success: false,
      error: 'Try logging in again',
    }
  }

  const validatedFields = updateCurrentUserPasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmNewPassword: formData.get('confirmNewPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (
    validatedFields.data.currentPassword === validatedFields.data.newPassword
  ) {
    return {
      errors: {
        newPassword: [
          'New password cannot be the same as the current password',
        ],
      },
    }
  }

  if (
    validatedFields.data.newPassword !== validatedFields.data.confirmNewPassword
  ) {
    return {
      errors: {
        confirmNewPassword: ['Passwords do not match'],
      },
    }
  }

  const userData = {
    current_password: validatedFields.data.currentPassword,
    new_password: validatedFields.data.newPassword,
    confirm_password: validatedFields.data.confirmNewPassword,
  }

  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/users/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  const data = await res.json()

  if (res.ok) {
    return {
      success: true,
      message: 'Password updated successfully',
    }
  } else if (res.status === 400) {
    return {
      success: false,
      error: data.detail,
    }
  } else {
    return {
      success: false,
      error: data.detail || 'Failed to update password',
    }
  }
}
