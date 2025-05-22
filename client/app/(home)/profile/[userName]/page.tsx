import ReviewScrollArea from "@/components/profile/reviewScrollArea";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from '@/lib/server/user/getCurrentUser'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default async function Profile() {
  const user = await getCurrentUser()
  /*const user={
  "id": "682b0526c3ccd3a52710734f",
  "username": "emmanuel",
  "email": "emmanuel@icloud.com",
  "hashed_password": "$2b$12$LSU2.vVco0VoOGdEyUsEMugjor9fBH.UKc9UMgZQAoglkSWIfvU7G",
  "is_active": true,
  "is_superuser": true,
  "created_at": "2025-05-19T19:47:10.819000",
  "updated_at": "2025-05-19T19:47:10.819000",
  "last_login": "2025-05-21T20:01:48.273000",
  "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  "bio": "I love watching action movies",
  "watchlists": [],
  "reviews": []
  };*/

  return (
  <div className="flex flex-col  border-amber-100">
    <div className="flex flex-col  border-amber-100 justify-around">
      <div className="mr-20 ml-10 flex flex-col mb-3  border-amber-100">
      <h1>
        Profile
      </h1>
      </div>
      <div className="mr-20 ml-10 flex flex-col  border-amber-100">
        <div className="flex flex-row mt-2 items-center  border-amber-100">
          <Avatar className="w-13 h-13">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          <h2 className="ml-2 font-bold">
            {user.username}
          </h2>
        </div>
      <div className="flex flex-row mt-2  border-amber-100">
        <h3 className="font-bold mr-1">
          Bio:
        </h3>
        <div>
        {user.bio}
        </div>
      </div>
      </div>
    </div>
    <div className="flex flex-col mt-2  border-amber-100">
      <div className="mr-20 ml-10 mb-2 flex flex-col  border-amber-100">
        <h2>
          Reviews and ratings posted
        </h2>
      </div>
      <div className="mr-20 ml-10 flex flex-col  border-amber-100">
      <ReviewScrollArea />
      </div>
    </div>
  </div>
)
}
