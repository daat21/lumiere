import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../skeleton";

export function MovieHorizontalCardSkeleton() {
  return (
    <Card className="w-[340px] h-[240px] rounded-lg overflow-hidden shadow-lg py-0">
      <CardContent className="p-0">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-center">
            <Skeleton className="object-cover w-[300px] h-[180px] mt-4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 ml-5 w-[200px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
