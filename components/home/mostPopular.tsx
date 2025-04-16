'use client'

import * as React from 'react'
import { use } from 'react'
import { MovieCard } from '@/components/home/movieCard'
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

export function MostPopular({ movies }: { movies: Promise<Movie[]> }) {
  const topRatedMovies = use(movies).slice(0, 10)

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
      <CarouselContent>
        {topRatedMovies.map((movie: Movie) => (
          <CarouselItem key={movie.id} className="basis-1/5 pl-4">
            <div className="justify-items-center">
              <MovieCard
                title={movie.title}
                rating={movie.vote_average}
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
