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
    <div className="mx-auto mt-10 grid grid-cols-5 gap-15">
      {moviesList.map(movie => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          rating={movie.vote_average}
          image={movie.poster_path}
          id={movie.id.toString()}
        />
      ))}
    </div>
  )
}
