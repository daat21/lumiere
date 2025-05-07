import { Filters } from '@/components/discover/Filters'
import { Tags } from '@/components/discover/Tags'
import { Suspense } from 'react'
import { getGenresList, getPopularMovies } from '@/lib/tmdb'
import { MovieResults } from '@/components/discover/MovieResults'

export default async function Discover() {
  const genres = await getGenresList()
  const popularMovies = await getPopularMovies()

  return (
    <div className="flex flex-col gap-4">
      <h1>Discover</h1>
      <Filters />
      <Suspense>
        <Tags genres={genres} />
      </Suspense>
      <Suspense>
        <MovieResults movies={popularMovies} />
      </Suspense>
    </div>
  )
}
