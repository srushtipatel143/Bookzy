'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FiArrowLeft } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import "../../css/search.css";
import { useEffect, useState } from "react";
import {useSearch } from "../context/searchContext";
import Cookies from "js-cookie";
import { API_USER_URL } from "../../utils/config";
import {toast,ToastContainer} from "react-toastify";
import axios from "axios";

interface cinema{
    id:number,
    cinemaName:string,
    cinemaLandmark:string
}

interface movie{
    _id:string,
    title:string,
    movieLanguage:{
        language:string;
    }[];
}

const Searchfield = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {setShowSearch } = useSearch();
    const [showDivSection, setShowDivSection] = useState(true);
    const [triggerCinemaNavigate, setTriggerCinemaNavigate] = useState(false);
    const [triggerMovieNavigate, setTriggerMovieNavigate] = useState(false);
    const [currentpath, setCurrentPath] = useState(pathname);
    const [cinema,setcinema]=useState<cinema[]>([]);
    const [movie,setMovie]=useState<movie[]>([]);
    
    useEffect(()=>{
        const fetchDetails=async()=>{
            try {
                const selectedCity=Cookies.get("selected_city");
                if (!selectedCity) {
                    toast.error("City is not selected");
                    return;
                }
                const cityData = JSON.parse(selectedCity);
                const getCinemaRes=await axios.get(`${API_USER_URL}/getAllCinemaByCity/${cityData.id}`);
                const getMovies=await axios.get(`${API_USER_URL}/getmoviesincity/${cityData.id}`);
                const cinemaDetails=getCinemaRes?.data?.data;
                const movieDetails=getMovies?.data?.data;
                setcinema(cinemaDetails);
                setMovie(movieDetails);

            } catch (error:any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    },[]);

    const languages = Array.from(
        new Set(movie.flatMap(data => data.movieLanguage.map(item => item.language)))
    );

    useEffect(() => {
        if (triggerCinemaNavigate) {
            router.push("/explore/cinema")
        }
        if (triggerMovieNavigate) {
            router.push("/explore/movie")
        }
    }, [triggerCinemaNavigate, triggerMovieNavigate]);

    useEffect(() => {
        if (triggerCinemaNavigate && pathname !== currentpath) {
            setShowSearch(false)
        }
        if (triggerMovieNavigate && pathname !== currentpath) {
            setShowSearch(false)
        }
    }, [pathname]);

    return (
        <div className="container-fluid position-relative search_top_priority recommend_movie m-0 p-0" style={{ minHeight: "100vh" }}>
            <div className="d-flex align-items-center search_top justify-content-between px-3  py-5">
                <div style={{ cursor: "pointer" }} onClick={() => setShowSearch(false)}>
                    <FiArrowLeft size={30} />
                </div>
                <form style={{ width: "50%" }}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search for Cinemas and Movies"
                            aria-label="Search"
                            style={{
                                outline: "none",
                                boxShadow: "none",
                                borderRadius: "0px",
                                height: "3rem",
                            }}
                        />
                    </div>
                </form>
                <div style={{ cursor: "pointer" }} onClick={() => setShowSearch(false)}>
                    <RxCross2 size={30} />
                </div>
            </div>
            <div className="filter_Section mt-4">
                <div className="filter_Sec1">
                    <div className="filter_Sec1Left ps-3">
                        <button onClick={() => setShowDivSection(true)} className={showDivSection ? "filter_Select_btn" : 'filter_NoSelect_btn'}>Movies</button>
                        <button onClick={() => setShowDivSection(false)} className={!showDivSection ? "filter_Select_btn" : 'filter_NoSelect_btn'}>Cinemas</button>
                    </div>
                    {showDivSection && (
                        <div style={{ display: "flex", gap: "5px", fontSize: "12px" }}>
                            <div style={{ padding: "5px 10px" }}>Filter</div>
                            {languages.map((item, index) => (
                                <span key={index} className="filter_Sec1RightLan" >
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {showDivSection ? (
                    <div className="filter_Sec3 mt-5">
                        {[
                            { language: "Hindi", movies: [1, 2, 3, 4, 5, 6, 7, 8] },
                            { language: "Telugu", movies: [1, 2, 3] },
                            { language: "Bangali", movies: [1, 2, 3] },
                            { language: "Punjabi", movies: [1] },
                            { language: "English", movies: [1, 2, 3] },
                            { language: "English", movies: [1, 2, 3, 4, 5, 6, 7] }
                        ].map((section, index) => (
                            <div key={index} className="fil_movie_list1 mt-1">
                                <div className="fil_movie_list">
                                    <div className="language_title my-3">{section.language}</div>
                                    {section.movies.map((row, rowIndex) => (
                                        <div key={rowIndex} onClick={() => {
                                            setCurrentPath(pathname);
                                            setTriggerMovieNavigate(true);
                                        }} className="fil_cinema_text">
                                            Main Tera Hero
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="filter_Sec2 mt-5">
                        <div className="fil_cinema_list mt-3" onClick={() => {
                            setCurrentPath(pathname);
                            setTriggerCinemaNavigate(true);
                        }}>
                            {cinema.map((item) => (
                                <ul key={item.id} className="fil_cinema_name">
                                    <li className="fil_cinema_text">{item.cinemaName} : {item.cinemaLandmark}</li>
                                </ul>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Searchfield;
