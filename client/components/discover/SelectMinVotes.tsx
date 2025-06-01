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

export function SelectMinVotes() {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get('min_votes') || '0'

  return (
    <div className="grid gap-2 w-full sm:w-[180px]">
      <p className="font-bold text-sm sm:text-base">Min Votes</p>
      <Select defaultValue={currentValue} name="min_votes">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="0">No Minimum</SelectItem>
            <SelectItem value="100">100+</SelectItem>
            <SelectItem value="500">500+</SelectItem>
            <SelectItem value="1000">1,000+</SelectItem>
            <SelectItem value="5000">5,000+</SelectItem>
            <SelectItem value="10000">10,000+</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
