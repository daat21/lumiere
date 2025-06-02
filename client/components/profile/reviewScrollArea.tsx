'use client'
import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "../ui/button"
import  Link  from "next/link"
import { useEffect, useState } from "react"
import { getCurrentUserReviews } from "@/lib/server/user/currentUserReviews";


interface UserReview {
    _id: string;
    rating: number;
    comment: string;
    movie_id: string;
    //movie_name: string; (ask Silin)
    //movie_release_date: string; (ask Silin)
    user_id: string;
    username: string;
    created_at: string;
    updated_at: string | null;
}

export default function ReviewScrollArea() {
  const [reviews, setReviews] = useState<UserReview[]|[]>([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
          getCurrentUserReviews()
          .then((reviews)=>{
            setReviews(reviews)
            setLoading(false)
          })
  }, [])
  if (loading) return <p>Please wait! Loading reviews {":)"}</p>
  if (!reviews) return <p>No reviews found, sorry! {":("}</p>

  return (
    <ScrollArea className="h-64 sm:h-96 w-full rounded-md border">
      <div className="p-2 sm:p-4">
        {reviews.map((review) => (
          <React.Fragment key={review._id}>
            <Link href={`/movieDesc/${review.movie_id}`}>
              <Button variant="link" className="text-sm sm:text-base font-bold">
                Movie ID: {review.movie_id}
              </Button>
            </Link>
            <div className="flex flex-col mt-1 sm:mt-2 ml-2 sm:ml-4">
              <div>
                {review.comment}
              </div>
              <div>
                Rating: {review.rating}
              </div>
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

