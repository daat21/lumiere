'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updateSession() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (!refreshToken) return null

  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/auth/refresh',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }
  )

  if (!res.ok) redirect('/login')

  const data = await res.json()

  const { access_token: newAccessToken, refresh_token: newRefreshToken } = data

  cookieStore.set('access_token', newAccessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 30,
    sameSite: 'lax',
    path: '/',
  })

  cookieStore.set('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })

  return {
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
  }
}
