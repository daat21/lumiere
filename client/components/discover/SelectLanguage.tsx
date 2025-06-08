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

export function SelectLanguage() {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get('language') || 'en'

  return (
    <div className="grid gap-2 w-full sm:w-[180px]">
      <p className="font-bold text-sm sm:text-base">Language</p>
      <Select defaultValue={currentValue} name="language">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
