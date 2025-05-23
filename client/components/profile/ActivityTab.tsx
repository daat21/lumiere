import { getMovieDetailsByIds } from '@/lib/tmdb'
import { Card } from '../ui/card'
import { MovieHorizontalCard } from '../home/MovieCard'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import { Bookmark, Star } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'review',
    rating: 3,
    comment: 'The Shawshank Redemption',
    movie_id: '278',
    created_at: '2025-01-01',
  },
  {
    id: 2,
    type: 'review',
    rating: 4,
    comment: 'This is a comment',
    movie_id: '238',
    created_at: '2025-02-01',
  },
  {
    id: 3,
    type: 'watchlist',
    movie_id: '424',
    created_at: '2025-03-01',
  },
  {
    id: 4,
    type: 'watchlist',
    movie_id: '389',
    created_at: '2025-04-01',
  },
  {
    id: 5,
    type: 'review',
    rating: 5,
    comment: 'This is a comment',
    movie_id: '240',
    created_at: '2025-05-01',
  },
  {
    id: 6,
    type: 'watchlist',
    movie_id: '129',
    created_at: '2025-06-01',
  },
]

interface MovieData {
  id: number
  title: string
  poster_path: string
  release_date: string
  overview: string
  original_title: string
  vote_average: number
  runtime: number
  genres: Array<{ id: number; name: string }>
}

interface ActivityWithMovieData {
  id: number
  type: string
  rating?: number
  comment?: string
  movie_id: string
  created_at: string
  movie_data: MovieData
}

export default async function ActivityTab() {
  const user = await getCurrentUser()

  // Fetch movie details for each activity
  const activitiesWithMovieData: ActivityWithMovieData[] = await Promise.all(
    activities.map(async activity => {
      const movie_data = await getMovieDetailsByIds(activity.movie_id)
      return {
        ...activity,
        movie_data,
      }
    })
  )

  return (
    <div className="mt-10 flex flex-col gap-10">
      {activitiesWithMovieData.map(activity => (
        <Card key={activity.movie_id} className="p-6 shadow-lg">
          {activity.type === 'review' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <>
                  <Avatar className="border-ring size-6 border">
                    <AvatarImage src={user?.avatar_url} alt={user?.username} />
                    <AvatarFallback>
                      {user?.username?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-muted-foreground text-sm">
                    {user?.username}
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    Reviewed{' '}
                    <span className="text-primary font-bold">
                      {activity.movie_data.title}
                    </span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {activity.rating}
                  </p>
                </>
                <p className="text-muted-foreground ml-auto text-sm">
                  {new Date(activity.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm">{activity.comment}</p>
                <MovieHorizontalCard
                  title={activity.movie_data.title}
                  image={activity.movie_data.poster_path}
                  release_date={activity.movie_data.release_date}
                  overview={activity.movie_data.overview}
                  original_title={activity.movie_data.original_title}
                  isShadow={false}
                />
              </div>
            </div>
          )}
          {activity.type === 'watchlist' && (
            <>
              <div className="flex items-center gap-2">
                <>
                  <Avatar className="border-ring size-6 border">
                    <AvatarImage src={user?.avatar_url} alt={user?.username} />
                    <AvatarFallback>
                      {user?.username?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-muted-foreground text-sm">
                    {user?.username}
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    Added{' '}
                    <span className="text-primary font-bold">
                      {activity.movie_data.title}
                    </span>{' '}
                    to watchlist{' '}
                    <Bookmark className="h-4 w-4 fill-green-500 text-green-500" />
                  </p>
                </>
                <p className="text-muted-foreground ml-auto text-sm">
                  {new Date(activity.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <MovieHorizontalCard
                  title={activity.movie_data.title}
                  image={activity.movie_data.poster_path}
                  release_date={activity.movie_data.release_date}
                  overview={activity.movie_data.overview}
                  original_title={activity.movie_data.original_title}
                  isShadow={false}
                />
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  )
}
