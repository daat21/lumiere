import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInput } from '@/components/home/ChatInput'
import { MovieHorizontalCard } from '@/components/home/MovieCard'
import { getTopRatedMovies } from '@/lib/tmdb'
import { use } from 'react'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  overview: string
  original_title: string
}

export function Recomendations() {
  const topRatedMoviesPromise = getTopRatedMovies().then(movies => {
    // Shuffle the array using Fisher-Yates (Knuth) Shuffle
    for (let i = movies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[movies[i], movies[j]] = [movies[j], movies[i]]
    }
    return movies.slice(0, 5)
  })
  const topRatedMovies = use(topRatedMoviesPromise)

  return (
    <div className="flex justify-center">
      <Card className="w-9/10 overflow-hidden rounded-lg py-0 shadow-lg">
        <CardHeader>
          <CardTitle className="mt-5 flex items-center gap-2 text-2xl font-semibold">
            <SparklesIcon className="h-6 w-6" />
            AI Recommendation for you
          </CardTitle>
        </CardHeader>
        <CardContent className="mb-4 flex flex-col gap-4">
          <ScrollArea className="h-93 w-full rounded-md">
            <div className="flex flex-col gap-2 p-4">
              <p className="font-semibold">
                Here&apos;s today&apos;s recommendation for you:
              </p>
              <ul className="flex flex-col gap-4">
                {topRatedMovies.map((movie: Movie) => (
                  <li key={movie.id}>
                    <MovieHorizontalCard
                      title={movie.title}
                      original_title={movie.original_title}
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      release_date={movie.release_date}
                      overview={
                        movie.overview.length > 280
                          ? movie.overview.slice(0, 280) + '...'
                          : movie.overview
                      }
                      className="bg-sidebar"
                      id={movie.id.toString()}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
          <ChatInput />
        </CardContent>
      </Card>
    </div>
  )
}
