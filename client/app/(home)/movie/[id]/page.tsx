import MovieDescComp from "@/components/movieDesc/movieClient";
import { getCurrentUser } from "@/lib/server/user/getCurrentUser";

interface MovieDescProps {
  params: Promise<{ id: string}>
}


export default async function movieDesc({params}: MovieDescProps){
  const {id} = await params;
  const user = await getCurrentUser()
  return(
    <div>
      <MovieDescComp id={id} user={user}/>
    </div>
  )
}