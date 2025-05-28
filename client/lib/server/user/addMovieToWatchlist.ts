'use server'

import { cookies } from 'next/headers'
import { formatISO } from 'date-fns'
import { watchlistExists } from './watchlistExists'

type Movie = {
  movie_id: string
  title: string
  poster_path: string
  release_date: string
  vote_average: number
}

export const addMovieToWatchlist = async (movie_id: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return { done: false }
  const watchlistResponse = await watchlistExists().then(
    (data: { _id: string; movies: Movie[] }) => {
      if (!data?._id) return false
      return data._id
    }
  )
  if (!watchlistResponse) return { done: false }

  const addToWatchlistResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/watchlists/watchlists/${watchlistResponse}/movies`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movie_id: movie_id,
        added_at: formatISO(new Date()),
        notes: '',
      }),
    }
  )

  return { done: addToWatchlistResponse.ok }
}
