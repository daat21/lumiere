'use server'

import {cookies} from 'next/headers'
import { watchlistExists } from './watchlistExists'

export const deleteMovieFromWatchlist = async (movie_id:string) => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')
    if (!accessToken) return {done:false}
    const watchlistResponse = await watchlistExists().then((data:{_id:string, movies:any}) => {
                    if(!data._id) return false
                    return data._id
                })
                if(!watchlistResponse) return {done:false}
    
    const deleteFromWatchlistResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/watchlists/watchlists/${watchlistResponse}/movies/${movie_id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    })
return {done:false}
}