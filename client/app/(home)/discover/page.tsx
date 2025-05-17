import { Filters } from '@/components/discover/Filters'
import { Tags } from '@/components/discover/Tags'
import { getDiscoverMovies, getGenresList } from '@/lib/tmdb'
import { MovieResults } from '@/components/discover/MovieResults'
import { Button } from '@/components/ui/button'
import { DiscoverPagination } from '@/components/discover/DiscoverPagination'
import { clearFilters } from './actions'

export default async function Discover(props: {
  searchParams: Promise<{
    sort_by?: string
    language?: string
    release_date_gte?: string
    release_date_lte?: string
    min_votes?: string
    genre_id?: string
    page?: string
  }>
}) {
  const {
    sort_by,
    language,
    release_date_gte,
    release_date_lte,
    min_votes,
    genre_id,
    page,
  } = await props.searchParams

  const genres = await getGenresList()
  const moviesData = await getDiscoverMovies({
    sort_by,
    language,
    release_date_gte,
    release_date_lte,
    min_votes,
    genre_id,
    page,
  })

  return (
    <div className="flex flex-col gap-4">
      <h1>Discover</h1>
      <form action="/discover" method="get" className="flex flex-col gap-4">
        <Filters />
        <Tags genres={genres} />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            formAction={clearFilters}
            type="submit"
          >
            Clear Filters
          </Button>
          <Button className="cursor-pointer" type="submit">
            Apply Filters
          </Button>
        </div>
      </form>
      <MovieResults movies={moviesData.results} />
      {moviesData.total_results === 0 && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">No results found</h2>
          <p className="text-muted-foreground">Try adjusting your filters.</p>
        </div>
      )}
      {moviesData.total_pages > 1 && (
        <DiscoverPagination
          currentPage={moviesData.page}
          totalPages={
            moviesData.total_pages > 500 ? 500 : moviesData.total_pages
          }
        />
      )}
    </div>
  )
}
