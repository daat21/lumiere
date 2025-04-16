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
  image: string
}) {
  return (
    <Card className="h-[420px] w-[200px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className="p-0">
        <Image
          src={image}
          alt={title}
          width={200}
          height={300}
          className="object-cover"
        />
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
  image: string
}) {
  return (
    <Card className="h-[240px] w-[340px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className="p-0">
        <Image
          src={image}
          alt={title}
          width={340}
          height={200}
          className="object-cover"
        />
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
}: {
  title: string
  image: string
  release_date: string
  overview: string
  original_title: string
  className?: string
}) {
  return (
    <Card className="h-[141px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className={cn('flex items-center gap-4 p-0', className)}>
        <Image
          src={image}
          alt={title}
          width={94}
          height={141}
          className="h-[141px] w-[94px] object-cover"
        />
        <div className="flex flex-col gap-2">
          <h3>
            <span className="text-lg font-bold">{title}</span>
            <span className="text-muted-foreground ml-2 text-sm">
              {original_title !== title ? `(${original_title})` : ''}
            </span>
          </h3>
          <p className="text-muted-foreground text-sm">{release_date}</p>
          <p className="text-sm">
            {/* {overview.length > 300 ? overview.slice(0, 280) + "..." : overview} */}
            {overview}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
