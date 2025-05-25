'use server'

import { cookies } from 'next/headers'

export const getCurrentUserActivity = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return null

  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/users/me/activity',
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  )
  const data = await res.json().then(data => data.activities)

  return data
}
