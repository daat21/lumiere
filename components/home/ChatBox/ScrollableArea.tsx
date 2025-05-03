import { ReactNode, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ScrollableAreaProps {
  children: ReactNode
}

export function ScrollableArea({ children }: ScrollableAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll ScrollArea to bottom when children change
  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollAreaElement = scrollAreaRef.current
      if (scrollAreaElement) {
        // Find the viewport element within the ScrollArea
        const viewport = scrollAreaElement.querySelector<HTMLDivElement>(
          '[data-radix-scroll-area-viewport]'
        )
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
        }
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [children])

  return (
    <ScrollArea ref={scrollAreaRef} className="h-93 w-full rounded-md">
      {children}
    </ScrollArea>
  )
}
