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

const getSearchResultsByMovie = async (query: string, page?: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page || 1}`,
    options
  )
  const data = await response.json()
  return data
}

const getSearchResultsByPerson = async (query: string, page?: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=${page || 1}`,
    options
  )
  const data = await response.json()
  return data
}

const getDiscoverMovies = async (params: {
  sort_by?: string | 'popularity.desc'
  language?: string
  release_date_gte?: string
  release_date_lte?: string
  min_votes?: string
  genre_id?: string
  page?: string
}) => {
  const searchParams = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: params.page || '1',
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
  return data
}

const getMovieDetailsByIds = async (movie_id: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}`,
    options
  )
  const movie = await response.json()
  return movie
}

const getCreditsByMovieId = async (movie_id: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/credits`,
    options
  )
  const creditData = await response.json()
  const castNames =
    creditData.cast
      ?.slice(0, 5)
      .map((castMember: { name: string }) => castMember.name)
      .join(', ') + ', more...' || 'No cast information available'
  const dirName =
    creditData.crew?.find(
      (crewMember: { job: string }) => crewMember.job == 'Director'
    )?.name || 'Director information not available'
  return {
    castNames,
    dirName,
  }
}

const getVideosByMovieId = async (movie_id: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/videos`,
    options
  )
  const videoData = await response.json()
  const trailerVideo = videoData.results?.find(
    (videoResult: { site: string; name: string }) =>
      videoResult.site == 'YouTube' &&
      videoResult.name.toLowerCase().includes('trailer')
  )
  const teaserVideo = videoData.results?.find(
    (videoResult: { site: string; name: string }) =>
      videoResult.site == 'YouTube' &&
      videoResult.name.toLowerCase().includes('teaser')
  )
  const trailerUrl = trailerVideo
    ? `https://www.youtube.com/watch?v=${trailerVideo.key}`
    : 'na'
  const teaserUrl = teaserVideo
    ? `https://www.youtube.com/watch?v=${teaserVideo.key}`
    : 'na'
  return { trailerUrl, teaserUrl }
}

type movieReviews = {
  id: string
  name: string
  comment: string
  rating: number | null
  created_at: string
  avatar_url: string
}

const getMovieReviewsById = async (
  movie_id: string
): Promise<movieReviews[]> => {
  const response = await fetch(
    `http://127.0.0.1:8000/reviews/${movie_id}/reviews`,
    {
      method: 'GET',
    }
  )
  const reviewData = await response.json()
  const userReviews: movieReviews[] = reviewData.user_reviews.map(
    (review: {
      _id: string
      username: string
      comment: string
      rating: number
      created_at: string
    }) => ({
      id: review._id,
      name: review.username,
      comment: review.comment,
      rating: review.rating,
      created_at: review.created_at,
    })
  )
  const tmdbReviews: movieReviews[] = reviewData.tmdb_reviews.map(
    (review: {
      id: string
      author: string
      content: string
      author_details: { rating: number; avatar_path: string }
      created_at: string
    }) => ({
      id: review.id,
      name: review.author,
      comment: review.content,
      rating: review.author_details?.rating ?? null,
      created_at: review.created_at,
      avatar_url:
        'https://image.tmdb.org/t/p/w500' +
          review.author_details?.avatar_path || '',
    })
  )
  return [...userReviews, ...tmdbReviews]
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
  getMovieDetailsByIds,
  getCreditsByMovieId,
  getVideosByMovieId,
  getMovieReviewsById,
}
