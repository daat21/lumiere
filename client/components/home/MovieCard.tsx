import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MovieCard({
  title,
  rating,
  image,
}: {
  title: string
  rating: number
  image: string | null
}) {
  return (
    <Card className="h-[420px] w-[200px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className="p-0">
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
        <div className="p-2">
          <div className="mt-1 flex items-center justify-between">
            <div className="ml-1/2 flex items-center gap-1 p-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <button className="group rounded-full p-1">
              <Bookmark className="h-5 w-5 text-green-500 group-hover:fill-green-500 group-hover:text-green-500" />
            </button>
          </div>
          <div className="mx-2 mt-4 text-center">
            <p className="text-base font-bold">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MovieBackdropCard({
  title,
  image,
}: {
  title: string
  image: string | null
}) {
  return (
    <Card className="h-[240px] w-[340px] overflow-hidden rounded-lg py-0 shadow-lg">
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
}: {
  title: string
  image: string | null
  release_date: string
  overview: string
  original_title: string
  className?: string
  isShadow?: boolean
}) {
  return (
    // <Card className="h-[141px] overflow-hidden rounded-lg py-0">
    <Card
      className={cn(
        'h-[141px] overflow-hidden rounded-lg py-0',
        isShadow && 'shadow-lg'
      )}
    >
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
            {overview.length > 200 ? overview.slice(0, 200) + '...' : overview}
            {/* {overview} */}
          </p>
        </div>
      </CardContent>
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
}: {
  title: string
  image: string | null
  release_date: string
  overview: string
  original_title: string
  rating: number
  comment: string
  comment_date: string
}) {
  return (
    <Card className="shadow-lg">
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {image ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${image}`}
                alt={title}
                width={80}
                height={80}
                className="h-[80px] w-[80px] rounded-full object-cover"
              />
            ) : (
              <div className="h-[80px] w-[80px] rounded-full bg-gray-200" />
            )}
            <div className="">
              <h3>
                <span className="font-bold">{title}</span>
                <span className="text-muted-foreground ml-2">
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
          </div>
          <div className="bg-secondary flex flex-col gap-2 rounded-lg p-5">
            <div className="flex items-center gap-1 font-bold">
              Rating: {rating}
              <div className="flex items-center gap-0">
                {Array.from({ length: rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                {Array.from({ length: 5 - rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-gray-200 text-gray-200"
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-bold">Comment:</p>
              <p className="">{comment}</p>
            </div>
            <p className="text-muted-foreground ml-auto text-sm">
              {new Date(comment_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
