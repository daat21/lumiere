const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjdiMzg4OTE2MTlmZjU1ZDI2ZGVlOGU3YzdjMzdkZSIsIm5iZiI6MTc0NDY0Mzk5MS43NzYsInN1YiI6IjY3ZmQyNzk3OWQxZjc3OGFiODk5MjQzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YnPuMLP2YBt27UTSEdpLkanVqANnv-B0Mc-BhCHEHL0",
  },
};

const getPopularMovies = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  );
  const data = await response.json();
  return data.results;
};

const getTopRatedMovies = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  );
  const data = await response.json();
  return data.results;
};

const getGenresList = async () => {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options
  );
  const data = await response.json();
  return data.genres;
};

export { getPopularMovies, getTopRatedMovies, getGenresList };
