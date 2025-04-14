import { Suspense } from "react";

import { Recomendations } from "@/components/home/recomendations";
import { MostPopular } from "@/components/home/mostPopular";
import { MoreToExplore } from "@/components/home/moreToExplore";
import { Bookmark } from "lucide-react";

import { getTopRatedMovies, getGenresList, getPopularMovies } from "@/lib/tmdb";

export default async function Home() {
  const topRatedMoviesPromise = getTopRatedMovies();
  const genresListPromise = getGenresList();
  const popularMoviesPromise = getPopularMovies();

  const [genresList, popularMovies] = await Promise.all([
    genresListPromise,
    popularMoviesPromise,
  ]);

  const initialMoreToExploreMovies = popularMovies.slice(5, 17);

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1>AI Recommendation for you</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Recomendations movies={topRatedMoviesPromise} />
        </Suspense>
      </div>
      <div>
        <h1>Most Popular</h1>
        <MostPopular />
      </div>
      <div>
        <h1>From your watchlist</h1>
        <div className="flex flex-col gap-4 items-center my-10">
          <p>
            <Bookmark className="w-13 h-13" />
          </p>
          <p className="text-lg font-semibold">
            Save shows and movies to keep track of what you want to watch.
          </p>
        </div>
      </div>
      <div>
        <h1>More to explore</h1>
        <MoreToExplore
          initialGenres={genresList}
          initialMovies={initialMoreToExploreMovies}
        />
      </div>
    </div>
  );
}
