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
    <div className="grid gap-2">
      <p className="font-bold">Language</p>
      <Select defaultValue={currentValue} name="language">
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="cn">Cantonese</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
