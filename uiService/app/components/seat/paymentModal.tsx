import Cookies from 'js-cookie';
import "../../css/seat.css";
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";


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

const Paymentmodal: React.FC<PaymentModalProps> = ({ selectSeats }) => {

    const [selectShow, setSelectshow] = useState<showDetails | undefined>(undefined);
    const router = useRouter();

    const rowTypeMap = new Map();

    selectSeats.forEach(({rowType, seatName, price }) => {
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


    console.log(grouped)

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
                    <div className='payment_sec_heading'>BOOKING SUMMARY</div>
                </div>
            </div>
        </div>

    )
}

export default Paymentmodal;