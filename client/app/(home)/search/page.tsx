import { SelectTags } from '@/components/search/SelectTags'
import { MovieHorizontalCard } from '@/components/home/MovieCard'
import { getSearchResultsByMovie } from '@/lib/tmdb'
import { getSearchResultsByPerson } from '@/lib/tmdb'
import { PeopleCard } from '@/components/search/PeopleCard'

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
  searchParams: Promise<{ query: string; type: string }>
}) {
  const { query, type } = await props.searchParams
  const searchResults = await getSearchResultsByMovie(query)
  const peopleResults = await getSearchResultsByPerson(query)
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <h1>Search &quot;{query}&quot;</h1>
      <SelectTags />
      {type === 'movie' && (
        <div className="flex flex-col gap-6">
          {searchResults.map((result: Movie) => (
            <MovieHorizontalCard
              key={result.id}
              title={result.title}
              original_title={result.original_title}
              image={result.poster_path}
              release_date={result.release_date}
              overview={result.overview}
            />
          ))}
        </div>
      )}
      {type === 'people' && (
        <div className="flex flex-col gap-6">
          {peopleResults.map((result: Person) => (
            <PeopleCard
              key={result.id}
              name={result.name}
              image={result.profile_path}
            />
          ))}
        </div>
      )}
    </div>
  )
}
