'use client';
import "../css/show.css";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_USER_URL } from "../utils/config";
import { CiHeart } from "react-icons/ci";
import Cookies from "js-cookie";
import { IoSearch } from "react-icons/io5";

interface cinema {
    id: number;
    cinemaName: string;
    address: string;
    cinemaLandmark: string;
    facility: {
        facility: string;
        status: number;
    }[];
    allDates: {
        weekday: string;
        day: string;
        month: string;
        hasShow: boolean;
        formattedDate: string;
        rawDate:string;
    }[];
    movieData: {
        movieId: string;
        movieName: string;
        shows: {
            _id: string;
            formattedShowTime: string;
            priceInfoForShow: {
                rowType: string;
                price: number;
                _id: string;
            }[];
        }[];
    }[];
}

const Showlist = () => {
    const router = useRouter();
    const [showData, setshowData] = useState<cinema | undefined>(undefined);
    const [showFacility, setShowFacility] = useState(false)
    const [selectedCity, setSelectedCity] = useState<string>("");
    const selectedCityVal = Cookies.get("selected_city");
    const [selectDate, setSelectDate] = useState<string>("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const cinemaId = localStorage.getItem("selected-cinema");
                const todayTime = new Date();
                const response = await axios.get(`${API_USER_URL}/getmoviesincinema`, {
                    params: {
                        cinemaId,
                        todayTime
                    }
                });
                setshowData(response?.data?.data);
                setSelectDate(response?.data?.data?.allDates[0].formattedDate)
                if (selectedCityVal) {
                    const city = selectedCityVal ? JSON.parse(selectedCityVal) : null;
                    setSelectedCity(city.city)
                }
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        }
        fetchDetail();
    }, []);


    return (
        <div className="container-fluid p-0 show_detail">
            <div className="container-fluid p-0 mt-3 show_inner_detail">
                <div className="d-flex flex-column mt-1 show_detail_title show_detail_title_ext">
                    <div
                        className="position-absolute start-0 mt-2 ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => router.back()} >
                        <FiArrowLeft size={20} color="black" />
                    </div>
                    <div className="mt-2 d-flex justify-content-between">
                        <div className="d-flex">
                            <div className="d-flex">
                                <CiHeart size={30} style={{ marginRight: "10px", marginTop: "2px" }} />
                            </div>
                            <div>
                                <p className="show_detail_title_text m-0">{showData?.cinemaName}: {showData?.cinemaLandmark}, {selectedCity}</p>
                                <span style={{ fontSize: "13px" }}>{showData?.address}</span>
                            </div>
                        </div>
                        <div onClick={() => { setShowFacility(!showFacility) }} className="d-flex" style={{ fontSize: "15px", marginTop: "auto", color: "#d71921", cursor: "pointer" }}>
                            <div> Details</div>
                            <div>
                                {showFacility ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
                            </div>
                        </div>
                    </div>
                </div>
                {showFacility && (
                    <div>
                        <div className="hrLine"></div>
                        <div className="d-flex flex-column mt-1 show_detail_title show_detail_title_ext">
                            <div className="mt-2 d-flex justify-content-between">
                                <div className="d-flex flex-column">
                                    <div className="d-flex facility_text mt-2 mb-4">
                                        Available facilities
                                    </div>
                                    <div className="d-flex gap-4 mb-4">
                                        {showData?.facility.map((item) => (
                                            <div className={item.status === 1 ? "facility_item" : "facility_item1"} key={item.facility}>{item.facility}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="hrLine"></div>
                <div className="d-flex show_detail_title show_detail_title_ext">
                    <div className="show_detail_sec2 w-100">
                        <div className="d-flex show_Date_sec">
                            {showData?.allDates.map((item, index) => (
                                <div key={index} onClick={async() => {
                                    if (item.hasShow) {
                                        setSelectDate(item.formattedDate)
                                        const cinemaId = localStorage.getItem("selected-cinema");
                                        const todayTime = new Date(item.rawDate);
                                        const response = await axios.get(`${API_USER_URL}/getmoviesincinema`, {
                                            params: {
                                                cinemaId,
                                                todayTime
                                            }
                                        });
                                        setshowData(response?.data?.data);
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
                    {showData?.movieData.map((item) => (
                        <div key={item.movieId} className="show_movie_name">
                            <div className="d-flex show_movie_name_small   m-3">
                                <div className="show_movie_name_left"><p className="fs-6">{item.movieName}</p></div>
                                <div className="show_movie_name_right">
                                    {item?.shows?.map((val) => (
                                        <div key={val._id} className="show_time_container">
                                            <div className="show_movie_time" onClick={() => router.push("/seat")} >{val.formattedShowTime}</div>
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

export default Showlist;