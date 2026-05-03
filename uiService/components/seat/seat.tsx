'use client';

import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import "@/styles/seat.css";
import { useEffect, useState } from 'react';
import { API_USER_URL, API_AUTH_URL } from "@/utils/config";
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';
import axios from 'axios';
import SeatNomodal from './noOfSeat';
import Paymentmodal from './paymentModal';
import { Modal } from 'react-bootstrap';
import Image from 'next/image';

interface showDetails {
    cinemaLandmark: string,
    cinemaName: string;
    cinemaId: number;
    movieId: string;
    screenId: number;
    formattedTimeFull: string;
    movieName: string;
    screenName: string;
    city: string;
    _id: string;
    priceInfoForShow: {
        rowType: string;
        price: number;
        _id: string;
    }[];
}

interface selectSeat {
    id: number;
    cinemaId: number,
    movieId: string,
    screenId: number,
    showId: string,
    rowName: string,
    seatName: string,
    price: number;
    rowType: string;
    screenName: string;
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
                id: number;
                status: string;
            }[];
        }[];
    }[];
}

interface userdata {
    email: string;
    mobile: string;
}

interface selectSeatData {
    userId: string;
    firstName: string;
    email: string;
    mobile: number;
    cinemaId: number,
    movieId: string,
    screenId: number,
    showId: string,
    rowName: string,
    seatName: string,
    price: number;
    rowType: string;
    screenName: string;
    amount: number,
    convenienceFee: number,
    totalAmount: number,
    ticket: {
        rowType: string;
        seats: {
            seatName: string;
            price: number;
            rowName: string;
            id: number;
            status: string;
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
    const [userDetailConfirmModal, setUserDetailConfirmModal] = useState<boolean | false>(false);
    const [dataValue, setDataValue] = useState<userdata | undefined>(undefined);
    const [selectSeatData, setSelectSeatData] = useState<selectSeatData | undefined>(undefined);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const selectShowdata = localStorage.getItem("select-show");
                if (selectShowdata) {
                    const selectedCity = Cookies.get("selected_city");
                    const isUserLoggedIn = Cookies.get("logged_user");
                    if (selectedCity) {
                        const city = selectedCity ? JSON.parse(selectedCity) : null;
                        const selectShowDetail = JSON.parse(selectShowdata);
                        setSelectshowChart(selectShowDetail)
                        let selectShowInfo;
                        if (selectShowDetail?.show) {
                            selectShowInfo = selectShowDetail?.show.find((item: showDetails) => item._id === selectShowDetail.selectshow);
                        }
                        else {
                            selectShowInfo = selectShowDetail;

                        }
                        const data = { ...selectShowInfo, city: city.city, cinemaLandmark: selectShowDetail.cinemaLandmark };
                        setSelectshow(data);

                        let responseSeats;

                        if (isUserLoggedIn) {
                            responseSeats = await axios.get(`${API_USER_URL}/getshowinfo/${selectShowDetail?.selectshow}`,
                                { withCredentials: true }
                            );
                        } else {
                            responseSeats = await axios.get(`${API_USER_URL}/getshowinfo/${selectShowDetail?.selectshow}`);
                        }
                        setSeatLAyout(responseSeats.data.data)
                        setSelectNoOfSeatModal(true)
                    }
                }
            } catch (error: any) {
                return toast.error(error?.response?.data?.message);
            }
        }
        fetchDetails();
    }, []);

    const handlechange = (e: any) => {
        const { name, value } = e.target;
        setDataValue((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const payBtnFunction = async () => {
        try {
            const user = Cookies.get("logged_user");
            if (user) {
                const response = await axios.get(`${API_AUTH_URL}/getuser`, {
                    withCredentials: true
                });
                const isUserHaveEmailPhone = response?.data?.data;
                setDataValue(isUserHaveEmailPhone)
                if (isUserHaveEmailPhone.email === undefined || isUserHaveEmailPhone.mobile === undefined) {
                    setUserDetailConfirmModal(true)
                }
                else {
                    const data = {
                        userId: response?.data?.data?._id,
                        email: response?.data?.data?.email,
                        mobile: response?.data?.data?.mobile,
                        firstName: response?.data?.data?.response?.data?.data?._id,
                        selectSeats: selectSeats
                    }
                    const selectSeatPay = await axios.post(`${API_USER_URL}/selectSeat`, data);
                    setSelectSeatData(selectSeatPay?.data?.data);
                    setUserDetailConfirmModal(false)
                    setShowPayment(true);
                }
            } else {
                setUserDetailConfirmModal(true)
            }
        } catch (error: any) {
            return toast.error(error?.response?.data?.message);
        }
    }

    const submitFunctionCall = async () => {
        try {
            const userData = await axios.post(`${API_AUTH_URL}/adduserduringpayment`, dataValue);
            const data = {
                userId: userData?.data?.data?.userId,
                email: userData?.data?.data?.email,
                mobile: userData?.data?.data?.mobile,
                selectSeats: selectSeats
            }
            const selectSeatPay = await axios.post(`${API_USER_URL}/selectSeat`, data);
            setSelectSeatData(selectSeatPay?.data?.data)
            setUserDetailConfirmModal(false)
            setShowPayment(true)
        } catch (error: any) {
            return toast.error(error?.response?.data?.message);
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
                                                {row.seats.map((seat, seatIndex) => {
                                                    const seatName = seat.seatName;
                                                    const id = seat.id;
                                                    const status = seat.status;
                                                    const isSelected = selectSeats.some(
                                                        s => s.rowName === row.rowName && s.seatName === seatName
                                                    );
                                                    const isBooked = status === 'Booked';
                                                    const handleClick = () => {
                                                        if (isBooked) return;
                                                        const data: selectSeat = {
                                                            cinemaId: selectShow?.cinemaId!,
                                                            movieId: selectShow?.movieId!,
                                                            screenId: selectShow?.screenId!,
                                                            showId: selectShowChart?.selectshow!,
                                                            screenName: selectShow?.screenName!,
                                                            rowName: row.rowName,
                                                            seatName: seatName,
                                                            price: section.price,
                                                            rowType: section.rowType,
                                                            id: id
                                                        };
                                                        setSelectSeats(prev => {
                                                            const updatedSeats = [...prev];
                                                            if (updatedSeats.length === selectNoOfSeat) {
                                                                updatedSeats.shift();
                                                            }
                                                            updatedSeats.push(data);
                                                            return updatedSeats;
                                                        });
                                                    };

                                                    return (
                                                        <div
                                                            key={seatIndex}
                                                            onClick={handleClick}
                                                            className={`seat ${isBooked ? 'booked-seat' : ''} ${isSelected ? 'selected-seat' : ''}`}
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
            ) : (
                <Paymentmodal selectSeatData={selectSeatData} />
            )}
            <Modal show={userDetailConfirmModal} onHide={() => setUserDetailConfirmModal(false)} centered contentClassName="custom_modal">
                <Modal.Header className="border-0" closeButton >
                </Modal.Header>
                <Modal.Body>
                    <div className="card p-4 form_styling">
                        <div className='d-flex justify-content-center'>
                            <Image src="/booking_logo.png" alt="web_logo" width={75} height={75} className="mb-3" />
                        </div>
                        <div className="my-3">
                            <label className='mb-1'>Enter your email</label>
                            <input type="email" name='email' onChange={handlechange} value={dataValue?.email || ''} className="form-control" placeholder="Enter email address" />
                        </div>
                        <div className="my-3">
                            <label className='mb-1'>Phone number</label>
                            <input type="text" name='mobile' onChange={handlechange} value={dataValue?.mobile || ''} className="form-control" placeholder="Enter phone number" />
                        </div>
                        <div className="mt-5">
                            <button className="button-primary w-100" onClick={submitFunctionCall}>Submit</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default Seatscreen;
