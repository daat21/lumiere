import MovieDescComp from "@/components/movieDesc/movieClient";

interface MovieDescProps {
  params: Promise<{ id: string}>
}


export default async function movieDesc({params}: MovieDescProps){
  const {id} = await params;
  return(
    <div>
      <MovieDescComp id={id} />
    </div>
  )
}