'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'

export function SelectSort() {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get('sort_by') || 'popularity.desc'

  return (
    <div className="grid gap-2 w-full sm:w-[180px]">
      <p className="font-bold text-sm sm:text-base">Sort by</p>
      <Select defaultValue={currentValue} name="sort_by">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="popularity.desc">Popularity</SelectItem>
            <SelectItem value="vote_average.desc">Rating</SelectItem>
            <SelectItem value="primary_release_date.desc">
              Release Date
            </SelectItem>
            <SelectItem value="vote_count.desc">Vote Count</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
