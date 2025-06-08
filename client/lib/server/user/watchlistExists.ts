'use server'

// import { Fascinate } from 'next/font/google'
import { cookies } from 'next/headers'
// import { describe } from 'node:test'

export const watchlistExists = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')
  if (!accessToken) return null
  const watchlistsExistsResponse = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/watchlists/watchlists',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  )
  const watchlistData = await watchlistsExistsResponse.json()
  // console.log(watchlistData)
  if (watchlistData.length > 0) return watchlistData[0]

  const createWatchlistResponse = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/watchlists/watchlists',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Favourites',
        description:
          "Created a new watchlist automatically as you don't already have one",
        is_public: false,
      }),
    }
  )

  // const createdWatchlistData = await createWatchlistResponse.json()
  const newWatchlistResponse = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + '/watchlists/watchlists',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    }
  )
  const newWatchlistData = await newWatchlistResponse.json()
  // console.log(newWatchlistData)
  return newWatchlistData[0]
}
