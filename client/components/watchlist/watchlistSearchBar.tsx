'use client'

import * as React from 'react'
import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '../ui/input'
import { useDebouncedCallback } from 'use-debounce'

interface Movie {
  id: number
  title: string
  backdrop_path: string | null
  genres: {
    id: string
    name: string
  }[]
}

export function SearchBar({
  movies,
  onSearch,
}: {
  movies: Movie[]
  onSearch: (searchedMovies: Movie[]) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedCallback((searchSubString: string) => {
    const searched = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchSubString.toLowerCase())
    )
    onSearch(searched)
    // console.log(searched)
  }, 500)
  const handleSearch = (searchEvent: React.ChangeEvent<HTMLInputElement>) => {
    const value = searchEvent.target.value
    // console.log(value)
    setSearchQuery(value)
    debouncedSearch(value)
  }
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2" />
      <Input
        placeholder="Search your watchlist..."
        className="pl-10 focus:rounded-b-none focus:border-3 focus-visible:ring-0"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  )
}
