import { MovieHorizontalCard } from '@/components/home/MovieCard'

interface MovieResult {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  overview: string
  original_title: string
}

interface InitialRecommendationProps {
  movies: MovieResult[]
}

export function InitialRecommendation({ movies }: InitialRecommendationProps) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="font-semibold">
        Here&apos;s today&apos;s recommendation for you:
      </p>
      <ul className="flex flex-col gap-4">
        {movies.map((movie: MovieResult) => (
          <li key={movie.id}>
            <MovieHorizontalCard
              title={movie.title}
              original_title={movie.original_title}
              image={movie.poster_path}
              release_date={movie.release_date}
              overview={
                movie.overview.length > 280
                  ? movie.overview.slice(0, 280) + '...'
                  : movie.overview
              }
              id={movie.id.toString()}
              className="bg-sidebar"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
