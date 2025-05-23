'use client'
import React, { useState } from 'react'
import { DualRangeSlider } from '../ui/DualRangeSlider'

const DualRangeSliderDemo = () => {
  const [values, setValues] = useState([0, 5])

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-bold">Rating</p>
      <div className="w-[150px]">
        <DualRangeSlider
          label={value => value}
          value={values}
          onValueChange={setValues}
          min={0}
          max={5}
          step={1}
        />
      </div>
    </div>
  )
}

export default DualRangeSliderDemo
