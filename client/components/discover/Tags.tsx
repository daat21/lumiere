'use client'

import { useState } from 'react'
import { Badge } from '../ui/badge'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'

interface Genre {
  id: number
  name: string
}

export function Tags({ genres }: { genres: Genre[] }) {
  const searchParams = useSearchParams()
  const defaultGenreId = searchParams.get('genre_id')
  const defaultGenreIds = defaultGenreId ? defaultGenreId.split(',') : []

  const [selectedGenreId, setSelectedGenreId] = useState<number[]>(
    defaultGenreIds.map(Number)
  )

  return (
    <div className="mx-auto flex max-w-screen-lg flex-wrap gap-4">
      {genres.map((genre: Genre) => (
        <Badge
          variant="outline"
          key={genre.id}
          className={`cursor-pointer rounded-2xl px-3 py-1 text-sm font-normal transition-colors duration-200 ease-in-out ${
            selectedGenreId.includes(genre.id)
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground border'
          } `}
          onClick={() => {
            setSelectedGenreId(prev => {
              if (prev.includes(genre.id)) {
                return prev.filter(id => id !== genre.id)
              }
              return [...prev, genre.id]
            })
          }}
        >
          {genre.name}
        </Badge>
      ))}
      <Input type="hidden" name="genre_id" value={selectedGenreId.join(',')} />
    </div>
  )
}
