'use client'

import { useState,useEffect } from "react"
import {Bookmark} from 'lucide-react'
import {toast} from 'sonner'
import { watchlistExists } from "@/lib/server/user/watchlistExists"
import { addMovieToWatchlist } from "@/lib/server/user/addMovieToWatchlist"
import { deleteMovieFromWatchlist } from "@/lib/server/user/deleteMovieFromWatchlist"

export function WatchlistBookmark({movie_id}:{movie_id: string}){
    const [bookmarked,setBookmarked]=useState(false)
    useEffect(()=>{
        const isInWatchlist = async () =>{
            const watchlistResponse = await watchlistExists().then((data:{_id:string, movies:any}) => {
                if(!data._id) return false
                return data
            })
            if(!watchlistResponse) return
            if(watchlistResponse?.movies?.some((movie: any)=>movie.movie_id==movie_id)){
                setBookmarked(true)
            }
            
        }
        isInWatchlist()
    },[movie_id])

    const bookmarkToggle =async()=>{
        if(bookmarked){
            const {done} = await deleteMovieFromWatchlist(movie_id)
            if(done){
                setBookmarked(false)
                toast.success('Movie removed from Watchlist')
            }
            else {
                toast.error('Failure removing from Watchlist')
            }
        }
        else {
            const {done} = await addMovieToWatchlist(movie_id)
            if(done){
                setBookmarked(true)
                toast.success('Movie added to Watchlist')
            }
            else {
                toast.error('Failure adding to Watchlist')
            }
        }
    }

    return (
        <button className="group rounded-full p-1">
              <Bookmark className={`"h-5 w-5 transition ${bookmarked?'fill-green-500 text-green-500':'text-green-500'} group-hover:fill-green-500 group-hover:text-green-500"`} />
        </button>
    )
}

