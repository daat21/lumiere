'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TrendingUp, UsersRound, Clapperboard } from 'lucide-react'
import { Input } from '../ui/input'
import {
  getTrendingMovies,
  getSearchResultsByMovie,
  getSearchResultsByPerson,
} from '@/lib/tmdb'
import { useDebouncedCallback } from 'use-debounce'
import { useRouter } from 'next/navigation'

interface Movie {
  id: number
  title: string
}

interface Person {
  id: number
  name: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [movieResults, setMovieResults] = useState<Movie[]>([])
  const [personResults, setPersonResults] = useState<Person[]>([])
  const [isLoadingTrending, setIsLoadingTrending] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isDropdownOpen && query === '' && trendingMovies.length === 0) {
      const fetchTrending = async () => {
        setIsLoadingTrending(true)
        try {
          const movies = await getTrendingMovies()
          setTrendingMovies(movies.slice(0, 10))
        } catch (error) {
          console.error('Failed to fetch trending movies:', error)
        } finally {
          setIsLoadingTrending(false)
        }
      }
      fetchTrending()
    }
  }, [isDropdownOpen, query, trendingMovies.length])

  const fetchSearchResults = useDebouncedCallback(
    async (currentQuery: string) => {
      if (!currentQuery) {
        setMovieResults([])
        setPersonResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const [movieData, personData] = await Promise.all([
          getSearchResultsByMovie(currentQuery),
          getSearchResultsByPerson(currentQuery),
        ])

        // Deduplicate movie results by title using reduce for better type safety
        const uniqueMovies = movieData.results
          ? movieData.results.reduce((acc: Movie[], current: Movie) => {
              if (!acc.some(movie => movie.title === current.title)) {
                acc.push(current)
              }
              return acc
            }, [])
          : []

        setMovieResults(uniqueMovies) // Set the deduplicated results
        setPersonResults(personData.results || [])
      } catch (error) {
        console.error('Failed to fetch search results:', error)
        setMovieResults([])
        setPersonResults([])
      } finally {
        setIsSearching(false)
      }
    },
    1500
  )

  const handleFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleBlur = () => {
    setIsDropdownOpen(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    if (!isDropdownOpen) {
      setIsDropdownOpen(true)
    }
    fetchSearchResults(newQuery)
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/search?query=${query}&type=movie`)
  }

  const handleSearchClick = (content: string, type?: string) => {
    router.push(`/search?query=${content}&type=${type}`)
  }

  const getFirstMovieSuggestion = () => {
    return movieResults.length > 0 ? movieResults[0].title : query
  }

  const getFirstPersonSuggestion = () => {
    return personResults.length > 0 ? personResults[0].name : query
  }

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2" />
      <form onSubmit={handleSearch}>
        <Input
          placeholder="Search movies, actors..."
          className="pl-10 focus:rounded-b-none focus:border-3 focus-visible:ring-0"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        />
      </form>
      {isDropdownOpen && (
        <div
          className="bg-popover border-input absolute top-full right-0 left-0 z-20 mt-0 w-full overflow-hidden overflow-y-auto rounded-md rounded-t-none border shadow-lg"
          role="listbox"
        >
          {query === '' ? (
            isLoadingTrending ? (
              <div className="text-muted-foreground p-3 text-sm">
                Loading trending...
              </div>
            ) : (
              trendingMovies.length > 0 && (
                <>
                  <h2 className="border-border flex items-center gap-2 border-b px-3 py-2 text-base font-bold">
                    <TrendingUp className="h-4 w-4" />
                    Trending Movies
                  </h2>
                  <ul>
                    {trendingMovies.map(movie => (
                      <li
                        key={`trending-${movie.id}`}
                        className="hover:bg-accent cursor-pointer px-3 py-2 text-sm"
                        onMouseDown={() =>
                          handleSearchClick(movie.title, 'movie')
                        }
                      >
                        <Clapperboard className="mr-2 inline h-4 w-4 opacity-50" />
                        {movie.title}
                      </li>
                    ))}
                  </ul>
                </>
              )
            )
          ) : isSearching ? (
            <div className="text-muted-foreground p-3 text-sm">
              Searching...
            </div>
          ) : (
            <ul>
              <li
                className="hover:bg-accent cursor-pointer px-3 py-2 text-sm"
                onMouseDown={() =>
                  handleSearchClick(getFirstMovieSuggestion(), 'movie')
                }
              >
                <Clapperboard className="mr-2 inline h-4 w-4" />
                <span className="font-bold">
                  {getFirstMovieSuggestion()}
                </span>{' '}
                <span className="text-muted-foreground font-bold">
                  in movies
                </span>
              </li>
              <li
                className="hover:bg-accent cursor-pointer px-3 py-2 text-sm"
                onMouseDown={() =>
                  handleSearchClick(getFirstPersonSuggestion(), 'people')
                }
              >
                <UsersRound className="mr-2 inline h-4 w-4" />
                <span className="font-bold">
                  {getFirstPersonSuggestion()}
                </span>{' '}
                <span className="text-muted-foreground font-bold">
                  in people
                </span>
              </li>

              {(movieResults.length > 1 || personResults.length > 0) && (
                <hr className="border-border my-1" />
              )}

              {movieResults.length > 1 &&
                movieResults.slice(1, 9).map(movie => (
                  <li
                    key={`movie-${movie.id}`}
                    className="hover:bg-accent cursor-pointer px-3 py-2 text-sm"
                    onMouseDown={() => handleSearchClick(movie.title, 'movie')}
                  >
                    <Clapperboard className="mr-2 inline h-4 w-4 opacity-50" />
                    {movie.title}
                  </li>
                ))}

              {movieResults.length === 0 && personResults.length === 0 && (
                <li className="text-muted-foreground px-3 py-2 text-sm">
                  No results found for &quot;{query}&quot;.
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
