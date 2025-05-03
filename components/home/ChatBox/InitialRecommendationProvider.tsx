import { useState, useEffect, ReactNode } from 'react'
import { Message } from 'ai'
import { getTopRatedMovies } from '@/lib/tmdb'
import { InitialRecommendation } from './InitialRecommendation'

interface InitialRecommendationProviderProps {
  messages: Message[]
  children: (props: {
    initialRecommendation: ReactNode | null
    isLoadingInitial: boolean
  }) => ReactNode
}

export function InitialRecommendationProvider({
  messages,
  children,
}: InitialRecommendationProviderProps) {
  const [initialRecommendation, setInitialRecommendation] =
    useState<ReactNode | null>(null)
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true)

  // Fetch initial recommendation on mount
  useEffect(() => {
    const fetchInitialRecommendation = async () => {
      try {
        const movies = await getTopRatedMovies()
        // Shuffle the array using Fisher-Yates (Knuth) Shuffle
        for (let i = movies.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[movies[i], movies[j]] = [movies[j], movies[i]]
        }
        const top5Movies = movies.slice(0, 5)

        setInitialRecommendation(<InitialRecommendation movies={top5Movies} />)
      } catch (error) {
        console.error('Error fetching initial recommendations:', error)
        setInitialRecommendation(
          "Sorry, couldn't fetch recommendations at the moment."
        )
      } finally {
        setIsLoadingInitial(false)
      }
    }

    // Only fetch if messages are empty (initial load)
    if (messages.length === 0) {
      fetchInitialRecommendation()
    } else {
      // If messages already exist, don't show initial loading/recommendation
      setIsLoadingInitial(false)
    }
  }, [messages.length]) // Fixed dependency array to include messages.length

  return (
    <>
      {children({
        initialRecommendation,
        isLoadingInitial,
      })}
    </>
  )
}
