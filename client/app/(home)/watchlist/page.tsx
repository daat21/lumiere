import { SearchBar } from '@/components/watchlist/searchBar'
import { MoreToExplore } from '@/components/home/MoreToExplore'
import { getGenresList, getPopularMovies } from '@/lib/tmdb'

export default async function Watchlist() {
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
        <h1>Watchlist</h1>
      </div>
      <div className="flex flex-col">
        <div>
          <SearchBar />
        </div>
        <div>
          <MoreToExplore
            initialGenres={genresList}
            initialMovies={initialMoreToExploreMovies}
          />
        </div>
      </div>
    </div>
  )
}
