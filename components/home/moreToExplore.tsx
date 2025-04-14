"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MovieHorizontalCard } from "@/components/home/movieCard";
import { getMoviesByGenre } from "@/lib/tmdb";
import { MovieHorizontalCardSkeleton } from "../ui/skeleton/MovieHorizontalCardSkeleton";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
}

export function MoreToExplore({
  initialGenres,
  initialMovies,
}: {
  initialGenres: Genre[];
  initialMovies: Movie[];
}) {
  const [genres] = useState<Genre[]>(initialGenres);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const handleGenreClick = async (genreId: number) => {
    if (genreId === selectedGenreId) {
      setSelectedGenreId(null);
      setMovies(initialMovies);
      setError(null);
      setIsLoading(false);
      return;
    }

    setSelectedGenreId(genreId);
    setIsLoading(true);
    setError(null);

    try {
      const fetchedMovies = await getMoviesByGenre(String(genreId));
      setMovies(fetchedMovies.slice(0, 12));
    } catch (err) {
      console.error("Failed to fetch movies by genre:", err);
      setError("Failed to load movies for this genre.");
      setMovies(initialMovies);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 mx-4">
      <div className="flex flex-wrap gap-4">
        {genres.map((genre) => (
          <Badge
            variant="outline"
            key={genre.id}
            className={`
              rounded-2xl text-base font-normal cursor-pointer 
              transition-colors duration-200 ease-in-out 
              ${
                selectedGenreId === genre.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              }
            `}
            onClick={() => handleGenreClick(genre.id)}
          >
            {genre.name}
          </Badge>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-3 mt-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="ml-4 mt-8">
              <MovieHorizontalCardSkeleton />
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-center mt-8 text-red-500">{error}</div>}

      {!isLoading && !error && (
        <div className="grid grid-cols-3 mt-4">
          {movies.map((movie) => (
            <div key={movie.id} className="ml-4 mt-8">
              <MovieHorizontalCard
                title={movie.title}
                image={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              />
            </div>
          ))}
          {movies.length === 0 && (
            <div className="col-span-3 text-center mt-8">
              No movies found for this genre.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
