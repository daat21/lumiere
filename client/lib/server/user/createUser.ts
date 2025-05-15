'use server'

import { z } from 'zod'

const signupFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z
    .string()
    .min(5, { message: 'Username must be at least 5 characters long' }),
  password: z
    .string()
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    }),
  confirmPassword: z.string(),
})

export type SignupFormState =
  | {
      errors?: {
        email?: string[]
        username?: string[]
        password?: string[]
        confirmPassword?: string[]
      }
      message?: string | null
      success?: boolean
      error?: string
    }
  | undefined

export const createUser = async (
  prevState: SignupFormState,
  formData: FormData
) => {
  const validatedFields = signupFormSchema.safeParse({
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (validatedFields.data.password !== validatedFields.data.confirmPassword) {
    return {
      errors: {
        confirmPassword: ['Passwords do not match'],
      },
    }
  }

  const userData = {
    username: validatedFields.data.username,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    confirm_password: validatedFields.data.confirmPassword,
  }

  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/users/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
  )

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
      error: 'Failed to create user',
    }
  }
}
