import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Bookmark } from "lucide-react";

export function MovieCard({
  title,
  rating,
  image,
}: {
  title: string;
  rating: number;
  image: string;
}) {
  return (
    <Card className="w-[200px] h-[420px] rounded-lg overflow-hidden shadow-lg py-0">
      <CardContent className="p-0">
        <Image
          src={image}
          alt={title}
          width={200}
          height={300}
          className="object-cover w-full h-[300px]"
        />
        <div className="p-2">
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <button className="group p-1 rounded-full">
              <Bookmark className="w-5 h-5 text-green-500 group-hover:text-green-500 group-hover:fill-green-500" />
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MovieHorizontalCard({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <Card className="w-[340px] h-[240px] rounded-lg overflow-hidden shadow-lg py-0">
      <CardContent className="p-0">
        <Image
          src={image}
          alt={title}
          width={340}
          height={200}
          className="object-cover w-full h-[200px]"
        />
        <div className="p-2">
          <div className="mt-0">
            <p className="text-base font-bold">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
