'use server'

type UserReview = {
    _id: string;
    rating: number;
    comment: string;
    movie_id: string;
    user_id: string;
    username: string;
    created_at: string;
    updated_at: string | null;
}

const getCurrentUserReviews = async (): Promise<UserReview[]> => {
  const response = await fetch(`http://127.0.0.1:8000/reviews/users/me/reviews`, {
    method: 'GET',
    //credentials:'include'
  });
  if(!response.ok){
  throw new Error('User reviews fetch unsuccessful!')
  }
  const userReviewData = await response.json()
  return userReviewData
}

export{
    getCurrentUserReviews
}