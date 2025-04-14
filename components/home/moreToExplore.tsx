import { Badge } from "@/components/ui/badge";
import { MovieHorizontalCard } from "@/components/home/movieCard";

const moviesGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "Game-Show",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Romance",
  "Short",
  "Sport",
  "Talk-Show",
  "Thriller",
  "War",
  "Western",
];

export function MoreToExplore() {
  return (
    <div className="mt-6 mx-4">
      <div className="flex flex-wrap gap-4">
        {moviesGenres.map((genre) => (
          <Badge
            variant="outline"
            key={genre}
            className="border-primary bg-muted rounded-2xl text-base font-normal hover:bg-primary hover:text-background"
          >
            {genre}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-3 mt-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="ml-4 mt-8">
            <MovieHorizontalCard
              title="Inception"
              image="/movie_poster/Inception.png"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
