import { NextRequest } from 'next/server'

export const runtime = 'edge'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_API_URL = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const movieTitle = searchParams.get('title')

  if (!movieTitle) {
    return new Response(JSON.stringify({ error: 'No Movie title' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const response = await fetch(
    `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieTitle)}&language=en-US&page=1&include_adult=false`,
    { headers: { Accept: 'application/json' } }
  )

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}
