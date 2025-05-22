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
  if (!reviews) return <p>No reviews found, sorry! {":(}"}</p>

  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <div className="p-4">
        {reviews.map((review) => (
          <>
            <Link href={`/movieDesc/${review.movie_id}`}>
            <Button variant="link" key={review._id} className="text-base font-bold">
              Movie ID: {review.movie_id}
            </Button>
            </Link>
            <div className="flex flex-col mt-2 ml-4">
            <div>
              {review.comment}
            </div>
            <div>
            Rating: {review.rating}
            </div>
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

