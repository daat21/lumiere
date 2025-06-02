'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { MovieBackdropCard } from '@/components/home/MovieCard'
import { MovieBackdropCardSkeleton } from '../ui/skeleton/MovieBackdropCardSkeleton'

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

export function MoreToExplore({
  initialGenres,
  initialMovies,
}: {
  initialGenres: Genre[]
  initialMovies: Movie[]
}) {
  const [genres] = useState<Genre[]>(initialGenres)
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  useEffect(() => {
    setMovies(initialMovies)
  }, [initialMovies])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)

  const handleGenreClick = (genreId: number) => {
    if (genreId === selectedGenreId) {
      setSelectedGenreId(null)
      setMovies(initialMovies)
      setError(null)
      setIsLoading(false)
      return
    }

    setSelectedGenreId(genreId)
    setIsLoading(true)
    setError(null)

    try {
      const fetchedMovies = initialMovies.filter((movie: Movie) => {
        if (movie.genres.find(genre => genre.id == String(genreId))) {
          // console.log(movie)
          return movie
        }
      })
      // console.log(fetchedMovies)
      setMovies(fetchedMovies ?? [])
    } catch (err) {
      console.error('Failed to fetch movies by genre:', err)
      setError('Failed to load movies for this genre.')
      setMovies(initialMovies)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-0 mt-4 md:mt-6">
      <div className="flex flex-wrap gap-2 md:gap-4">
        {genres.map(genre => (
          <Badge
            variant="outline"
            key={genre.id}
            className={`cursor-pointer rounded-2xl px-2 md:px-3 py-1 text-sm md:text-base font-normal transition-colors duration-200 ease-in-out ${
              selectedGenreId === genre.id
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground border'
            } `}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </Badge>
        ))}
      </div>

      {isLoading && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="mx-2 my-5">
              <MovieBackdropCardSkeleton />
            </div>
          ))}
        </div>
      )}
      {error && <div className="mt-8 text-center text-red-500">{error}</div>}

      {!isLoading && !error && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {movies.map(movie => (
            <div key={movie.id} className="mx-2 my-5">
              <MovieBackdropCard
                title={movie.title}
                image={movie.backdrop_path}
                id={movie.id.toString()}
              />
            </div>
          ))}
          {movies.length === 0 && (
            <div className="col-span-full mt-8 text-center">
              No movies found...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
