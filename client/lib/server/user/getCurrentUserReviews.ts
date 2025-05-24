'use server'

import { cookies } from 'next/headers'

export const getCurrentUserReviews = async (sort_by?: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return null
  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL +
      `/reviews/users/me/reviews?sort_by=${sort_by || 'created_at'}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  )
  const data = await res.json()
  return data
}
