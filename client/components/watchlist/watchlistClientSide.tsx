'use client'

import { useEffect, useState } from 'react'
import { SearchBar } from './watchlistSearchBar'
import { MoreToExplore } from './moreToExplore'

interface Genre {
  id: number
  name: string
}

interface Movie {
  id: number
  title: string
  backdrop_path: string | null
  genres: {
    id: string
    name: string
  }[]
}

export default function WatchlistClientSide({
  userWatchlist,
  genresList,
}: {
  userWatchlist: Movie[]
  genresList: Genre[]
}) {
  const [searchedMovies, setSearchedMovies] = useState<Movie[]>(userWatchlist)
  useEffect(() => {
    // console.log('Filtered movies changed:', searchedMovies)
  }, [searchedMovies])

  return (
    <div className="flex flex-col gap-6 md:gap-12 px-4 md:px-0">
      <div>
      <h1 className="text-2xl md:text-3xl font-bold">Watchlist</h1>
      </div>
      <div className="flex flex-col gap-6 md:gap-8">
        <div>
          <SearchBar movies={userWatchlist} onSearch={setSearchedMovies} />
        </div>
        <div>
          <MoreToExplore
            initialGenres={genresList}
            initialMovies={searchedMovies}
          />
        </div>
      </div>
    </div>
  )
}
