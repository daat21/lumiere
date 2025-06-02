'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'

const updateCurrentUserProfileSchema = z.object({
  username: z
    .string()
    .optional()
    .refine(val => !val || val.length >= 5, {
      message: 'Username must be at least 5 characters long',
    }),
  bio: z
    .string()
    .min(1, { message: 'Bio is required' })
    .max(200, { message: 'Bio must be less than 200 characters' })
    .optional(),
  avatar_url: z.string().min(1, { message: 'Avatar is required' }).optional(),
})

export type UpdateCurrentUserProfileState =
  | {
      errors?: {
        username?: string[]
        bio?: string[]
        avatar_url?: string[]
      }
      message?: string | null
      success?: boolean
      error?: string
    }
  | undefined

export const updateCurrentUserProfile = async (
  prevState: UpdateCurrentUserProfileState,
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

  const validatedFields = updateCurrentUserProfileSchema.safeParse({
    username: formData.get('username'),
    bio: formData.get('bio'),
    avatar_url: formData.get('avatar_url'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const userData = {
    ...(validatedFields.data.username && {
      username: validatedFields.data.username,
    }),
    bio: validatedFields.data.bio,
    avatar_url: validatedFields.data.avatar_url,
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
      message: 'User created successfully',
    }
  } else if (res.status === 400) {
    return {
      success: false,
      error: data.detail,
    }
  } else {
    return {
      success: false,
      error: 'Failed to update user profile',
    }
  }
}
