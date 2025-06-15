import Cookies from 'js-cookie';
import "../../css/seat.css";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { API_USER_URL } from "../../utils/config";
import { Modal } from 'react-bootstrap';

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

        }[];
    }[];
}

interface PaymentmodalProps {
    selectSeatData: selectSeatData | undefined;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}
const Paymentmodal = ({ selectSeatData }: PaymentmodalProps) => {

    const [selectShow, setSelectshow] = useState<showDetails | undefined>(undefined);
    const [backModal, setBackModal] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const selectShowdata = localStorage.getItem("select-show");
                if (selectShowdata) {
                    const selectedCity = Cookies.get("selected_city");
                    if (selectedCity) {
                        const city = selectedCity ? JSON.parse(selectedCity) : null;
                        const selectShowDetail = JSON.parse(selectShowdata);
                        const selectShowInfo = selectShowDetail.show.find((item: showDetails) => item._id === selectShowDetail.selectshow);

                        const data = { ...selectShowInfo, city: city.city, cinemaLandmark: selectShowDetail.cinemaLandmark };
                        setSelectshow(data);
                    }
                }
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const createOrder = async (val: selectSeatData) => {
        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert("Razorpay SDK failed to load.");
                return;
            }
            const result = await axios.post(`${API_USER_URL}/createorder`, val);

            const data = result.data;
            if (!data.success) {
                toast.error("Failed to create order");
                return;
            }
            const { order } = data;

            const options = {
                key: "rzp_test_kkZRAllbTtEquJ",
                amount: order.amount,
                currency: "INR",
                name: "Bookzy",
                description: "Test Transaction",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await axios.post(`${API_USER_URL}/verify`, response);

                    const verifyData = verifyRes.data;
                    if (verifyData.success) {
                        const bookingData = {
                            ...selectSeatData,
                            order_id: verifyData.data.order_id,
                            payment_id: verifyData.data.payment_id,
                            method: verifyData.data.method,
                            currency: verifyData.data.currency
                        }
                        const bookingDataApi = await axios.post(`${API_USER_URL}/bookingdata`, bookingData);
                        if (bookingDataApi.data.success) {
                            router.push("/")
                        }
                    }
                },
                prefill: {
                    name: selectSeatData?.firstName || 'Unknown',
                    email: selectSeatData?.email,
                    contact: selectSeatData?.mobile,
                },
                theme: {
                    color: "#d71921",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        }
        catch (error: any) {
            if (error.response.data.message === 'Time is expired') {
                setBackModal(true)
            }
            else {
                toast.error(error.response.data.message)
            }
        }
    }

    return (
        <div className="container-fluid p-0 d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div className="d-flex seat_top align-items-center justify-content-between px-3 pb-2">
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ cursor: "pointer" }} onClick={() => router.back()}>
                        <RiArrowLeftWideFill size={40} />
                    </div>
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

            <div className="payment_summary">
                <div className='payment_sec'>
                    <div className='payment_box_Color'>
                        <div className='p-4'>
                            <div className='payment_sec_heading'>BOOKING SUMMARY</div>
                            <div className='booking_details_text mt-4'>
                                {selectSeatData?.ticket.map((item, index) => (
                                    <div key={index} className='d-flex justify-content-between'>
                                        <div>
                                            {item.rowType} -{" "}
                                            {item.seats.map((v: any, i: number) => (
                                                <span key={v.seatName}>{v.seatName}{i < item.seats.length - 1 ? ", " : ""}</span>
                                            ))}{" "}
                                            ( {item.seats.length} {item.seats.length > 1 ? "Tickets" : "Ticket"} )
                                        </div>
                                        <div>Rs. {item.seats.reduce((acc: number, v: any) => acc + (v.price || 0), 0)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='booking_screen mt-1'>{selectSeatData?.screenName}</div>
                            <div className='booking_details_text mt-4'>
                                <div className='d-flex justify-content-between'>
                                    <div>Convenience fees</div>
                                    <div>Rs. {selectSeatData?.convenienceFee}</div>
                                </div>
                            </div>
                            <div className="hrLine3 mt-2"></div>
                            <div className='booking_details_text mt-2'>
                                <div className='d-flex justify-content-between'>
                                    <div> Sub total </div>
                                    <div>Rs. {selectSeatData?.totalAmount}</div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 amount_total_text'>
                            <div className='p-3 d-flex justify-content-between' >
                                <div>Amount Payable </div>
                                <div>Rs. {selectSeatData?.totalAmount}</div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 amount_total_text_pay '>
                        <div className='py-2 px-4 d-flex justify-content-between' onClick={() => {
                            if (selectSeatData) {
                                createOrder(selectSeatData);
                            }
                        }} >
                            <div>Total: Rs. {selectSeatData?.totalAmount}</div>
                            <div>Proceed</div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal centered show={backModal}>
                <Modal.Body className="p-0 m-3">
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <p>Please select seat again</p>
                        <button className='back_btn_1' onClick={() => router.back()}>Back</button>
                    </div>
                </Modal.Body>
            </Modal>


        </div>
    )
}

export default Paymentmodal;