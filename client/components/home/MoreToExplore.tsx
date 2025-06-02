'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { MovieBackdropCard } from '@/components/home/MovieCard'
import { getMoviesByGenre } from '@/lib/tmdb'
import { MovieBackdropCardSkeleton } from '../ui/skeleton/MovieBackdropCardSkeleton'

interface Genre {
  id: number
  name: string
}

interface Movie {
  id: number
  title: string
  backdrop_path: string | null
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)

  const handleGenreClick = async (genreId: number) => {
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
      const fetchedMovies = await getMoviesByGenre(String(genreId))
      setMovies(fetchedMovies.slice(0, 12))
    } catch (err) {
      console.error('Failed to fetch movies by genre:', err)
      setError('Failed to load movies for this genre.')
      setMovies(initialMovies)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-2 md:mx-4 mt-6">
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="mx-1 md:mx-2 my-2 md:my-4">
              <MovieBackdropCardSkeleton />
            </div>
          ))}
        </div>
      )}
      {error && <div className="mt-8 text-center text-red-500">{error}</div>}

      {!isLoading && !error && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {movies.map(movie => (
            <div key={movie.id} className="mx-1 md:mx-2 my-2 md:my-5">
              <MovieBackdropCard
                title={movie.title}
                image={movie.backdrop_path}
                id={movie.id.toString()}
              />
            </div>
          ))}
          {movies.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-8 text-center">
              No movies found for this genre.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
