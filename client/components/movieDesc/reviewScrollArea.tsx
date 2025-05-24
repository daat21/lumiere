import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getMovieReviewsById } from '@/lib/tmdb'
import { useEffect, useState } from 'react'

interface MovieReviews {
  id: string
  name: string
  comment: string
  rating: number | null
}

// const tags = Array.from({ length: 10 }).map((_, i, a) => `user${a.length - i}`)

export default function ReviewScrollArea({ id }: { id: string }) {
  const [reviews, setReviews] = useState<MovieReviews[] | []>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getMovieReviewsById(id).then(reviews => {
      setReviews(reviews)
      setLoading(false)
    })
  }, [id])
  if (loading) return <p>Please wait! Loading reviews {':)'}</p>
  if (!reviews) return <p>No reviews found, sorry! {':(}'}</p>

  return (
    <ScrollArea className="w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-xl leading-none font-medium">User reviews</h4>
        {reviews.map(review => (
          <div key={review.id}>
            <div className="flex flex-col">
              <div key={review.name} className="text-xl font-bold">
                User: {review.name}
              </div>
              <div className="text-md">{review.comment}</div>
              <div className="font-semibold">
                Rating: {review.rating ?? 'No ratings provided'}
              </div>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
