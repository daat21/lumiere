'use client'
import React, { useState } from 'react'
import { DualRangeSlider } from '../ui/DualRangeSlider'

const DualRangeSliderDemo = () => {
  const [values, setValues] = useState([0, 10])

  return (
    <div className="flex items-center gap-1">
      <p className="text-xs sm:text-sm font-bold">Rating</p>
      <div className="w-[80px] sm:w-[150px]">
        <DualRangeSlider
          label={value => <span className="text-[10px] sm:text-sm">{value}</span>}
          value={values}
          onValueChange={setValues}
          min={0}
          max={10}
          step={1}
        />
      </div>
    </div>
  )
}

export default DualRangeSliderDemo
