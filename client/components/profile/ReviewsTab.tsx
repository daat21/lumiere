import { getMovieDetailsByIds } from '@/lib/tmdb'
import { MovieReviewCard } from '../home/MovieCard'
import { ReviewsFilter } from './ReviewsFilter'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import { getCurrentUserReviews } from '@/lib/server/user/getCurrentUserReviews'

interface MovieData {
  id: number
  title: string
  backdrop_path: string
  release_date: string
  overview: string
  original_title: string
  vote_average: number
  runtime: number
  genres: Array<{ id: number; name: string }>
}

interface ActivityWithMovieData {
  _id: string
  rating: number
  comment: string
  movie_id: string
  movie_title: string
  user_id: string
  username: string
  created_at: string
  updated_at: string | null
  movie_data: MovieData
}

export default async function ReviewsTab() {
  const user = await getCurrentUser()
  const reviews = await getCurrentUserReviews()

  const reviewsWithMovieData: ActivityWithMovieData[] = await Promise.all(
    reviews.map(async (review: ActivityWithMovieData) => {
      const movie_data = await getMovieDetailsByIds(review.movie_id)
      return {
        ...review,
        movie_data,
      }
    })
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <ReviewsFilter />
        <p className="text-sm">
          Total <span className="font-bold">{reviewsWithMovieData.length}</span>{' '}
          reviews
        </p>
      </div>
      <div className="flex flex-col gap-10">
        {reviewsWithMovieData.map(review => (
          <div key={review._id}>
            <MovieReviewCard
              title={review.movie_data.title}
              image={review.movie_data.backdrop_path}
              release_date={review.movie_data.release_date}
              overview={review.movie_data.overview}
              original_title={review.movie_data.original_title}
              rating={review.rating}
              comment={review.comment}
              comment_date={review.created_at}
              avatar_url={user?.avatar_url || ''}
              username={user?.username || ''}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
