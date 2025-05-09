'use client'

import { useState } from 'react'
import { Badge } from '../ui/badge'

interface Genre {
  id: number
  name: string
}

export function Tags({ genres }: { genres: Genre[] }) {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)

  return (
    <div className="mx-auto flex max-w-screen-lg flex-wrap gap-4">
      {genres.map((genre: Genre) => (
        <Badge
          variant="outline"
          key={genre.id}
          className={`cursor-pointer rounded-2xl px-3 py-1 text-sm font-normal transition-colors duration-200 ease-in-out ${
            selectedGenreId === genre.id
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground border'
          } `}
          onClick={() => setSelectedGenreId(genre.id)}
        >
          {genre.name}
        </Badge>
      ))}
    </div>
  )
}
