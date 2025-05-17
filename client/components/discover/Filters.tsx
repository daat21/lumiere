import { SelectSort } from './SelectSort'
import { SelectLanguage } from './SelectLanguage'
import { SelectDates } from './SelectDates'
import { SelectMinVotes } from './SelectMinVotes'

export function Filters() {
  return (
    <div className="mx-auto flex max-w-screen-lg gap-6 p-4">
      <SelectSort />
      <SelectLanguage />
      <SelectDates />
      <SelectMinVotes />
    </div>
  )
}
