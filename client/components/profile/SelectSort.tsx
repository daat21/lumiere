'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

export function SelectSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort_by') || 'created_at'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort_by', value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1">
      <p className="text-[12px] sm:text-sm font-bold">Sort by</p>
      <Select
        value={currentSort}
        onValueChange={handleSortChange}
        name="sort_by"
      >
        <SelectTrigger className="w-[70px] px-1 py-1 text-[10px] sm:w-[140px] sm:text-sm sm:px-2 sm:py-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="created_at" className="text-[10px] sm:text-sm">Newest</SelectItem>
            <SelectItem value="rating" className="text-[10px] sm:text-sm">Rating</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
