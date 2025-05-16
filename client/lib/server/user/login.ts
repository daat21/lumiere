'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
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

  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(userData).toString(),
  })

  const data = await res.json()

  if (res.ok) {
    const { access_token, token_type } = data
    const cookieStore = await cookies()
    cookieStore.set('access_token', access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    })

    revalidatePath('/', 'layout')
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
      error: 'Incorrect username or password',
    }
  }
}
