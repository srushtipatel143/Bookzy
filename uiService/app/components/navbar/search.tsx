'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import "../../css/search.css";
import { useEffect, useState } from "react";
import { useSearch } from "../context/searchContext";
import Cookies from "js-cookie";
import { API_USER_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Select from "react-select";

interface cinema {
    id: number,
    cinemaName: string,
    cinemaLandmark: string
}

interface movie {
    language: string;
    movies: {
        movieId: string;
        movieName: string;
        screenTypes: [];
        movieType: {
            type: string;
        }[];
    }[];
}[];

const Searchfield = () => {
    const router = useRouter();
    const { setShowSearch } = useSearch();
    const [showDivSection, setShowDivSection] = useState(true);
    const [cinema, setcinema] = useState<cinema[]>([]);
    const [movie, setMovie] = useState<movie[]>([]);
    const [searchOption, setSearchOption] = useState<[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const selectedCity = Cookies.get("selected_city");
                if (!selectedCity) {
                    toast.error("City is not selected");
                    return;
                }
                const cityData = JSON.parse(selectedCity);
                const getCinemaRes = await axios.get(`${API_USER_URL}/getAllCinemaByCity/${cityData.id}`);
                const getMovies = await axios.get(`${API_USER_URL}/getmoviesincity/${cityData.id}`);
                const cinemaDetails = getCinemaRes?.data?.data;
                const movieDetails = getMovies?.data?.data;
                setcinema(cinemaDetails);
                setMovie(movieDetails);

            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        fetchDetails();
    }, []);

    const typeSelect = (data: any) => {
        const value = {
            movieId: data.movieId,
            movieName: data.movieName,
            selectLanguage: data.selectLanguage,
            selectScreen: data.selectScreen,
            type: data.movieType
        }
        localStorage.setItem("select-movie", JSON.stringify(value));
        router.push("/explore/cinema");
        setShowSearch(false);
    }

    const handleChange = async (inputValue: string) => {
        try {
            if (inputValue.length > 0) {
                const getCityRes = await axios.get(`${API_USER_URL}/searchmoviecinema/${inputValue}`);
                const options = getCityRes.data.data.map((item: any) => ({
                    label: item.city,
                    value: item.id,
                    fullData: item,
                }));
                setSearchOption(options);
                setIsMenuOpen(inputValue.length > 0);
            }
            else {
                setSearchOption([])
                setIsMenuOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container-fluid position-relative search_top_priority recommend_movie m-0 p-0" style={{ minHeight: "100vh" }}>
            <div className="d-flex align-items-center search_top justify-content-between px-3  py-5">
                <div style={{ cursor: "pointer" }} onClick={() => setShowSearch(false)}>
                    <FiArrowLeft size={30} />
                </div>
                <form style={{ width: "50%" }}>
                    <div className="input-group">
                        <Select
                            className="w-100 search-input1"
                            placeholder="Search for your city"
                            options={searchOption}
                            menuIsOpen={isMenuOpen}
                            onInputChange={(inputValue) => {
                                handleChange(inputValue)
                            }}
                            noOptionsMessage={() => "No Results found"}
                            styles={{
                                placeholder: (base) => ({
                                    ...base,
                                    fontSize: "14px"
                                }),
                                noOptionsMessage: (base) => ({
                                    ...base,
                                    color: "#d71921",
                                    textAlign: "left",
                                    paddingLeft: "10px",
                                    fontSize: "14px"
                                }),
                                option: (base) => ({
                                    ...base,
                                    fontSize: "14px"
                                })
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
                            {movie.map((item, index) => (
                                <span key={index} className="filter_Sec1RightLan" >
                                    {item.language}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {showDivSection ? (
                    <div className="filter_Sec3 mt-3">
                        {movie.map((section) => (
                            <div key={section.language} className="fil_movie_list1 mt-1">
                                <div className="fil_movie_list">
                                    <div className="language_title my-3">{section.language}</div>
                                    {section.movies.map((row) => (
                                        <div key={row.movieId} onClick={(e) => {
                                            e.preventDefault()
                                            setShowSearch(false);
                                            router.push(`/explore/movie/${row.movieId}`);
                                        }}>
                                            <div className="fil_cinema_text">{row.movieName}</div>
                                            {row.screenTypes.length > 1 && (
                                                <div className='d-flex my-1'>
                                                    {row.screenTypes.map((val) => (
                                                        <div className='fil_cinema_type' onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault()
                                                            typeSelect({
                                                                movieId: row.movieId,
                                                                movieName: row.movieName,
                                                                movieType: row.movieType,
                                                                selectLanguage: section.language,
                                                                selectScreen: val
                                                            })
                                                        }} key={val}>{val}</div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="filter_Sec2 mt-3">
                        <div className="fil_cinema_list mt-3">
                            {cinema.map((item) => (
                                <ul key={item.id} className="fil_cinema_name">
                                    <li onClick={() => {
                                        const cinemaId = item.id.toString();
                                        setShowSearch(false);
                                        localStorage.setItem("selected-cinema", cinemaId);
                                        router.push("/explore/show");
                                    }} className="fil_cinema_text">{item.cinemaName} : {item.cinemaLandmark}</li>
                                </ul>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Searchfield;
