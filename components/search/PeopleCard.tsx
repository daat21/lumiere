import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

export function PeopleCard({
  name,
  image,
}: {
  name: string
  image: string | null
}) {
  return (
    <Card className="overflow-hidden rounded-full p-2 shadow-lg">
      <CardContent className="flex items-center gap-8">
        {image ? (
          <Image
            src={`https://image.tmdb.org/t/p/w90_and_h90_face${image}`}
            alt={name}
            width={90}
            height={90}
            className="h-[70px] w-[70px] rounded-2xl object-cover"
          />
        ) : (
          <div className="h-[70px] w-[70px] rounded-2xl bg-gray-200" />
        )}
        <p className="text-xl font-bold">{name}</p>
      </CardContent>
    </Card>
  )
}
