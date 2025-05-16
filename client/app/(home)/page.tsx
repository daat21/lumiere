import { Suspense } from 'react'
import { MostPopular } from '@/components/home/MostPopular'
import { MoreToExplore } from '@/components/home/MoreToExplore'
import { Bookmark } from 'lucide-react'
import { ChatBox } from '@/components/home/ChatBox/ChatBox'
import { getGenresList, getPopularMovies } from '@/lib/tmdb'

export default async function Home() {
  const genresListPromise = getGenresList()
  const popularMoviesPromise = getPopularMovies()

  const [genresList, popularMovies] = await Promise.all([
    genresListPromise,
    popularMoviesPromise,
  ])

  if (!popularMovies) {
    return <div>Error loading movies. Please check your API key configuration.</div>
  }

  const initialMoreToExploreMovies = popularMovies.slice(10, 19)

  const testFetching = await fetch('http://localhost:8000/')
  console.log(testFetching)

  return (
    <div className="flex flex-col gap-12">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <Recomendations /> */}
          <ChatBox />
        </Suspense>
      </div>
      <div>
        <h1>Most Popular</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <MostPopular movies={popularMovies} />
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
