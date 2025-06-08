'use server'

import { cookies } from 'next/headers'

export const getCurrentUserInfo = async () => {
   const cookieStore = await cookies()
   const accessToken = cookieStore.get('access_token')
   if (!accessToken) return null
   const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/users/me', {
     headers: {
       Authorization: `Bearer ${accessToken.value}`,
     },
   })
   const data = await res.json()

  /*const data: any = {
  "id": "682d9b72c3ccd3a527107353",
  "username": "samantony",
  "email": "samantony@gmail.com",
  "hashed_password": "$2b$12$XxSY7uQgrk72pmmFsNxiLOs2soa9wOXwwbalSeHGTtgaa02FWyoMO",
  "is_active": true,
  "is_superuser": true,
  "created_at": "2025-05-21T18:52:58.938000",
  "updated_at": "2025-05-21T18:52:58.938000",
  "last_login": "2025-05-24T22:39:00.670000",
  "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  "bio": null,
  "watchlists": [],
  "reviews": []
}*/

  return data
}
