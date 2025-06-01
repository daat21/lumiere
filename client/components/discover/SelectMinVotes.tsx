'use client'

import { Slider } from '@/components/ui/slider'
import { useSearchParams } from 'next/navigation'
import { Input } from '../ui/input'
import { useState } from 'react'

export function SelectMinVotes() {
  const searchParams = useSearchParams()
  const defaultValue = searchParams.get('min_votes') || '300'

  const [value, setValue] = useState(Number(defaultValue))

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">Minimum Votes</p>
      <Slider
        defaultValue={[Number(defaultValue)]}
        max={500}
        step={100}
        className="w-[250px]"
        showTicks
        value={[value]}
        onValueChange={value => {
          setValue(value[0])
        }}
      />
      <Input type="hidden" name="min_votes" value={value} />
    </div>
  )
}