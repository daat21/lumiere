'use client'

import { useSearchParams } from 'next/navigation'
import { SelectSort } from './SelectSort'
import { SelectLanguage } from './SelectLanguage'
import { SelectDates } from './SelectDates'
import { SelectMinVotes } from './SelectMinVotes'

export function Filters() {
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort_by') || 'popularity.desc'
  const currentLanguage = searchParams.get('language') || 'en'
  const currentDates = searchParams.get('dates') || 'all'
  const currentMinVotes = searchParams.get('min_votes') || '0'

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <SelectSort />
          <SelectLanguage />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <SelectDates />
          <SelectMinVotes />
        </div>
      </div>
    </div>
  )
}
