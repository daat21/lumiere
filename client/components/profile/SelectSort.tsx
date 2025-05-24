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
    <div className="flex items-center gap-2">
      <p className="text-sm font-bold">Sort by</p>
      <Select
        value={currentSort}
        onValueChange={handleSortChange}
        name="sort_by"
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="created_at">Newest</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
