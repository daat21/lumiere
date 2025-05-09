'use client'

import { useChat } from 'ai/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { MessageList } from './MessageList'
import { InputArea } from './InputArea'
import { MovieSearchProvider } from './MovieSearchProvider'
import { InitialRecommendationProvider } from './InitialRecommendationProvider'
import { ScrollableArea } from './ScrollableArea'

export function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
    })

  const [isGenerating, setIsGenerating] = useState(false)

  // Detect when a message is being generated
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]

      if (lastMessage.role === 'assistant') {
        const currentLength = lastMessage.content.length

        if (isLoading && currentLength > 0) {
          setIsGenerating(true)
        } else if (!isLoading) {
          setIsGenerating(false)
        }
      }
    }
  }, [messages, isLoading])

  return (
    <div className="flex justify-center">
      <Card className="w-9/10 overflow-hidden rounded-lg py-0 shadow-lg">
        <CardHeader>
          <CardTitle className="mt-5 flex items-center gap-2 text-2xl font-semibold">
            <SparklesIcon className="h-6 w-6" />
            AI Movie Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="mb-4 flex flex-col gap-4">
          <MovieSearchProvider messages={messages}>
            {/* {({ movieSearches, loadingMovies }) => ( */}
            {({ movieSearches }) => (
              <InitialRecommendationProvider messages={messages}>
                {({ initialRecommendation, isLoadingInitial }) => (
                  <ScrollableArea>
                    <MessageList
                      messages={messages}
                      movieSearches={movieSearches}
                      // loadingMovies={loadingMovies}
                      initialRecommendation={initialRecommendation}
                      isLoadingInitial={isLoadingInitial}
                    />
                  </ScrollableArea>
                )}
              </InitialRecommendationProvider>
            )}
          </MovieSearchProvider>

          <InputArea
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isGenerating={isGenerating}
          />
        </CardContent>
      </Card>
    </div>
  )
}
