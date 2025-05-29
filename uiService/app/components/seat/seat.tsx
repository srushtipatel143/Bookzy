'use client';

import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import "../../css/seat.css";
import { useEffect, useState } from 'react';
import { API_USER_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';
import axios from 'axios';
import SeatNomodal from './noOfSeat';
import Paymentmodal from './paymentModal';

interface showDetails {
    cinemaLandmark: string,
    cinemaName: string;
    cinemaId: number;
    movieId: string;
    screenId: number;
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

interface selectSeat {
    cinemaId: number,
    movieId: string,
    screenId: number,
    showId: string,
    rowName: string,
    seatName: string,
    price: number;
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
    const [selectNoOfSeat, setSelectNoOfSeat] = useState<number | 2>(2);
    const [selectNoOfSeatModal, setSelectNoOfSeatModal] = useState<boolean | false>(false);
    const [showPayment, setShowPayment] = useState<boolean | false>(false);
    const [selectSeats, setSelectSeats] = useState<selectSeat[]>([]);

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
                        setSelectNoOfSeatModal(true)
                    }
                }
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    }, []);

    const payBtnFunction = async () => {
        try {
            setShowPayment(true)
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className="container-fluid p-0 position-relative" style={{ minHeight: "100vh" }}>
            {!showPayment ? (
                <div>
                    <SeatNomodal
                        selectNoOfSeat={selectNoOfSeat}
                        setSelectNoOfSeat={setSelectNoOfSeat}
                        selectNoOfSeatModal={selectNoOfSeatModal}
                        setSelectNoOfSeatModal={setSelectNoOfSeatModal}
                        priceInfoForShow={selectShow?.priceInfoForShow || []}
                    />
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
                                                {Array.from({ length: row.seats.length }).map((_, seatIndex) => {
                                                    const seatName = row.seats[seatIndex]?.seatName;
                                                    const isSelected = selectSeats.some(
                                                        seat => seat.rowName === row.rowName && seat.seatName === seatName
                                                    );

                                                    return (
                                                        <div
                                                            key={seatIndex}
                                                            onClick={() => {
                                                                const data: selectSeat = {
                                                                    cinemaId: selectShow?.cinemaId!,
                                                                    movieId: selectShow?.movieId!,
                                                                    screenId: selectShow?.screenId!,
                                                                    showId: selectShowChart?.selectshow!,
                                                                    rowName: row.rowName,
                                                                    seatName: seatName,
                                                                    price: section.price
                                                                };

                                                                setSelectSeats(prev => {
                                                                    const updatedSeats = [...prev];
                                                                    if (updatedSeats.length === selectNoOfSeat) {
                                                                        updatedSeats.shift();
                                                                    }
                                                                    updatedSeats.push(data);
                                                                    return updatedSeats;
                                                                });
                                                            }}
                                                            className={`seat ${isSelected ? 'selected-seat' : ''}`}
                                                        >
                                                            {seatIndex + 1}
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {selectSeats.length === selectNoOfSeat && (
                            <div className='pay_btn_click '>
                                <button className='pay_count_btn mb-4' onClick={payBtnFunction}>Pay Rs.{selectSeats.reduce((total, item) => total + item.price, 0)}</button>
                            </div>
                        )}
                    </div>
                </div>
            ):(
                <Paymentmodal/>
            )}

            <ToastContainer />
        </div>
    );
};

export default Seatscreen;
