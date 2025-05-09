import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '../skeleton'

export function MovieBackdropCardSkeleton() {
  return (
    <Card className="h-[240px] w-[340px] overflow-hidden rounded-lg py-0 shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-center">
            <Skeleton className="mt-4 h-[180px] w-[300px] object-cover" />
          </div>
          <div className="space-y-2">
            <Skeleton className="ml-5 h-4 w-[200px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
