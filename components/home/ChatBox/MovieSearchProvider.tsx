import { useState, useEffect, ReactNode } from 'react'
import { Message } from 'ai'

interface MovieResult {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  overview: string
  original_title: string
}

interface MovieSearchProviderProps {
  messages: Message[]
  children: (props: {
    movieSearches: Map<string, MovieResult | null>
    loadingMovies: Set<string>
  }) => ReactNode
}

const MOVIE_SEARCH_API_ENDPOINT = '/api/movie-search?title='
const MOVIE_SEARCH_REGEX = /\[MOVIE_SEARCH:(.*?)\]/g

export function MovieSearchProvider({
  messages,
  children,
}: MovieSearchProviderProps) {
  const [movieSearches, setMovieSearches] = useState<
    Map<string, MovieResult | null>
  >(new Map())
  const [loadingMovies, setLoadingMovies] = useState<Set<string>>(new Set())

  // Extract movie search requests from messages and fetch movie data
  useEffect(() => {
    const fetchMovieData = async (title: string) => {
      if (loadingMovies.has(title) || movieSearches.has(title)) return

      // Mark this title as loading
      setLoadingMovies(prev => new Set(prev).add(title))

      try {
        const response = await fetch(
          `${MOVIE_SEARCH_API_ENDPOINT}${encodeURIComponent(title)}`
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          setMovieSearches(prev => new Map(prev).set(title, data.results[0]))
        } else {
          setMovieSearches(prev => new Map(prev).set(title, null))
        }
      } catch (error) {
        console.error('Error fetching movie:', error)
        setMovieSearches(prev => new Map(prev).set(title, null))
      } finally {
        setLoadingMovies(prev => {
          const updated = new Set(prev)
          updated.delete(title)
          return updated
        })
      }
    }

    // Extract movie search patterns from assistant messages
    for (const message of messages) {
      if (message.role === 'assistant' && message.content) {
        let match
        const regex = new RegExp(MOVIE_SEARCH_REGEX) // Reset regex state
        while ((match = regex.exec(message.content)) !== null) {
          const movieTitle = match[1].trim()
          if (
            movieTitle &&
            !movieSearches.has(movieTitle) &&
            !loadingMovies.has(movieTitle)
          ) {
            fetchMovieData(movieTitle)
          }
        }
      }
    }
  }, [messages, movieSearches, loadingMovies])

  return (
    <>
      {children({
        movieSearches,
        loadingMovies,
      })}
    </>
  )
}
