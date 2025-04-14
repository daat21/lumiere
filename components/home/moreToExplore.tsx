import { Badge } from "@/components/ui/badge";
import { MovieHorizontalCard } from "@/components/home/movieCard";

import { getPopularMovies, getGenresList } from "@/lib/tmdb";

// const moviesGenres = [
//   "Action",
//   "Adventure",
//   "Animation",
//   "Biography",
//   "Comedy",
//   "Crime",
//   "Documentary",
//   "Drama",
//   "Family",
//   "Fantasy",
//   "Film-Noir",
//   "Game-Show",
//   "History",
//   "Horror",
//   "Music",
//   "Musical",
//   "Romance",
//   "Short",
//   "Sport",
//   "Talk-Show",
//   "Thriller",
//   "War",
//   "Western",
// ];

export async function MoreToExplore() {
  const genresList = await getGenresList();
  const moreToExploreMovies = await (await getPopularMovies()).slice(5, 17);

  return (
    <div className="mt-6 mx-4">
      <div className="flex flex-wrap gap-4">
        {genresList.map((genre: { id: number; name: string }) => (
          <Badge
            variant="outline"
            key={genre.id}
            className="border-primary bg-muted rounded-2xl text-base font-normal hover:bg-primary hover:text-background"
          >
            {genre.name}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-3 mt-4">
        {moreToExploreMovies.map(
          (movie: { id: number; title: string; backdrop_path: string }) => (
            <div key={movie.id} className="ml-4 mt-8">
              <MovieHorizontalCard
                title={movie.title}
                image={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
