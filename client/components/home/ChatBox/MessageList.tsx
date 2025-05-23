import { Message } from 'ai'
import { ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'
import { MovieHorizontalCard } from '@/components/home/MovieCard'
// import { MovieHorizontalSkeleton } from '@/components/ui/skeleton/MovieSkeleton'

interface MovieResult {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  overview: string
  original_title: string
}

interface MessageListProps {
  messages: Message[]
  movieSearches: Map<string, MovieResult | null>
  // loadingMovies: Set<string>
  initialRecommendation: ReactNode | null
  isLoadingInitial: boolean
}

const MOVIE_SEARCH_REGEX = /\[MOVIE_SEARCH:(.*?)\]/g

export function MessageList({
  messages,
  movieSearches,
  // loadingMovies,
  initialRecommendation,
  isLoadingInitial,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Format message content to replace movie search patterns with actual content
  const formatMessageContent = (content: string) => {
    // Remove the "Recommended Movies:" header and the following bulleted list
    const cleanedContent = content.replace(/\n\nRecommended Movies:[\s\S]*/, '')
    // Remove any remaining MOVIE_SEARCH tags
    return cleanedContent.replace(MOVIE_SEARCH_REGEX, '')
  }

  // Render movie cards for searched movies
  const renderMovieCards = (content: string) => {
    const movieComponents: React.ReactNode[] = []

    // Create a new RegExp object for each call to avoid issues with the lastIndex property
    const regex = new RegExp(MOVIE_SEARCH_REGEX)
    let match
    while ((match = regex.exec(content)) !== null) {
      const movieTitle = match[1].trim()

      // if (loadingMovies.has(movieTitle)) {
      //   movieComponents.push(
      //     <MovieHorizontalSkeleton
      //       key={`loading-${movieTitle}`}
      //       className="bg-sidebar my-2"
      //     />
      //   )
      if (movieSearches.has(movieTitle) && movieSearches.get(movieTitle)) {
        const movie = movieSearches.get(movieTitle)!
        movieComponents.push(
          <MovieHorizontalCard
            key={movie.id}
            title={movie.title}
            original_title={movie.original_title}
            image={movie.poster_path}
            release_date={movie.release_date}
            overview={
              // movie.overview.length > 280
              //   ? movie.overview.slice(0, 280) + '...'
              //   : movie.overview
              movie.overview
            }
            className="bg-sidebar"
            id={movie.id.toString()}
          />
        )
      }
    }

    return movieComponents
  }

  return (
    <div className="flex flex-col gap-8 px-4 pt-4">
      {messages.length === 0 ? (
        isLoadingInitial ? (
          <p className="text-muted-foreground text-center">
            Loading recommendations...
          </p>
        ) : initialRecommendation ? (
          <div className="mr-auto flex max-w-[90%] flex-col rounded-lg px-3 pt-2 pb-1.5">
            {initialRecommendation}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            Ask me about movies or actors!
          </p>
        )
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex max-w-[90%] flex-col rounded-lg px-3 pt-2 pb-1.5',
              message.role === 'user' ? 'bg-foreground ml-auto' : 'mr-auto'
            )}
          >
            <p
              className={cn(
                message.role === 'user' ? 'text-background' : 'font-semibold'
              )}
            >
              {formatMessageContent(message.content)}
            </p>
            {message.role === 'assistant' && (
              <div className="mt-4 flex flex-col gap-5">
                {renderMovieCards(message.content)}
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
