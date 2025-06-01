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

export function SelectDates() {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get('dates') || 'all'

  return (
    <div className="grid gap-2 w-full sm:w-[180px]">
      <p className="font-bold text-sm sm:text-base">Release Date</p>
      <Select defaultValue={currentValue} name="dates">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
