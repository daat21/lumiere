import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 10 }).map(
  (_, i, a) => `user${a.length - i}`
)

export default function ReviewScrollArea() {
  return (
    <ScrollArea className="h-72 w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Reviews by other users</h4>
        {tags.map((tag) => (
          <>
            <div className="flex flex-col">
            <div key={tag} className="text-sm font-bold">
              {tag}
            </div>
            <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras iaculis sapien quis cursus tincidunt. Nullam nec felis augue. Etiam orci massa, auctor ac fermentum id, condimentum eu libero. Morbi a convallis libero.
            </div>
            <div>
            Rating: x
            </div>
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

