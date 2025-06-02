'use client'
import { useState } from "react";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
 
type SliderProps = React.ComponentProps<typeof Slider>
 
export default function ReviewSlider({ className, ...props }: SliderProps) {
    const [value, setValue] = useState([5]);
  return (
    <div className="flex justify-center gap-2 sm:gap-4 w-full">
    <Slider
        defaultValue={value}
        onValueChange={setValue}
        max={10}
        step={0.1}
        className={cn('w-full sm:w-[60%]', className)}
        {...props}
    />
    <div className="px-3 py-1 border rounded text-xs sm:text-sm font-medium">
        {value[0]}
    </div>
    </div>
  );
}