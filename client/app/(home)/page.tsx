import { Suspense } from 'react'
import { MostPopular } from '@/components/home/MostPopular'
import { MoreToExplore } from '@/components/home/MoreToExplore'
import { Bookmark } from 'lucide-react'
import { ChatBox } from '@/components/home/ChatBox/ChatBox'
import {
  getGenresList,
  getMovieDetailsByIds,
  getPopularMovies,
} from '@/lib/tmdb'
import { getCurrentUserInfo } from '@/lib/server/user/getCurrentUserInfo'
import { WatchlistCarousel } from '@/components/home/WatchlistCarousel'

interface MovieDetails {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
}

export default async function Home() {
  const genresListPromise = getGenresList()
  const popularMoviesPromise = getPopularMovies()
  const userWatchlist = await getCurrentUserInfo()
    .then(data => data.watchlists[0])
    .then(watchlistMovies =>
      watchlistMovies.movies.map((movie: { movie_id: string }) => {
        return movie.movie_id
      })
    )
    .then(movieIds => Promise.all(movieIds.map(getMovieDetailsByIds)))
    .then((movieDetails: MovieDetails[]) => {
      const required_details = movieDetails.map((detail: MovieDetails) => ({
        id: detail.id,
        title: detail.title,
        poster_path: detail.poster_path,
        vote_average: detail.vote_average,
      }))
      return required_details
    })
    .catch(() => [])
  const [genresList, popularMovies] = await Promise.all([
    genresListPromise,
    popularMoviesPromise,
  ])

  if (!popularMovies) {
    return (
      <div>Error loading movies. Please check your API key configuration.</div>
    )
  }

  const initialMoreToExploreMovies = popularMovies.slice(10, 19)

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
        {userWatchlist.length > 0 ? (
          <Suspense fallback={<div>Loading...</div>}>
            <WatchlistCarousel movies={userWatchlist} />
          </Suspense>
        ) : (
          <div className="my-10 flex flex-col items-center gap-4">
            <p>
              <Bookmark className="h-13 w-13" />
            </p>
            <p className="text-lg font-semibold">
              Save shows and movies to keep track of what you want to watch.
            </p>
          </div>
        )}
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
