'use client'

import { MovieBackdropCardSkeleton } from '@/components/ui/skeleton/MovieBackdropCardSkeleton'
import { MovieCard } from '@/components/home/MovieCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import ReviewScrollArea from '@/components/movieDesc/reviewScrollArea'
import { Slider } from '@/components/ui/slider'
import ReviewSlider from '@/components/movieDesc/reviewSlider'
import { useEffect, useState } from 'react'
import {
  getMovieDetailsByIds,
  getCreditsByMovieId,
  getVideosByMovieId,
} from '@/lib/tmdb'

interface MovieDetails {
  original_title: string
  overview: string
  poster_path: string
  release_date: string
  runtime: number
  genres: {
    id: number
    name: string
  }[]
  vote_average: number
}

interface MovieCredits {
  castNames: string
  dirName: string
}

interface MovieVideos {
  trailerUrl: string
  teaserUrl: string
}

export default function MovieDescComp({ id }: { id: string }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<MovieCredits | null>(null)
  const [videos, setVideos] = useState<MovieVideos | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMovieDetailsByIds(id)
      .then(movie => {
        setMovie(movie)
        getCreditsByMovieId(id).then(credits => {
          setCredits(credits)
          getVideosByMovieId(id).then(videos => {
            setVideos(videos)
            setLoading(false)
          })
        })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Please wait! Loading movie details {':)'}</p>
  if (!movie) return <p>No data found, sorry! {':(}'}</p>

  // console.log(movie)
  return (
    <div>
      <h1 className="mb-8 text-3xl">
        {movie.original_title} ({movie.release_date.slice(0, 4)})
      </h1>
      <div className="flex flex-row border-amber-100">
        <div className="mr-20 ml-10 flex flex-col border-amber-100">
          <MovieCard
            title={movie.original_title}
            rating={movie.vote_average}
            image={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          />
          <div className="mt-6" />
          <Dialog>
            <DialogTrigger asChild>
              <Button>Reviews</Button>
            </DialogTrigger>
            <DialogContent className="w-1/2 sm:max-w-[none]">
              <DialogHeader>
                <DialogTitle>Reviews</DialogTitle>
                <DialogDescription>
                  Enter your review and ratings here. Click "Post" when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Review
                  </Label>
                  <Textarea
                    id="name"
                    placeholder="Enter your review here..."
                    className="col-span-10"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Ratings
                  </Label>
                  <ReviewSlider />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Post</Button>
              </DialogFooter>
              <ReviewScrollArea id={id} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col items-start border-amber-100 pr-8">
          <div className="flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Description</div>
            <div className="border-amber-100">{movie.overview}</div>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Genre</div>
            <p>{movie.genres.map(genre => genre.name).join(', ')}</p>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Duration</div>
            <div className="border-amber-100">{movie.runtime} minutes</div>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Director</div>
            <p>{credits?.dirName}</p>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Cast</div>
            <p>{credits?.castNames}</p>
          </div>
          <div className="mt-4 flex flex-row border-amber-100">
            <Button variant="outline" className="mt-4 mb-4" asChild>
              <Link href={videos?.trailerUrl ?? '#'}>Trailer</Link>
            </Button>
            <Button variant="outline" className="mt-4 mb-4 ml-4" asChild>
              <Link href={videos?.teaserUrl ?? '#'}>Teaser</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
