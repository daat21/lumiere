import { Suspense } from "react";

import { Recomendations } from "@/components/home/recomendations";
import { MostPopular } from "@/components/home/mostPopular";
import { MoreToExplore } from "@/components/home/moreToExplore";
import { Bookmark } from "lucide-react";

import { getTopRatedMovies } from "@/lib/tmdb";

export default async function Home() {
  const topRatedMovies = getTopRatedMovies();

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1>AI Recommendation for you</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Recomendations movies={topRatedMovies} />
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
        <MoreToExplore />
      </div>
    </div>
  );
}
