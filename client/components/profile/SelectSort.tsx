'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SelectSort() {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-bold">Sort by</p>
      <Select defaultValue="newest" name="sort_by">
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
