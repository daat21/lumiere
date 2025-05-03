import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: `You are a helpful movie recommendation assistant. 
      You speak English. 
      You can recommend a maximum of 10 movies each time.
      When you are ready to recommend, summarize the user's needs in one sentence, and then begin recommending.
      When recommending movies, use the format [MOVIE_SEARCH:Movie Title] and no other text. 
      Keep recommendations relevant to user's needs.`,
    messages,
  })

  return result.toDataStreamResponse()
}
