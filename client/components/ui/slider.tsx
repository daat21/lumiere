'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  showTicks?: boolean
  step?: number
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  showTicks = false,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const tickCount = Math.floor((max - min) / step) + 1
  const ticks = React.useMemo(() => {
    if (!showTicks) return []
    return Array.from({ length: tickCount }, (_, i) => min + i * step)
  }, [min, step, tickCount, showTicks])

  return (
    <>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        className={cn(
          'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>

      {showTicks && (
        <div className="relative mt-2 h-6 w-full px-2">
          <div
            className="absolute flex w-full justify-between"
            style={{ left: '0', right: '0' }}
          >
            {ticks.map((tick, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-2 w-0.5 bg-gray-300"></div>
                <span className="mt-1 text-xs text-gray-500">{tick}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export { Slider }
