import ReviewScrollArea from "@/components/profile/reviewScrollArea";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export default function Profile() {
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
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="ml-2 font-bold">
            Username
          </h2>
        </div>
      <div className="flex flex-row mt-2  border-amber-100">
        <h3 className="font-bold mr-1">
          Bio:
        </h3>
        <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras iaculis sapien quis cursus tincidunt. Nullam nec felis augue. Etiam orci massa, auctor ac fermentum id, condimentum eu libero. Morbi a convallis libero.
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
