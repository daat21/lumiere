import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ActivityTab from './ActivityTab'
import ReviewsTab from './ReviewsTab'

interface ActivityContainerProps {
  searchParams?: Promise<{ sort_by?: string }>
}

export default function ActivityContainer({
  searchParams,
}: ActivityContainerProps) {
  return (
    <Tabs defaultValue="activity">
      <TabsList className="text-muted-foreground inline-flex h-9 w-full items-center justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="activity"
          className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative inline-flex h-9 items-center justify-center rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-1 pt-2 pb-3 text-sm font-semibold whitespace-nowrap shadow-none transition-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-none"
        >
          Activity
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative inline-flex h-9 items-center justify-center rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-1 pt-2 pb-3 text-sm font-semibold whitespace-nowrap shadow-none transition-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-none"
        >
          Reviews
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        <ActivityTab />
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewsTab searchParams={searchParams} />
      </TabsContent>
    </Tabs>
  )
}
