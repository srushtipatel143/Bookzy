'use client';

import "../css/show.css";
import "../css/cinema.css";
import { useRouter } from 'next/navigation';
import { CiHeart } from "react-icons/ci";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { API_USER_URL } from "../utils/config";
import { IoSearch } from "react-icons/io5";

interface cinema {
    id: number,
    cinemaName: string,
    cinemaLandmark: string,
    show: {
        formattedShowTime: string;
        _id: string;
        priceInfoForShow: {
            rowType: string;
            price: number;
            _id: string;
        }[];
    }[];
}

interface dateDetails {
    weekday: string;
    day: string;
    month: string;
    hasShow: boolean;
    formattedDate: string;
    rawDate: string;
}

interface SelectMovie {
    movieId: string;
    movieName: string;
    type: {
        type: string;
        _id: string;
    }[];
    selectLanguage: string;
    selectScreen: string;
}

const Cinemascreen = () => {
    const router = useRouter();
    const [cinema, setcinema] = useState<cinema[]>([]);
    const [selectMovie, setSelectMovie] = useState<SelectMovie | null>(null);
    const [selectDate, setSelectDate] = useState<string>("");
    const [allDates, setAllDates] = useState<dateDetails[]>([]);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getSelectMovie = localStorage.getItem("select-movie");
                const getSelectMovieData: SelectMovie | null = getSelectMovie ? JSON.parse(getSelectMovie) : null;
                setSelectMovie(getSelectMovieData)

                const selectedCity = Cookies.get("selected_city");
                if (!selectedCity) {
                    toast.error("City is not selected");
                    return;
                }
                const cityData = JSON.parse(selectedCity);
                const todayTime = new Date();
                const bodydata = {
                    cityId: cityData?.id,
                    movieId: getSelectMovieData?.movieId,
                    language: getSelectMovieData?.selectLanguage,
                    selectScreen: getSelectMovieData?.selectScreen,
                    todayTime
                }
                const getCinemaRes = await axios.get(`${API_USER_URL}/getallcinemabyfilter`, {
                    params: bodydata
                });
                const cinemaDetails = getCinemaRes?.data?.data?.showData;
                setcinema(cinemaDetails);
                const datesData = getCinemaRes?.data?.data?.allDates;
                setAllDates(datesData);
                setSelectDate(getCinemaRes?.data?.data?.allDates[0].formattedDate);
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    }, []);

    const selectShow = (data: any) => {
        const selectShowDetail = JSON.stringify(data)
        localStorage.setItem("select-show", selectShowDetail)
        router.push("/seat")
    }

    return (
        <div className="container-fluid p-0 show_detail">
            <div className="container-fluid p-0 mt-3 show_inner_detail">
                <div className="d-flex flex-column mt-1 show_detail_title show_detail_title_ext">
                    <div
                        className="position-absolute start-0 mt-2 px-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => router.back()} >
                        <FiArrowLeft size={20} color="black" />
                    </div>
                    <div className="mt-1">
                        <p className="show_detail_title_text">{selectMovie?.movieName} - ({selectMovie?.selectLanguage})</p>
                    </div>
                    <div className="d-flex gap-2">
                        {selectMovie?.type?.map((item) => (
                            <div className="show_detail_type" key={item._id}><span>{item.type}</span></div>
                        ))}
                    </div>
                </div>
                <div className="hrLine"></div>
                <div className="d-flex show_detail_title show_detail_title_ext">
                    <div className="show_detail_sec2 w-100">
                        <div className="d-flex show_Date_sec">
                            {allDates.map((item, index) => (
                                <div key={index} onClick={async () => {
                                    if (item.hasShow) {
                                        setSelectDate(item.formattedDate)
                                        const getSelectMovie = localStorage.getItem("select-movie");
                                        const getSelectMovieData: SelectMovie | null = getSelectMovie ? JSON.parse(getSelectMovie) : null;
                                        setSelectMovie(getSelectMovieData)

                                        const selectedCity = Cookies.get("selected_city");
                                        if (!selectedCity) {
                                            toast.error("City is not selected");
                                            return;
                                        }

                                        const cityData = JSON.parse(selectedCity);
                                        const todayTime = new Date();
                                        const bodydata = {
                                            cityId: cityData?.id,
                                            movieId: getSelectMovieData?.movieId,
                                            language: getSelectMovieData?.selectLanguage,
                                            selectScreen: getSelectMovieData?.selectScreen,
                                            todayTime
                                        }
                                        const getCinemaRes = await axios.get(`${API_USER_URL}/getallcinemabyfilter`, {
                                            params: bodydata
                                        });
                                        const cinemaDetails = getCinemaRes?.data?.data?.showData;
                                        setcinema(cinemaDetails);
                                    }
                                }} className={`${item.hasShow ? 'show_detail_date' : 'show_detail_date1'
                                    } ${item.formattedDate === selectDate ? 'selectdate_cinema' : ''}`}>
                                    <div className="date-day">{item.weekday}</div>
                                    <div className='date-date'>{item.day}</div>
                                    <div className={`${item.formattedDate === selectDate ? 'date-month1' : 'date-month'}`}>{item.month}</div>
                                </div>
                            ))}
                        </div>
                        <div className="show_filter_sec">
                            <div className="show_detail_ext ms-auto">Hindi-2D</div>
                            <div className="show_detail_ext">Price Range</div>
                            <div className="show_detail_ext"> <IoSearch size={18} /></div>
                        </div>
                    </div>
                </div>
                <div className="hrLine1"></div>
            </div>
            <div className="p-0 mt-3 show_detail_title show_data">
                <div className="d-flex flex-column">
                    {cinema.map((item) => (
                        <div key={item.id} className="show_movie_name">
                            <div className="d-flex show_movie_name_small my-3 mx-3">
                                <div className="show_movie_name_left">
                                    <CiHeart size={20} />
                                    <span onClick={() => {
                                        localStorage.setItem("selected-cinema", String(item.id));
                                        router.push("/explore/show");
                                    }} className="cinema_text">{item.cinemaName} : {item.cinemaLandmark}</span>
                                </div>
                                <div className="show_movie_name_right">
                                    {item?.show?.map((val) => (
                                        <div key={val._id} className="show_time_container">
                                            <div className="show_movie_time" onClick={() => selectShow({ ...item, selectshow: val._id })} >{val.formattedShowTime}</div>
                                            <div className="price_info_hover">
                                                <div className="d-flex">
                                                    {val.priceInfoForShow.map((dt) => (
                                                        <div className="show_extdata" key={dt._id}>
                                                            <div className="show_extdata_rs">RS. {dt.price}</div>
                                                            <div className="show_extdata_type">{dt.rowType}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="hrLine1"></div>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Cinemascreen;