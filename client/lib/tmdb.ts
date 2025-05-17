'use server'

const API_KEY = process.env.TMDB_API_LONG_KEY

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const getPopularMovies = async () => {
  const response = await fetch(
    'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
    options
  )
  const data = await response.json()
  return data.results
}

const getTopRatedMovies = async (page?: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page || 1}`,
    options
  )
  const data = await response.json()
  return data.results
}

const getGenresList = async () => {
  const response = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?language=en',
    options
  )
  const data = await response.json()
  return data.genres
}

const getMoviesByGenre = async (genre: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}`,
    options
  )
  const data = await response.json()
  return data.results
}

const getTrendingMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?language=en-US'`,
    options
  )
  const data = await response.json()
  return data.results
}

const getSearchResultsByMovie = async (query: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
    options
  )
  const data = await response.json()
  return data.results
}

const getSearchResultsByPerson = async (query: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`,
    options
  )
  const data = await response.json()
  return data.results
}

const getDiscoverMovies = async (params: {
  sort_by?: string | 'popularity.desc'
  language?: string
  release_date_gte?: string
  release_date_lte?: string
  min_votes?: string
  genre_id?: string
}) => {
  const searchParams = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: '1',
  })

  if (params.sort_by) searchParams.append('sort_by', params.sort_by)
  if (params.language)
    searchParams.append('with_original_language', params.language)
  if (params.release_date_gte)
    searchParams.append('release_date.gte', params.release_date_gte)
  if (params.release_date_lte)
    searchParams.append('release_date.lte', params.release_date_lte)
  if (params.min_votes) searchParams.append('vote_count.gte', params.min_votes)
  if (params.genre_id) searchParams.append('with_genres', params.genre_id)

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${searchParams.toString()}`,
    options
  )
  const data = await response.json()
  return data.results
}

export {
  getPopularMovies,
  getTopRatedMovies,
  getGenresList,
  getMoviesByGenre,
  getTrendingMovies,
  getSearchResultsByMovie,
  getSearchResultsByPerson,
  getDiscoverMovies,
}
