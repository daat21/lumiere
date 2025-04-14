import { MovieCard } from "@/components/home/movieCard";
import { getPopularMovies } from "@/lib/tmdb";

export async function MostPopular() {
  const allPopularMovies = await getPopularMovies();
  const popularMovies = allPopularMovies.slice(0, 5);

  return (
    <div className="grid grid-cols-5 gap-[20px] w-full mt-6">
      {popularMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          rating={movie.vote_average}
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        />
      ))}
    </div>
  );
}
