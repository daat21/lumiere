'use client'

import * as React from 'react'
import { MovieCard } from '@/components/home/MovieCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
}

export function WatchlistCarousel({ movies }: { movies: Movie[] }) {
  const topRatedMovies = movies.slice(0, 10)

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="mt-6 w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {topRatedMovies.map((movie: Movie) => (
          <CarouselItem key={movie.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-2 md:pl-4">
            <div className="justify-items-center">
              <MovieCard
                title={movie.title}
                rating={movie.vote_average}
                image={movie.poster_path}
                id={movie.id.toString()}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  )
}
