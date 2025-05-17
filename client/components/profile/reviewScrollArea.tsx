import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "../ui/button"

const movies = Array.from({ length: 10 }).map(
  (_, i, a) => `Movie${a.length - i}`
)

export default function ReviewScrollArea() {
  return (
    <ScrollArea className="h-96 w-full rounded-md border">
      <div className="p-4">
        {movies.map((movie) => (
          <>
            <Button variant="link" key={movie} className="text-base font-bold">
              {movie}
            </Button>
            <div className="flex flex-col mt-2 ml-4">
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

