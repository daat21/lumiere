import { Filters } from '@/components/discover/Filters'
import { Tags } from '@/components/discover/Tags'
import { getDiscoverMovies, getGenresList, getPopularMovies } from '@/lib/tmdb'
import { MovieResults } from '@/components/discover/MovieResults'
import { Button } from '@/components/ui/button'
import DiscoverPagination from '@/components/discover/DiscoverPagination'

export default async function Discover(props: {
  searchParams: Promise<{
    sort_by?: string
    language?: string
    release_date_gte?: string
    release_date_lte?: string
    min_votes?: string
    genre_id?: string
  }>
}) {
  const {
    sort_by,
    language,
    release_date_gte,
    release_date_lte,
    min_votes,
    genre_id,
  } = await props.searchParams

  const genres = await getGenresList()
  const movies = await getDiscoverMovies({
    sort_by,
    language,
    release_date_gte,
    release_date_lte,
    min_votes,
    genre_id,
  })

  return (
    <div className="flex flex-col gap-4">
      <h1>Discover</h1>
      <form action="/discover" method="get" className="flex flex-col gap-4">
        <Filters />
        <Tags genres={genres} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" className="cursor-pointer">
            <a href="/discover">Clear Filters</a>
          </Button>
          <Button className="cursor-pointer" type="submit">
            Apply Filters
          </Button>
        </div>
      </form>
      <MovieResults movies={movies} />
      <DiscoverPagination />
    </div>
  )
}
