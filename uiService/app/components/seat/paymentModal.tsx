import Cookies from 'js-cookie';
import "../../css/seat.css";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { API_USER_URL } from "../../utils/config";

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
    rowType: string;
    screenName: string;
}

interface PaymentModalProps {
    selectSeats: selectSeat[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Paymentmodal: React.FC<PaymentModalProps> = ({ selectSeats }) => {

    const [selectShow, setSelectshow] = useState<showDetails | undefined>(undefined);
    const router = useRouter();

    const rowTypeMap = new Map();

    selectSeats.forEach(({ rowType, seatName, price }) => {
        if (!rowTypeMap.has(rowType)) {
            rowTypeMap.set(rowType, {
                rowType,
                seats: []
            });
        }

        rowTypeMap.get(rowType).seats.push({ seatName, price });
    });

    const grouped = {
        cinemaId: selectSeats[0]?.cinemaId,
        movieId: selectSeats[0]?.movieId,
        screenId: selectSeats[0]?.screenId,
        screenName: selectSeats[0]?.screenName,
        showId: selectSeats[0]?.showId,
        ticket: Array.from(rowTypeMap.values())
    };

    const amount = selectSeats.reduce((acc: number, v: any) => acc + (v.price || 0), 0) + selectSeats.length * 1;

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

    const createOrder = async (val: any) => {
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
                handler: async function (response:any) {
                    const verifyRes = await axios.post(`${API_USER_URL}/verify`,response);

                    const verifyData = verifyRes.data;
                    alert(verifyData.message);
                },
                prefill: {
                    name: "Srushti Patel",
                    email: "srushtip579@gmail.com",
                    contact: "8200218798",
                },
                theme: {
                    color: "#d71921",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error: any) {
            toast.error(error.response.data.message)
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
                                {grouped.ticket.map((item, index) => (
                                    <div key={index} className='d-flex justify-content-between'>
                                        <div>
                                            {item.rowType} -{" "}
                                            {item.seats.map((v: any, i: number) => (
                                                <span key={v.seatName}>{v.seatName}{i < item.seats.length - 1 ? ", " : ""}</span>
                                            ))}{" "}
                                            ( {item.seats.length} {item.seats.length > 1 ? "Tickets" : "Ticket"} )
                                        </div>
                                        <div>
                                            Rs. {item.seats.reduce((acc: number, v: any) => acc + (v.price || 0), 0)}.00
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='booking_screen mt-1'>{grouped.screenName}</div>
                            <div className='booking_details_text mt-4'>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        Convenience fees
                                    </div>
                                    <div>
                                        Rs. {selectSeats.length * 20}.00
                                    </div>
                                </div>
                            </div>
                            <div className="hrLine3 mt-2"></div>
                            <div className='booking_details_text mt-2'>
                                <div className='d-flex justify-content-between'>
                                    <div>
                                        Sub total
                                    </div>
                                    <div>
                                        Rs. {amount}.00
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 amount_total_text'>
                            <div className='p-3 d-flex justify-content-between' >
                                <div>Amount Payable </div>
                                <div>Rs. {amount}.00</div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 amount_total_text_pay'>
                        <div className='py-2 px-4 d-flex justify-content-between' onClick={() => createOrder({ amount: amount })} >
                            <div>Total: Rs. {amount}.00</div>
                            <div>Proceed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Paymentmodal;