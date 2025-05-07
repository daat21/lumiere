import { GalleryVerticalEnd } from 'lucide-react'
import { ThreeDMarquee } from '@/components/ui/3d-marquee'
import { getTopRatedMovies } from '@/lib/tmdb'
import { MovieResult } from '@/components/home/ChatBox/types'
import Link from 'next/link'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const topRatedMovies = await getTopRatedMovies()
  const topRatedMovies2 = await getTopRatedMovies(2)
  const images = [
    ...topRatedMovies.map(
      (movie: MovieResult) =>
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    ),
    ...topRatedMovies2.map(
      (movie: MovieResult) =>
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    ),
  ]

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Lumiere
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      {/* <div className="bg-muted relative hidden lg:block"> */}
      <div className="relative hidden lg:block">
        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
        <ThreeDMarquee images={images} className="min-h-svh" />
      </div>
    </div>
  )
}
