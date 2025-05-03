import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { WandSparkles } from 'lucide-react'
import { ThinkingIndicator } from './ThinkingIndicator'

interface InputAreaProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  isGenerating?: boolean
}

export function InputArea({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isGenerating = false,
}: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Adjust textarea height as content changes
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 200)
      textarea.style.height = `${newHeight}px`
    }
  }, [input])

  return (
    <div className="relative w-full">
      {isLoading && <ThinkingIndicator isGenerating={isGenerating} />}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="border-input bg-background relative flex items-end rounded-md border dark:border-none">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about movies or actors..."
            className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring max-h-[200px] min-h-[40px] flex-1 resize-none rounded-md bg-transparent px-3 py-2 pr-12 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="ghost"
            className="absolute right-1 bottom-1 h-10 w-10"
            disabled={isLoading}
          >
            <WandSparkles className="h-6 w-6" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
