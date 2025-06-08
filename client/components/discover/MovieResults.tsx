'use client'

import { MovieCard } from '../home/MovieCard'
import { useEffect, useState } from 'react'

interface Movie {
  id: number
  title: string
  vote_average: number
  poster_path: string
}

export function MovieResults({ movies }: { movies: Movie[] }) {
  const [moviesList, setMoviesList] = useState(movies)

  useEffect(() => {
    setMoviesList(movies)
  }, [movies])

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {moviesList.map(movie => (
          <div key={movie.id} className="flex justify-center">
            <MovieCard
              title={movie.title}
              rating={movie.vote_average}
              image={movie.poster_path}
              id={movie.id.toString()}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
