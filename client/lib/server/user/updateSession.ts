'use server'

import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

export async function updateSession() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      console.log('No refresh token found')
      return null
    }

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

    if (!res.ok) {
      console.error('Token refresh failed:', res.status, res.statusText)
      cookieStore.delete('refresh_token')
      return null
    }

    const data = await res.json()
    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      data

    if (!newAccessToken || !newRefreshToken) {
      console.error('Invalid response from refresh endpoint')
      return null
    }

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 30, // 30 minutes
      sameSite: 'lax',
      path: '/',
    })

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      path: '/',
    })

    console.log('Token refreshed successfully')
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    }
  } catch (error) {
    console.error('updateSession error:', error)
    return null
  }
}
