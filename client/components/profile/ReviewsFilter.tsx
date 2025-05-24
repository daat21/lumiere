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
    <div className="flex items-center gap-8">
      <Button
        variant="outline"
        className="flex cursor-pointer items-center gap-2"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FunnelPlus className={cn('h-6 w-6', isOpen && 'hidden')} />
        <FunnelX className={cn('h-6 w-6', !isOpen && 'hidden')} />
        Filter
      </Button>
      <div
        className={cn(
          'flex items-center gap-6 opacity-0 transition-all duration-300',
          isOpen && 'opacity-100'
        )}
      >
        <SelectSort />
        <RatingRange />
      </div>
    </div>
  )
}
