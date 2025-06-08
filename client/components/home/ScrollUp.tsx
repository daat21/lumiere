'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { ArrowUp } from 'lucide-react'

export default function ScrollUp() {
  const [isScrollUpVisible, setIsScrollUpVisible] = useState(false)

  const toggleScrollUpVisibility = () => {
    if (window.scrollY > 300) {
      setIsScrollUpVisible(true)
    } else {
      setIsScrollUpVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleScrollUpVisibility)

    return () => {
      window.removeEventListener('scroll', toggleScrollUpVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <Button
      // variant="secondary"
      onClick={scrollToTop}
      className={`fixed top-8 left-1/2 z-50 -translate-x-1/2 cursor-pointer rounded-full shadow-2xl transition-transform duration-800 ease-in-out ${
        isScrollUpVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-20 opacity-0'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="mr-1 h-4 w-4" />
      <span className="text-base font-semibold">Back to top</span>
    </Button>
  )
}
