import { Slider } from '@/components/ui/slider'

export function SelectMinVotes() {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">Minimum Votes</p>
      <Slider
        defaultValue={[300]}
        max={500}
        step={100}
        className="showtips w-[250px]"
        showTicks
      />
    </div>
  )
}
