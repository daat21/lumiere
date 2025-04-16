import { Suspense } from 'react'

import { Recomendations } from '@/components/home/recomendations'
import { MostPopular } from '@/components/home/mostPopular'
import { MoreToExplore } from '@/components/home/moreToExplore'
import { Bookmark } from 'lucide-react'

import { getGenresList, getPopularMovies } from '@/lib/tmdb'

export default async function Home() {
  const genresListPromise = getGenresList()
  const popularMoviesPromise = getPopularMovies()

  const [genresList, popularMovies] = await Promise.all([
    genresListPromise,
    popularMoviesPromise,
  ])

  const initialMoreToExploreMovies = popularMovies.slice(10, 19)

  return (
    <div className="flex flex-col gap-12">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <Recomendations movies={topRatedMoviesPromise} /> */}
          <Recomendations />
        </Suspense>
      </div>
      <div>
        <h1>Most Popular</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <MostPopular movies={popularMoviesPromise} />
        </Suspense>
      </div>
      <div>
        <h1>From your watchlist</h1>
        <div className="my-10 flex flex-col items-center gap-4">
          <p>
            <Bookmark className="h-13 w-13" />
          </p>
          <p className="text-lg font-semibold">
            Save shows and movies to keep track of what you want to watch.
          </p>
        </div>
      </div>
      <div>
        <h1>More to explore</h1>
        <MoreToExplore
          initialGenres={genresList}
          initialMovies={initialMoreToExploreMovies}
        />
      </div>
    </div>
  )
}
