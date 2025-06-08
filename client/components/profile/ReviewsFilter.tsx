'use client'

import { FunnelPlus, FunnelX } from 'lucide-react'
import { SelectSort } from './SelectSort'
import RatingRange from './RatingRange'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

export function ReviewsFilter() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-row items-center gap-2 sm:gap-8">
      <Button
        variant="outline"
        className="flex items-center gap-1 px-2 py-1 text-[12px] sm:gap-2 sm:px-4 sm:py-2 sm:text-base"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FunnelPlus className={cn('h-4 w-4 sm:h-6 sm:w-6', isOpen && 'hidden')} />
        <FunnelX className={cn('h-4 w-4 sm:h-6 sm:w-6', !isOpen && 'hidden')} />
        Filter
      </Button>
      <div
        className={cn(
          'flex flex-row justify-between items-center w-full gap-4 sm:gap-8 opacity-0 transition-all duration-300',
          isOpen && 'opacity-100'
        )}
      >
        <SelectSort />
        <RatingRange />
      </div>
    </div>
  )
}
