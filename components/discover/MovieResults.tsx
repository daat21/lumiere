import { MovieCard } from '../home/MovieCard'

interface Movie {
  id: number
  title: string
  vote_average: number
  poster_path: string
}
export function MovieResults({ movies }: { movies: Movie[] }) {
  return (
    <div className="mx-auto mt-10 grid grid-cols-5 gap-15">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          rating={movie.vote_average}
          image={movie.poster_path}
        />
      ))}
    </div>
  )
}
