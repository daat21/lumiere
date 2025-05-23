'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { WandSparkles } from 'lucide-react'

export function ChatInput() {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 200)
      textarea.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  const handleSend = () => {
    if (message.trim()) {
      // console.log('Send Message:', message)
      setMessage('')
    }
  }

  return (
    <div className="relative w-full">
      <div className="border-input bg-background relative flex items-end rounded-md border dark:border-none">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring max-h-[200px] min-h-[40px] flex-1 resize-none rounded-md bg-transparent px-3 py-2 pr-12 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-1 bottom-1 h-10 w-10"
          onClick={handleSend}
        >
          <WandSparkles className="h-6 w-6" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  )
}
