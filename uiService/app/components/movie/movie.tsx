
import "../../css/movie.css";
import { FaStar } from "react-icons/fa";
import Footer from "../homeScreen/footer";
import Image from 'next/image';
import { dateFormat } from "../../utils/formatdate";
import BackButton from "../../utils/backbutton";
import SelectModal from "./selectModal";

interface MovieScreenProps {
    movie: {
        _id: string;
        title: string;
        imageURl: string;
        duration: number;
        releaseDate: string;
        movieLanguage: { language: string; status: boolean; _id: string }[];
        movieType: { type: string; status: boolean; _id: string }[];
        cast: { actor: string; role: string; imageUrl: string; _id: string }[];
        about: string;
        ratingData: {
            totalRating: number;
            votes:number;
        };
        screenTypes:[];
        availableScreen:{
            language:string;
            screenType:[];
        } [];
    };
}

const Moviescreen = ({ movie }: MovieScreenProps) => {

    const movieLength = movie?.duration;
    const hr = Math.floor(movieLength / 60);
    const min = movieLength % 60;
    const duration = `${hr}h ${min}min`;
    const formattedDate = dateFormat(movie.releaseDate);
    return (
        <div className="container-fluid mt-3 p-0 ">
            <div className="d-flex movie_detail">
                <BackButton />
                <div className="d-flex align-items-center ">
                    <div className="movie_left my-5 ms-5 me-3">
                        <Image width={250} height={300} alt="movie_image" src={movie.imageURl} style={{ borderRadius: "10px", objectFit: "cover" }} />
                    </div>
                    <div className="movie_right mx-3">
                        <p className="display-6">{movie.title}</p>
                        <div className="d-flex movie_rate_section">
                            <p className="m-0 d-flex align-items-center fs-5 gap-1">
                                <FaStar size={20} color="red" />
                                {Object.keys(movie.ratingData).length > 0 ? `${movie.ratingData.totalRating}/10 (${movie.ratingData.votes} Votes)` : 'N / A'}
                            </p>
                            <button className="movie_rate_btn">Rate Now</button>
                        </div>
                        <div className="movie_type_lan">
                            <div className="movie_type_sec">
                                {movie.screenTypes?.map((item,index)=>(
                                    <span key={index}>
                                        {item}
                                        {index !== movie.screenTypes?.length - 1 && ','}
                                    </span>
                                ))}
                            </div>
                            <div className="movie_lan_sec">
                                {movie.movieLanguage?.map((item, index) => (
                                    <span key={item._id}>
                                        {item.language}
                                        {index !== movie.movieLanguage?.length - 1 && ','}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="d-flex">
                            <p>{duration}</p>
                            <ul>
                                <li> {movie.movieType?.map((item, index) => (
                                    <span key={item._id}>
                                        {item.type}
                                        {index !== movie.movieType?.length - 1 && ','}
                                    </span>
                                ))}</li>
                                <li>{formattedDate}</li>
                            </ul>
                        </div>
                       <SelectModal movie={movie}/>
                    </div>
                </div>
            </div>
            <div className="about_movie py-4 recommend_movie">
                <p className="about_movie_title">About The Movie</p>
                <p>
                    {movie.about}
                </p>
            </div>
            <div className="about_movie py-4 recommend_movie">
                <p className="about_movie_title">Cast</p>
                <div className="cast_scroll mt-4">
                    {movie.cast?.map((item) => (
                        <div key={item._id} className="cast-card p-0">
                            <Image height={120} width={120} src={item.imageUrl} alt="cast_image" className="cast_img" />
                            <p>{item.actor}</p>
                            <p>{item.role}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Moviescreen;