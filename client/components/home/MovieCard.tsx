'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useState } from 'react'
import Link from 'next/link'
import { WatchlistBookmark } from './WatchlistBookmark'

export function MovieCard({
  title,
  rating,
  image,
  id,
}: {
  title: string
  rating: number
  image: string | null
  id: string
}) {
  return (
    <Card className="h-[420px] w-[200px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className="p-0">
        <Link href={`/movie/${id}`}>
          {image ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${image}`}
              alt={title}
              width={200}
              height={300}
              className="object-cover"
            />
          ) : (
            <div className="h-[300px] w-[200px] bg-gray-200" />
          )}
        </Link>
        <div className="p-2">
          <div className="mt-1 flex items-center justify-between">
            <div className="ml-1/2 flex items-center gap-1 p-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <WatchlistBookmark movie_id={id} />
          </div>
          <div className="mx-2 mt-4 text-center">
            <Link href={`/movie/${id}`}>
              <p className="text-base font-bold">{title}</p>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MovieDescCard({
  title,
  rating,
  image,
  id,
}: {
  title: string
  rating: number
  image: string | null
  id: string
}) {
  return (
    <Card className="h-[570px] w-[300px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className="p-0">
        <Link href={`/movie/${id}`}>
          {image ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${image}`}
              alt={title}
              width={300}
              height={400}
              className="object-cover"
            />
          ) : (
            <div className="h-[300px] w-[200px] bg-gray-200" />
          )}
        </Link>
        <div className="p-2">
          <div className="mt-1 flex items-center justify-between">
            <div className="ml-1/2 flex items-center gap-1 p-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <WatchlistBookmark movie_id={id} />
          </div>
          <div className="mx-2 mt-4 text-center">
            <Link href={`/movie/${id}`}>
              <p className="text-base font-bold">{title}</p>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MovieBackdropCard({
  title,
  image,
  id,
}: {
  title: string
  image: string | null
  id: string
}) {
  return (
    <Card className="h-[240px] w-[340px] overflow-hidden rounded-lg py-0 shadow-lg">
      <Link href={`/movie/${id}`}>
        <CardContent className="p-0">
          {image ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${image}`}
              alt={title}
              width={340}
              height={200}
              className="object-cover"
            />
          ) : (
            <div className="h-[200px] w-[340px] bg-gray-200" />
          )}
          <div className="p-2">
            <div className="mt-0">
              <p className="text-base font-bold">{title}</p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export function MovieHorizontalCard({
  title,
  image,
  release_date,
  overview,
  original_title,
  className,
  isShadow = true,
  id,
}: {
  title: string
  image: string | null
  release_date: string
  overview: string
  original_title: string
  className?: string
  isShadow?: boolean
  id: string
}) {
  return (
    // <Card className="h-[141px] overflow-hidden rounded-lg py-0">
    <Card
      className={cn(
        'h-[141px] overflow-hidden rounded-lg py-0',
        isShadow && 'shadow-lg'
      )}
    >
      <Link href={`/movie/${id}`}>
        <CardContent className={cn('flex items-center gap-4 p-0', className)}>
          {image ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${image}`}
              alt={title}
              width={94}
              height={141}
              className="h-[141px] w-[94px] object-cover"
            />
          ) : (
            <div className="h-[141px] min-w-[94px] bg-gray-200" />
          )}
          <div className="flex flex-col gap-2">
            <h3>
              <span className="text-lg font-bold">{title}</span>
              <span className="text-muted-foreground ml-2 text-sm">
                {original_title !== title ? `(${original_title})` : ''}
              </span>
            </h3>
            <p className="text-muted-foreground text-sm">{release_date}</p>
            <p className="text-sm">
              {overview.length > 200
                ? overview.slice(0, 200) + '...'
                : overview}
              {/* {overview} */}
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export function MovieReviewCard({
  title,
  image,
  release_date,
  overview,
  original_title,
  rating,
  comment,
  comment_date,
  avatar_url,
  username,
  id,
}: {
  title: string
  image: string | null
  release_date: string
  overview: string
  original_title: string
  rating: number
  comment: string
  comment_date: string
  avatar_url: string
  username: string
  id: string
}) {
  const truncatedComment = useTruncateText(comment, 200)

  return (
    <Card className="shadow-lg">
      <CardContent>
        <div className="flex flex-col gap-4">
          <Link href={`/movie/${id}`} className="flex gap-4">
            {image ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${image}`}
                alt={title}
                width={80}
                height={80}
                className="h-[80px] w-[80px] rounded-2xl object-cover"
              />
            ) : (
              <div className="h-[80px] w-[80px] rounded-full bg-gray-200" />
            )}
            <div className="">
              <h3>
                <span className="font-bold">{title}</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  {original_title !== title ? `(${original_title})` : ''}
                </span>
              </h3>
              <p className="text-muted-foreground text-sm">{release_date}</p>
              <p className="text-sm">
                {overview.length > 200
                  ? overview.slice(0, 200) + '...'
                  : overview}
              </p>
            </div>
          </Link>
          <div className="bg-secondary flex flex-col gap-2 rounded-lg p-5">
            <div className="flex items-center gap-2">
              <Avatar className="border-ring size-5 border">
                <AvatarImage src={avatar_url} alt={username} />
                <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground text-sm">{username}</p>
              <p className="text-muted-foreground ml-auto text-sm">
                {new Date(comment_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-1 font-bold">
              Rating: {rating}
              <div className="flex items-center gap-0">
                {Array.from({ length: rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {Array.from({ length: 10 - rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-gray-200 text-gray-200"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold">Comment:</p>
              <div className="">{truncatedComment}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
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
