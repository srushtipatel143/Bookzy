'use client';
import Carousel from "../homeScreen/carousal";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "../../css/recommendedall.css";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from "../homeScreen/footer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useCity } from "../context/cityContext";
import Cookies from "js-cookie";
import { API_USER_URL } from "@/app/utils/config";
import axios from "axios";
import { LatestMovie } from "../movie/latestMovieInterface";
import { UpcomingMovie } from "../movie/upcomingMovieInterface";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from 'next/navigation';

const RecommendedAll = () => {
    const router = useRouter();
    const [showLanguages, setshowlanguages] = useState(false);
    const [showGenres, setShowGenres] = useState(false);
    const [showFormt, setShowFormat] = useState(false);
    const { selectCity } = useCity();
    const [movieData, setMovieData] = useState<LatestMovie[] | UpcomingMovie[]>([]);
    const latestmovies = useSelector((state: RootState) => state.latestMovie.movies);
    const upcomingmovies = useSelector((state: RootState) => state.upcomingMovie.movies);
    const params = useParams();
    const slug = params.slug;

    useEffect(() => {
        const fetchDetails = async () => {
            const selectedCity = Cookies.get("selected_city");
            if (!selectedCity) {
                if (slug === "latest-movie") {
                    setMovieData(latestmovies);
                }
                else {
                    setMovieData(upcomingmovies)
                }
                return;
            }
            const cityData = JSON.parse(selectedCity);
            const cityID = cityData.id;
            let cacheKey;
            if (slug === "latest-movie") {
                cacheKey = `/latest-movies/${cityID}`;
            }
            else {
                cacheKey = `/upcoming-movies/${cityID}`;
            }
            try {
                const cache: Cache = await caches.open("movie-cache");
                const cachedResponse = await cache.match(cacheKey);
                if (cachedResponse) {
                    const data = await cachedResponse.json();
                    setMovieData(data);
                    return;
                }
                let response;
                if (slug === "latest-movie") {
                    response = await axios.get(`${API_USER_URL}/getlatestmovie/${cityID}`);
                }
                else {
                    response = await axios.get(`${API_USER_URL}/upcomingmovie/${cityID}`);
                }

                if (response.status === 200) {
                    const data = response.data.data;
                    setMovieData(data);
                    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                    const responseToCache = new Response(jsonBlob);
                    await cache.put(cacheKey, responseToCache);
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        };
        fetchDetails();
    }, [selectCity]);

    const languages = Array.from(
        new Set(movieData.flatMap(movie => movie.movieLanguage.map(item => item.language)))
    );

    const types = Array.from(
        new Set(movieData.flatMap(movie => movie.movieType.map(item => item.type)))
    );

    const screenType = Array.from(
        new Set(movieData.flatMap(movie => movie.screenTypes.map(item => item)))
    );

    return (
        <div key={selectCity?.id} className="container-fluid m=0 recommed_all">
            <Carousel />
            <div className=" d-flex mt-5 pb-3 main_movie gap-5">
                <div className="left_fliter">
                    <div className="fs-3 fw-bold">Filters</div>
                    <div className="language_filter p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="lan_filter_title" onClick={() => setshowlanguages(!showLanguages)}>{showLanguages ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span style={{ color: showLanguages ? "#d71921" : "inherit" }}>Languages</span></div>
                            <span>Clear</span>
                        </div>
                        {showLanguages && (
                            <div className="pt-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {languages.map((item, index) => (
                                    <span key={index} className="lag_modal" >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="language_filter p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="lan_filter_title" onClick={() => setShowGenres(!showGenres)}>{showGenres ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span style={{ color: showGenres ? "#d71921" : "inherit" }}>Genres</span></div>
                            <span>Clear</span>
                        </div>
                        {showGenres && (
                            <div className="pt-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {types.map((item, index) => (
                                    <span key={index} className="lag_modal" >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="language_filter p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="lan_filter_title" onClick={() => setShowFormat(!showFormt)}>{showFormt ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span style={{ color: showFormt ? "#d71921" : "inherit" }}>Format</span></div>
                            <span>Clear</span>
                        </div>
                        {showFormt && (
                            <div className="pt-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {screenType.map((item, index) => (
                                    <span key={index} className="lag_modal" >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="see_browse">Browse by Cinemas</div>
                </div>
                <div className="right_movie">
                    <div className="fs-3 fw-bold mb-3">Movies in {selectCity?.city}</div>
                    <div className="mb-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {languages.map((item, index) => (
                            <span key={index} className="lag_modal_right" >
                                {item}
                            </span>
                        ))}
                    </div>
                    {slug!=='upcoming-movie' &&(
                          <div className="d-flex justify-content-between coming_sec my-3 p-3">
                          <span className="fs-4 fw-bold">Coming Soon</span>
                          <span style={{cursor:"pointer"}} className="d-flex justify-content-center align-items-center gap-2" onClick={() => router.push(`/explore/seeall/upcoming-movie`)}>Explore Upcoming Movies<IoIosArrowForward /></span>
                      </div>
                    )}
                  
                    <div className="see_scroll">
                        {movieData.map((item) => (
                            <div key={item._id} className="see-card p-0" onClick={() => router.push(`/explore/movie/${item._id}`)}>
                                <div style={{ height: "400px" }} className="mb-3">
                                    <div className="recommendedAllMovie_wrapper" style={{ position: 'relative', height: "80%", width: "100%" }}>
                                        <Image
                                            src={item.imageURl}
                                            alt="movie"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                            className="recommendedAllMovie_image"
                                        />
                                    </div>
                                    <p className="fs-5 p-0 mt-3 fw-bold">{item.title}</p>
                                    {item.movieType.map((val, index) =>
                                        <span key={val._id}>
                                            {val.type}
                                            {index !== item.movieType.length - 1 && ','}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
};

export default RecommendedAll;
