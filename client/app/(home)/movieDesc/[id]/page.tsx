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

export default function MovieDesc() {
  return (
    <div>
      <h1 className="mb-8 text-3xl">Movie Title (Year)</h1>
      <div className="flex flex-row border-amber-100">
        <div className="mr-20 ml-10 flex flex-col border-amber-100">
          <MovieCard
            title="Havoc"
            rating={6.6}
            image={`https://image.tmdb.org/t/p/original/r46leE6PSzLR3pnVzaxx5Q30yUF.jpg`}
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
              <ReviewScrollArea />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col items-start border-amber-100 pr-8">
          <div className="flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Description</div>
            <div className="border-amber-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              iaculis sapien quis cursus tincidunt. Nullam nec felis augue.
              Etiam orci massa, auctor ac fermentum id, condimentum eu libero.
              Morbi a convallis libero. Vivamus lacinia sem vitae erat
              tristique, id iaculis justo tincidunt. Pellentesque tempus, metus
              ut fringilla consectetur, ligula lectus consequat velit, et
              elementum purus eros at mauris. Donec pellentesque vestibulum
              interdum. Praesent hendrerit vitae mauris id congue. Sed sodales
              tincidunt dapibus.
            </div>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Genre</div>
            <div className="border-amber-100">Action, Thriller</div>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Duration</div>
            <div className="border-amber-100">126 minutes</div>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Director</div>
            <div className="border-amber-100">John Doe</div>
          </div>
          <div className="mt-4 flex flex-col border-amber-100">
            <div className="border-amber-100 font-semibold">Cast</div>
            <div className="border-amber-100">
              John Appleseed, Amelie Harrison, Harry Smith, Samantha Waller...
            </div>
          </div>
          <div className="mt-4 flex flex-row border-amber-100">
            <Button variant="outline" className="mt-4 mb-4" asChild>
              <Link href="https://www.youtube.com/watch?v=6txjTWLoSc8">
                Trailer
              </Link>
            </Button>
            <Button variant="outline" className="mt-4 mb-4 ml-4" asChild>
              <Link href="https://www.youtube.com/watch?v=HAQfDRvrU0s">
                Teaser
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
