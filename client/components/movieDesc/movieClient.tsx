'use client'

import { MovieDescCard } from '@/components/home/MovieCard'
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
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import ReviewScrollArea from '@/components/movieDesc/reviewScrollArea'
// import { Slider } from '@/components/ui/slider'
import Rating from '@mui/material/Rating'

//import ReviewSlider from '@/components/movieDesc/reviewSlider'
import { useEffect, useState, useActionState } from 'react'
import {
  getMovieDetailsByIds,
  getCreditsByMovieId,
  getVideosByMovieId,
} from '@/lib/tmdb'
// import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { postReview } from '@/lib/server/user/postReview'

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

export default function MovieDescComp(
  { id, user }: 
  { id: string 
  user:any|null }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<MovieCredits | null>(null)
  const [videos, setVideos] = useState<MovieVideos | null>(null)
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState([5])
  const [reviewState, formAction] = useActionState(postReview, undefined)
  const { pending } = useFormStatus()
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

  useEffect(() => {
    if (reviewState?.success) {
      toast.success(reviewState.message || 'Review is posted!')
      setTimeout(() => window.location.reload(), 1500)
    } else if (reviewState?.code == 401) {
      toast.error(reviewState.message || 'User is not logged in!')
      setTimeout(() => (window.location.href = `/login`), 1500)
    } else if (reviewState?.code == 400) {
      toast.error(
        reviewState.message ||
          'Failure while posting review... or Review already posted...'
      )
    }
  }, [reviewState])

  if (loading) return <p>Please wait! Loading movie details {':)'}</p>
  if (!movie) return <p>No data found, sorry! {':(}'}</p>
  // console.log(movie)

  return (
    <div>
      <h1 className="mb-8 text-3xl break-words">
        {movie.original_title} ({movie.release_date.slice(0, 4)})
      </h1>
      <div className="flex flex-col md:flex-row border-amber-100">
        <div className="flex flex-col md:mr-20 md:ml-10 mr-0 ml-0 border-amber-100 mb-8 md:mb-0">
          <MovieDescCard
            title={movie.original_title}
            rating={movie.vote_average}
            image={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            id={id}
          />
          <div className="mt-6" />
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={()=>{if(!user)
              {toast.error('Please login to post a review...')
                console.log(user)
                setTimeout(()=>(window.location.href='/login'),1500)
              }}}>
                Post a review</Button>
            </DialogTrigger>
            <DialogContent className="max-w-full sm:max-w-lg md:mb-0">
              <DialogHeader>
                <DialogTitle>Reviews</DialogTitle>
                <DialogDescription>
                  Enter your review and ratings here. Click &quot;Post&quot;
                  when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <form action={formAction}>
                <input type="hidden" name="movieId" value={id} />
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="rating" className="text-left sm:text-right">
                      Ratings
                    </Label>
                    {/*<ReviewSlider />*/}
                    <div className="flex w-full justify-center gap-4 sm:col-span-3">
                      {/* <Slider
                        name="rating"
                        defaultValue={value}
                        onValueChange={setValue}
                        min={0}
                        max={10}
                        step={1}
                        className={cn('w-[60%]')}
                      /> */}
                      <Rating
                        name="rating"
                        value={value[0]}
                        defaultValue={5}
                        max={10}
                        precision={1}
                        onChange={(_, newValue) => {
                          setValue([newValue || 0])
                        }}
                      />
                      <div className="rounded border px-3 py-1 text-sm font-medium">
                        {value[0]}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="comment" className="text-right">
                      Review
                    </Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="Enter your review here..."
                      className="col-span-10"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={pending}>
                    {pending ? 'Posting...' : 'Post'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col items-start md:pr-8 pr-0 border-amber-100">
          <div className="flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Description</div>
            <div className="border-amber-100 break-words">{movie.overview}</div>
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
            {videos?.trailerUrl != 'na' && (<Button variant="outline" className="mt-4 mb-4" asChild>
              <Link href={videos?.trailerUrl ?? '#'}>Trailer</Link>
            </Button>)}
            {videos?.teaserUrl != 'na' && (<Button variant="outline" className="mt-4 mb-4 ml-4" asChild>
              <Link href={videos?.teaserUrl ?? '#'}>Teaser</Link>
            </Button>)}
            {videos?.trailerUrl == 'na' && videos?.trailerUrl == 'na' && (<div className='font-semibold text-red-600 text-xl'>Apologies, trailer and teaser videos are not available for {movie.original_title} ({movie.release_date.slice(0, 4)}).</div>)}
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <ReviewScrollArea id={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
