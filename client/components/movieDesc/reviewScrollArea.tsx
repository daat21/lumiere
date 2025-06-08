import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
import { getMovieReviewsById } from '@/lib/tmdb'
import { useEffect, useState } from 'react'
import MovieReview from './MovieReview'

interface MovieReviews {
  id: string
  name: string
  comment: string
  rating: number | null
  created_at: string
  avatar_url: string
}

// const tags = Array.from({ length: 10 }).map((_, i, a) => `user${a.length - i}`)

export default function ReviewScrollArea({ id }: { id: string }) {
  const [reviews, setReviews] = useState<MovieReviews[] | []>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getMovieReviewsById(id).then(reviews => {
      setReviews(
        reviews.map(review => ({
          id: review.id,
          name: review.name,
          comment: review.comment,
          rating: review.rating ?? 0,
          created_at: review.created_at,
          avatar_url: review.avatar_url ?? '',
        }))
      )
      setLoading(false)
    })
  }, [id])
  if (loading) return <p>Please wait! Loading reviews {':)'}</p>
  if (reviews.length==0) return <div className='font-semibold text-green-600 text-2xl'>This movie hasn't been reviewed yet... Be the first one to review it!</div>

  console.log(reviews)

  return (
    <ScrollArea className="w-full rounded-md border">
      <div className="flex flex-col gap-4 sm:gap-6 p-2 sm:p-4 sm:px-6">
        <h4 className="text-lg sm:text-xl leading-none font-medium">User reviews</h4>
        {reviews.map(review => (
          <MovieReview
            key={review.id}
            avatar_url={review.avatar_url ?? ''}
            username={review.name}
            comment_date={review.created_at}
            rating={review.rating ?? 0}
            comment={review.comment}
          />
          // <div key={review.id}>
          //   <div className="flex flex-col">
          //     <div key={review.name} className="text-xl font-bold">
          //       User: {review.name}
          //     </div>
          //     <div className="text-md">{review.comment}</div>
          //     <div className="font-semibold">
          //       Rating: {review.rating ?? 'No ratings provided'}
          //     </div>
          //   </div>
          //   <Separator className="my-2" />
          // </div>
        ))}
      </div>
    </ScrollArea>
  )
}
