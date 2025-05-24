'use server'

import { cookies } from 'next/headers'

export const getCurrentUser = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return null
  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  })
  const data = await res.json()

  return data
}
