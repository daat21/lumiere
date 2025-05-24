'use server'

import { cookies } from 'next/headers'

export const getCurrentUserInfo = async () => {
  // const cookieStore = await cookies()
  // const accessToken = cookieStore.get('access_token')
  // if (!accessToken) return null
  // const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/users/me', {
  //   headers: {
  //     Authorization: `Bearer ${accessToken.value}`,
  //   },
  // })
  // const data = await res.json()

  const data: any = {
    id: '682b0526c3ccd3a52710734f',
    username: 'emmanuel',
    email: 'emmanuel@icloud.com',
    hashed_password:
      '$2b$12$LSU2.vVco0VoOGdEyUsEMugjor9fBH.UKc9UMgZQAoglkSWIfvU7G',
    is_active: true,
    is_superuser: true,
    created_at: '2025-05-19T19:47:10.819000',
    updated_at: '2025-05-19T19:47:10.819000',
    last_login: '2025-05-23T18:55:57.473000',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    bio: null,
    watchlists: [
      {
        _id: '68302cdbb956fb9ff6403edd',
        name: 'W1',
        description: 'Favourites',
        is_public: false,
        user_id: '682b0526c3ccd3a52710734f',
        created_at: '2025-05-23T17:37:55.922000',
        updated_at: '2025-05-23T17:40:12.063000',
        movies: [
          {
            movie_id: '340666',
            added_at: '2025-05-23T08:08:28.381000',
            notes: 'M1',
          },
          {
            movie_id: '100',
            added_at: '2025-05-23T08:08:28.381000',
            notes: 'M2',
          },
        ],
      },
    ],
    reviews: [
      {
        _id: '682dacfac3ccd3a527107354',
        rating: 7.8,
        comment: 'Great movie with amazing performances! I really loved it!',
        movie_id: '100',
        user_id: '682b0526c3ccd3a52710734f',
        username: 'emmanuel',
        created_at: '2025-05-21T20:07:46.109000',
        updated_at: null,
      },
      {
        _id: '682c2fdfc3ccd3a527107351',
        rating: 8.5,
        comment: 'Great movie with amazing performances!',
        movie_id: '340666',
        user_id: '682b0526c3ccd3a52710734f',
        username: 'emmanuel',
        created_at: '2025-05-20T17:01:43.510000',
        updated_at: null,
      },
      {
        _id: '682b071ac3ccd3a527107350',
        rating: 8.5,
        comment: 'Great movie with amazing performances!',
        movie_id: '340999',
        user_id: '682b0526c3ccd3a52710734f',
        username: 'emmanuel',
        created_at: '2025-05-19T19:55:30.746000',
        updated_at: null,
      },
    ],
  }

  return data
}
