
import "@/styles/movie.css";
import { FaStar } from "react-icons/fa";
import Footer from "@/components/homeScreen/footer";
import Image from 'next/image';
import { dateFormat } from "@/utils/formatdate";
import BackButton from "@/utils/backbutton";
import SelectModal from "./selectModal";
import AddRating from "./addRating";

interface MovieScreenProps {
    movie: {
        _id: string;
        title: string;
        movieImageURl: string;
        duration: number;
        releaseDate: string;
        movieLanguage: { language: string; status: boolean; _id: string }[];
        movieType: { type: string; status: boolean; _id: string }[];
        cast: { actor: string; role: string; imageUrl: string; _id: string }[];
        about: string;
        ratingData: {
            totalRating: number;
            votes: number;
        };
        screenTypes: [];
        availableScreen: {
            language: string;
            screenType: [];
        }[];
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
                <div className="container py-5" style={{ color: "#fff" }}>
                    <div className="row align-items-center">
                        <div className="col-12 col-md-4 col-lg-3 text-center mb-3 mb-md-0">
                            <Image
                                src={movie.movieImageURl}
                                alt="movie_image"
                                width={250}
                                height={300}
                                className="img-fluid"
                                style={{ borderRadius: "10px", objectFit: "cover" }}
                            />
                        </div>
                        <div className="col-12 col-md-8 col-lg-9">

                            <p className="display-6">{movie.title}</p>

                            <div className="col-12 col-lg-6 d-flex flex-wrap align-items-center gap-3 movie_rate_section">
                                <p className="m-0 d-flex align-items-center fs-5 gap-1">
                                    <FaStar size={20} color="red" />
                                    {Object.keys(movie.ratingData).length > 0
                                        ? `${movie.ratingData.totalRating}/10 (${movie.ratingData.votes} Votes)`
                                        : 'N / A'}
                                </p>
                                <AddRating movie={movie} />
                            </div>

                            <div className="movie_type_lan mt-2">
                                {movie.screenTypes.length > 0 && (
                                    <div className="movie_type_sec">
                                        {movie.screenTypes.map((item, index) => (
                                            <span key={index}>
                                                {item}{index !== movie.screenTypes.length - 1 && ','}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="movie_lan_sec">
                                    {movie.movieLanguage?.map((item, index) => (
                                        <span key={item._id}>
                                            {item.language}{index !== movie.movieLanguage.length - 1 && ','}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
                                <div className="mb-0">{duration}</div>

                                <div className="d-flex flex-wrap align-items-center gap-3 mb-0">
                                    <div>
                                        {movie.movieType?.map((item, index) => (
                                            <span key={item._id}>
                                                {item.type}
                                                {index !== movie.movieType.length - 1 && ','}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="">{formattedDate}</div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <SelectModal movie={movie} />
                            </div>
                        </div>
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