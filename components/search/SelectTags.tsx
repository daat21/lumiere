'use client'

import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export function SelectTags() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const type = searchParams.get('type')
  const router = useRouter()

  function handleChange(value: string) {
    router.push(`/search?query=${query}&type=${value}`)
  }

  return (
    <Tabs>
      <TabsList className="mx-auto w-full">
        <TabsTrigger
          tab="Movies"
          active={type === 'movie'}
          onClick={() => handleChange('movie')}
        />
        <TabsTrigger
          tab="People"
          active={type === 'people'}
          onClick={() => handleChange('people')}
        />
      </TabsList>
    </Tabs>
  )
}

function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function TabsList({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <div
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className
      )}
    >
      {children}
    </div>
  )
}

function TabsTrigger({
  tab,
  active,
  onClick,
}: {
  tab: string
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
        active &&
          'bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm'
      )}
      onClick={onClick}
    >
      {tab}
    </div>
  )
}
