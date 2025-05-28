import { getGenresList, getMovieDetailsByIds } from '@/lib/tmdb'
import { getCurrentUserInfo } from '@/lib/server/user/getCurrentUserInfo'
import WatchlistClientSide from '@/components/watchlist/watchlistClientSide'

// interface RequiredDetailsProps {
//   id: string
//   title: string
//   backdrop_path: string
// }

interface MovieDetails {
  id: number
  title: string
  backdrop_path: string
  genres: {
    id: string
    name: string
  }[]
}

export default async function Watchlist() {
  const genresListPromise = getGenresList()
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
        backdrop_path: detail.backdrop_path,
        genres: detail.genres,
      }))
      return required_details
    })
    .catch(() => [])

  const [genresList] = await Promise.all([genresListPromise])

  if (userWatchlist.length == 0)
    return <h1>No movies in watchlist, {';_;'}!</h1>

  // console.log(userWatchlist)
  // console.log(genresList)
  return (
    /*<div className="flex flex-col gap-12">
      <div>
        <h1>Watchlist</h1>
      </div>
      <div className="flex flex-col">
        <div>
          <SearchBar movies={userWatchlist}/>
        </div>
        <div>
          <MoreToExplore
            initialGenres={genresList}
            initialMovies={userWatchlist}
          />
        </div>
      </div>
    </div>*/

    <WatchlistClientSide
      genresList={genresList}
      userWatchlist={userWatchlist}
    />
  )
}
