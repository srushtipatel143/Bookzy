'use client';

import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import "../css/seat.css";
import { useEffect, useState } from 'react';
import { API_USER_URL } from "../utils/config";
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';
import axios from 'axios';

interface showDetails {
    cinemaLandmark: string,
    cinemaName: string;
    formattedTimeFull: string;
    movieName: String;
    city: string;
    _id: string;
    priceInfoForShow: {
        rowType: string;
        price: number;
        _id: string;
    }[];
}

interface showTimeChart {
    selectshow: string;
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

interface SeatLayout {
    types: {
        rowType: string,
        price: number,
        rows: {
            rowId: number;
            rowName: string;
            seats: {
                seatId: number;
                seatName: string;
            }[];
        }[];
    }[];
}

const Seatscreen = () => {
    const router = useRouter();
    const [selectShowChart, setSelectshowChart] = useState<showTimeChart | undefined>(undefined);
    const [selectShow, setSelectshow] = useState<showDetails | undefined>(undefined);
    const [seatLayout, setSeatLAyout] = useState<SeatLayout | undefined>(undefined)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const selectShowdata = localStorage.getItem("select-show");
                if (selectShowdata) {
                    const selectedCity = Cookies.get("selected_city");
                    if (selectedCity) {
                        const city = selectedCity ? JSON.parse(selectedCity) : null;
                        const selectShowDetail = JSON.parse(selectShowdata);
                        setSelectshowChart(selectShowDetail)
                        const selectShowInfo = selectShowDetail.show.find((item: showDetails) => item._id === selectShowDetail.selectshow);
                        const data = { ...selectShowInfo, city: city.city, cinemaLandmark: selectShowDetail.cinemaLandmark };
                        setSelectshow(data);

                        const responseSeats = await axios.get(`${API_USER_URL}/getshowinfo/${selectShowDetail?.selectshow}`);
                        setSeatLAyout(responseSeats.data.data)
                    }
                }
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    }, []);

    return (
        <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
            <div className="d-flex seat_top align-items-center justify-content-between px-3 pb-2">
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ cursor: "pointer" }} onClick={() => router.back()}> <RiArrowLeftWideFill size={40} /></div>
                    <div>
                        <span className="fs-5 fw-bold">{selectShow?.movieName}</span>
                        <br />
                        <span className="fs-6">{selectShow?.cinemaName} : {selectShow?.cinemaLandmark}, {selectShow?.city} | {selectShow?.formattedTimeFull}</span>
                    </div>
                </div>
                <div style={{ cursor: "pointer" }} onClick={() => router.back()}>
                    <RxCross2 size={18} />
                </div>
            </div>
            <div className="show_time_list p-3">
                {selectShowChart?.show?.map((item) => (
                    <div className={item._id === selectShowChart?.selectshow ? "seat_show_timeSelect" : "seat_show_time"} key={item._id}>{item.formattedShowTime}</div>
                ))}
            </div>
            <div className="hrLine1"></div>
            <div className="show_seat">
                <div className="seat_main_sec p-3">
                    {seatLayout?.types?.map((section) => (
                        <div key={section.rowType} className="seat_category">
                            <div className="seatCategory my-1">Rs.{section?.price} {section?.rowType} </div>
                            <div className="hrLineSeat my-1"></div>
                            {section?.rows?.map((row) => (
                                <div key={row.rowId} className="d-flex seat_row">
                                    <div className="row_label">{row.rowName}</div>
                                    <div className="d-flex row_seat">
                                        {Array.from({ length: row.seats.length }).map((_, seatIndex) => (
                                            <div key={seatIndex} className="seat">
                                                {seatIndex + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Seatscreen;
