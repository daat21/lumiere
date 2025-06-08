'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { useState } from 'react'

interface MovieReviewProps {
  avatar_url: string
  username: string
  comment_date: string
  rating: number
  comment: string
}

function useTruncateText(text: string, maxLength: number) {
  const [isTruncated, setIsTruncated] = useState(true)

  // If text is shorter than maxLength, just return the text without truncation controls
  if (text.length <= maxLength) {
    return <p>{text}</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {isTruncated ? text.slice(0, maxLength) + '...' : text}
      <button
        className="text-muted-foreground hover:text-primary ml-auto text-sm hover:underline"
        onClick={() => setIsTruncated(!isTruncated)}
      >
        {isTruncated ? 'Read more' : 'Read less'}
      </button>
    </div>
  )
}

export default function MovieReview({
  avatar_url,
  username,
  comment_date,
  rating,
  comment,
}: MovieReviewProps) {
  const truncatedComment = useTruncateText(comment, 200)

  return (
    <div className="bg-secondary flex flex-col gap-2 rounded-lg p-3 sm:p-5">
      <div className="flex items-center gap-2">
        <Avatar className="border-ring size-6 sm:size-7 border">
          <AvatarImage src={avatar_url} alt={username} />
          <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="text-muted-foreground text-xs sm:text-sm">{username}</p>
        <p className="text-muted-foreground ml-auto text-xs sm:text-sm">
          {new Date(comment_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      </div>
      <div className="flex items-center gap-1 font-bold text-xs sm:text-base">
        Rating: {rating}
        <div className="flex items-center gap-0">
          {Array.from({ length: rating }).map((_, index) => (
            <Star
              key={index}
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
            />
          ))}
          {Array.from({ length: 10 - rating }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-gray-200 text-gray-200" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold text-xs sm:text-base">Comment:</p>
        <div>{truncatedComment}</div>
      </div>
    </div>
  )
}
