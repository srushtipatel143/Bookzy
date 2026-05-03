'use client';
import "@/styles/show.css";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_USER_URL } from "@/utils/config";
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
        rawDate: string;
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
                if (response?.data?.data?.movieData.length > 0) {
                    setSelectDate(response?.data?.data?.allDates[0].formattedDate)
                }
                if (selectedCityVal) {
                    const city = selectedCityVal ? JSON.parse(selectedCityVal) : null;
                    setSelectedCity(city.city)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        }
        fetchDetail();
    }, []);

    const selectShow = (data: any) => {
        const selectShowDetail = JSON.stringify(data)
        localStorage.setItem("select-show", selectShowDetail)
        router.push("/seat")
    }


    return (
        <div className="container-fluid p-0 show_detail">
            <div className="container-fluid p-0 mt-3 show_inner_detail">
                <div className="d-flex align-items-center gap-1">
                    <div
                        className="mt-2 ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => router.back()} >
                        <FiArrowLeft size={20} color="black" />
                    </div>
                    <div className="d-flex flex-column mt-1 show_detail_title show_detail_title_ext">
                        <div className="mt-2 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                            <div className="d-flex justify-content-center  align-items-center gap-2">
                                <CiHeart size={26} />
                                <div className="text-wrap text-break w-100">
                                    <p className="show_detail_title_text m-0">
                                        {showData?.cinemaName}: {showData?.cinemaLandmark}, {selectedCity}
                                    </p>
                                    <span style={{ fontSize: "13px" }}>
                                        {showData?.address}
                                    </span>
                                </div>
                            </div>
                            <div
                                onClick={() => setShowFacility(!showFacility)}
                                className="d-flex align-items-center gap-1 mt-2 mt-md-0 ms-md-auto"
                                style={{ fontSize: "15px", color: "#d71921", cursor: "pointer" }}
                            >
                                <span>Details</span>
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
                {showData !== undefined && showData?.allDates?.length > 0 && (
                    <div className="hrLine"></div>
                )}
                <div className="d-flex show_detail_title show_detail_title_ext">
                    <div className="show_detail_sec2 w-100">

                        <div className="show_Date_sec scroll_x">
                            {showData?.allDates.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={async () => {
                                        if (item.hasShow) {
                                            setSelectDate(item.formattedDate);

                                            const cinemaId = localStorage.getItem("selected-cinema");
                                            let todayTime;

                                            if (index === 0) {
                                                todayTime = new Date();
                                            } else {
                                                todayTime = new Date(item.rawDate);
                                            }

                                            const response = await axios.get(`${API_USER_URL}/getmoviesincinema`, {
                                                params: { cinemaId, todayTime }
                                            });

                                            setshowData(response?.data?.data);
                                        }
                                    }}
                                    className={`date_card ${item.hasShow ? 'show_detail_date' : 'show_detail_date1'}  ${item.formattedDate === selectDate ? 'selectdate_cinema' : ''}`}
                                >
                                    <div className="date-day">{item.weekday}</div>
                                    <div className="date-date">{item.day}</div>
                                    <div className={`${item.formattedDate === selectDate ? 'date-month1' : 'date-month'}`}>
                                        {item.month}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hrLine1"></div>
            </div>

            <div className="container-fluid p-0 mt-3 show_detail_title show_data">
                <div className="container">
                    {showData?.movieData.map((item) => (
                        <div key={item.movieId} className="show_movie_name">

                            <div className="row align-items-start m-2 py-3">
                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                    <p className="fs-6 mb-0">
                                        {item.movieName}
                                    </p>
                                </div>
                                <div className="col-12 col-md-8">
                                    <div className="d-flex flex-wrap gap-2">

                                        {item?.shows?.map((val) => (
                                            <div key={val._id} className="show_time_container">

                                                <div
                                                    className="show_movie_time"
                                                    onClick={() => selectShow({ ...val, selectshow: val._id })}
                                                >
                                                    {val.formattedShowTime}
                                                </div>

                                                <div className="price_info_hover">
                                                    <div className="d-flex flex-wrap">
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