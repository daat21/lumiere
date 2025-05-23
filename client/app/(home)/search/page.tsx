import { SelectTags } from '@/components/search/SelectTags'
import { MovieHorizontalCard } from '@/components/home/MovieCard'
import { getSearchResultsByMovie } from '@/lib/tmdb'
import { getSearchResultsByPerson } from '@/lib/tmdb'
import { PeopleCard } from '@/components/search/PeopleCard'
import { DiscoverPagination } from '@/components/discover/DiscoverPagination'
import { NoResults } from '@/components/search/NoRusult'

interface Movie {
  id: number
  title: string
  original_title: string
  poster_path: string | null
  release_date: string
  overview: string
}

interface Person {
  id: number
  name: string
  profile_path: string | null
}

export default async function SearchPage(props: {
  searchParams: Promise<{ query: string; type: string; page: number }>
}) {
  const { query, type, page } = await props.searchParams
  const movieResults = await getSearchResultsByMovie(query, page)
  const peopleResults = await getSearchResultsByPerson(query, page)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <h1>Search &quot;{query}&quot;</h1>
      <SelectTags />
      {type === 'movie' && (
        <>
          <div className="flex flex-col gap-6">
            {movieResults.results.map((result: Movie) => (
              <MovieHorizontalCard
                key={result.id}
                title={result.title}
                original_title={result.original_title}
                image={result.poster_path}
                release_date={result.release_date}
                overview={result.overview}
                id={result.id.toString()}
              />
            ))}
          </div>
          {movieResults.results.length === 0 && <NoResults />}
          {movieResults.results.length > 0 && (
            <DiscoverPagination
              currentPage={movieResults.page}
              totalPages={movieResults.total_pages}
            />
          )}
        </>
      )}
      {type === 'people' && (
        <>
          <div className="flex flex-col gap-6">
            {peopleResults.results.map((result: Person) => (
              <PeopleCard
                key={result.id}
                name={result.name}
                image={result.profile_path}
              />
            ))}
          </div>
          {peopleResults.results.length === 0 && <NoResults />}
          {peopleResults.results.length > 0 && (
            <DiscoverPagination
              currentPage={peopleResults.page}
              totalPages={peopleResults.total_pages}
            />
          )}
        </>
      )}
    </div>
  )
}
