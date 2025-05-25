'use server'

import { cookies } from 'next/headers'

export const watchlistExists = async () => {


  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return null
  const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/watchlists/watchlists', {
    headers: {
      method: 'GET',
      Authorization: `Bearer ${accessToken.value}`,
    },
  })
  const data = await res.json()

  return data
}
