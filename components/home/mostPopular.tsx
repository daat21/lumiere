import { MovieCard } from "@/components/home/movieCard";

export function MostPopular() {
  return (
    <div className="grid grid-cols-5 gap-[20px] w-full mt-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <MovieCard
          key={index}
          title="12 Angry Men"
          rating={9.0}
          image="/movie_poster/12_Angry_Men.png"
        />
      ))}
    </div>
  );
}
