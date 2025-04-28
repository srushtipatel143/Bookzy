import { API_USER_URL } from "@/app/utils/config";
import Moviescreen from "@/app/components/movie/movie";
interface PageProps{
    params:{
        id:string
    }
}

const getMovieDetails=async(id:string)=>{
    const res=await fetch(`${API_USER_URL}/getSingleMovie/${id}`);
    if (!res.ok) throw new Error("Failed to fetch movie");
    const json = await res.json();
    return json.data;
}
const Movie =async({params}:PageProps)=>{
    const {id}=await params;
    const movie=await getMovieDetails(id);
    return(
       <Moviescreen movie={movie}/>
    )
}
export default Movie;