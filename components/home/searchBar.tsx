"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TrendingUp, UsersRound, Clapperboard } from "lucide-react";
import { Input } from "../ui/input";
import {
  getTrendingMovies,
  getSearchResultsByMovie,
  getSearchResultsByPerson,
} from "@/lib/tmdb";
import { useDebouncedCallback } from "use-debounce";

interface Movie {
  id: number;
  title: string;
}

interface Person {
  id: number;
  name: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [personResults, setPersonResults] = useState<Person[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isDropdownOpen && query === "" && trendingMovies.length === 0) {
      const fetchTrending = async () => {
        setIsLoadingTrending(true);
        try {
          const movies = await getTrendingMovies();
          setTrendingMovies(movies.slice(0, 10));
        } catch (error) {
          console.error("Failed to fetch trending movies:", error);
        } finally {
          setIsLoadingTrending(false);
        }
      };
      fetchTrending();
    }
  }, [isDropdownOpen, query, trendingMovies.length]);

  const fetchSearchResults = useDebouncedCallback(
    async (currentQuery: string) => {
      if (!currentQuery) {
        setMovieResults([]);
        setPersonResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const [movieData, personData] = await Promise.all([
          getSearchResultsByMovie(currentQuery),
          getSearchResultsByPerson(currentQuery),
        ]);

        // Deduplicate movie results by title using reduce for better type safety
        const uniqueMovies = movieData
          ? movieData.reduce((acc: Movie[], current: Movie) => {
              if (!acc.some((movie) => movie.title === current.title)) {
                acc.push(current);
              }
              return acc;
            }, [])
          : [];

        setMovieResults(uniqueMovies); // Set the deduplicated results
        setPersonResults(personData || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setMovieResults([]);
        setPersonResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    1500
  );

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleBlur = () => {
    setIsDropdownOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
    fetchSearchResults(newQuery);
  };

  const getFirstMovieSuggestion = () => {
    return movieResults.length > 0 ? movieResults[0].title : query;
  };

  const getFirstPersonSuggestion = () => {
    return personResults.length > 0 ? personResults[0].name : query;
  };

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 z-10" />
      <Input
        placeholder="Search movies, actors..."
        className="pl-10 focus-visible:ring-0 focus:rounded-b-none focus:border-3"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      />
      {isDropdownOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-0 w-full bg-popover border border-input rounded-md rounded-t-none shadow-lg z-20 overflow-hidden overflow-y-auto"
          role="listbox"
        >
          {query === "" ? (
            isLoadingTrending ? (
              <div className="p-3 text-muted-foreground text-sm">
                Loading trending...
              </div>
            ) : (
              trendingMovies.length > 0 && (
                <>
                  <h2 className="text-base font-bold px-3 py-2 flex items-center gap-2 border-b border-border">
                    <TrendingUp className="h-4 w-4" />
                    Trending Movies
                  </h2>
                  <ul>
                    {trendingMovies.map((movie) => (
                      <li
                        key={`trending-${movie.id}`}
                        className="px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                      >
                        {movie.title}
                      </li>
                    ))}
                  </ul>
                </>
              )
            )
          ) : isSearching ? (
            <div className="p-3 text-muted-foreground text-sm">
              Searching...
            </div>
          ) : (
            <ul>
              <li className="px-3 py-2 text-sm hover:bg-accent cursor-pointer">
                <Clapperboard className="h-4 w-4 inline mr-2" />
                {getFirstMovieSuggestion()}{" "}
                <span className="text-muted-foreground font-bold">
                  in movies
                </span>
              </li>
              <li className="px-3 py-2 text-sm hover:bg-accent cursor-pointer">
                <UsersRound className="h-4 w-4 inline mr-2" />
                {getFirstPersonSuggestion()}{" "}
                <span className="text-muted-foreground font-bold">
                  in people
                </span>
              </li>

              {(movieResults.length > 1 || personResults.length > 0) && (
                <hr className="my-1 border-border" />
              )}

              {movieResults.length > 1 &&
                movieResults.slice(1, 9).map((movie) => (
                  <li
                    key={`movie-${movie.id}`}
                    className="px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                  >
                    <Clapperboard className="h-4 w-4 inline mr-2 opacity-50" />
                    {movie.title}
                  </li>
                ))}

              {movieResults.length === 0 && personResults.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  No results found for &quot;{query}&quot;.
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
