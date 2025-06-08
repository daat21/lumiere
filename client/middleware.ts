import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const protectedRoutes = ['/profile', '/settings', '/watchlist']

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  const cookieStore = await cookies()
  let accessToken = cookieStore.get('access_token')?.value
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (!accessToken && refreshToken) {
    try {
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

      if (res.ok) {
        const data = await res.json()
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          data

        const response = NextResponse.next()

        response.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 30, // 30 minutes
          sameSite: 'lax',
          path: '/',
        })

        response.cookies.set('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: 'lax',
          path: '/',
        })

        return response
      } else {
        if (isProtectedRoute) {
          const response = NextResponse.redirect(new URL('/login', request.url))
          response.cookies.delete('access_token')
          response.cookies.delete('refresh_token')
          return response
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
