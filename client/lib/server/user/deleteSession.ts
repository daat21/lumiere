'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { revalidatePath } from 'next/cache'

export const deleteSession = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
  revalidatePath('/', 'layout')
  redirect('/')
}
