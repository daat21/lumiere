'use server'

import { z } from 'zod'

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export type LoginFormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
      }
      message?: string | null
      success?: boolean
      error?: string
    }
  | undefined

export const login = async (prevState: LoginFormState, formData: FormData) => {
  const validatedFields = loginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const userData = {
    username: validatedFields.data.username,
    password: validatedFields.data.password,
  }

  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  const data = await res.json()

  if (res.ok) {
    return {
      success: true,
      message: 'User logged in successfully',
    }
  } else if (res.status === 401) {
    return {
      success: false,
      error: data.detail,
    }
  } else {
    return {
      success: false,
      error: 'Failed to login',
    }
  }
}
