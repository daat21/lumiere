'use client'

import * as React from 'react'
import { useState } from 'react'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '../ui/input'
import { useSearchParams } from 'next/navigation'

export function SelectDates({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams()
  const releaseDateGte = searchParams.get('release_date_gte') || '2025-01-01'
  const releaseDateLte = searchParams.get('release_date_lte') || '2025-01-20'
  const isInitialIncludeAllDates = !searchParams.has('include_all_dates')

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(releaseDateGte),
    to: addDays(new Date(releaseDateLte), 20),
  })

  const [includeAllDates, setIncludeAllDates] = useState(
    isInitialIncludeAllDates
  )

  return (
    <div className={cn('grid gap-2', className)}>
      <p className="flex items-center gap-2 font-bold">
        <>Release Dates</>
        <span className="flex items-center gap-2">
          <Checkbox
            checked={includeAllDates}
            onCheckedChange={() => setIncludeAllDates(!includeAllDates)}
          />
          <label className="text-sm font-normal">Include all dates</label>
        </span>
      </p>
      <Popover>
        <PopoverTrigger asChild disabled={includeAllDates}>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {!includeAllDates && (
        <>
          <Input
            type="hidden"
            name="release_date_gte"
            value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
          />
          <Input
            type="hidden"
            name="release_date_lte"
            value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
          />
          <Input
            type="hidden"
            name="include_all_dates"
            value={includeAllDates ? 'true' : 'false'}
          />
        </>
      )}
    </div>
  )
}