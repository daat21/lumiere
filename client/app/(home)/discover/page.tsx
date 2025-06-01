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
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-screen-lg px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">Discover Movies</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Find your next favorite movie with our powerful filters
            </p>
          </div>

          <form action="/discover" method="get" className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <Filters />
              <Tags genres={genres} />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                formAction={clearFilters}
                type="submit"
              >
                Clear Filters
              </Button>
              <Button className="w-full sm:w-auto" type="submit">
                Apply Filters
              </Button>
            </div>
          </form>

          {moviesData.total_results === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <h2 className="text-xl font-bold sm:text-2xl">No results found</h2>
              <p className="text-center text-sm text-muted-foreground sm:text-base">
                Try adjusting your filters to find more movies.
              </p>
            </div>
          ) : (
            <>
              <MovieResults movies={moviesData.results} />
              {moviesData.total_pages > 1 && (
                <DiscoverPagination
                  currentPage={moviesData.page}
                  totalPages={
                    moviesData.total_pages > 500 ? 500 : moviesData.total_pages
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
