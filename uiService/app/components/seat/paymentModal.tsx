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

const Paymentmodal = () => {

    const [selectShow, setSelectshow] = useState<showDetails | undefined>(undefined);
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

    return (
        <div className="container-fluid p-0 position-relative" style={{ minHeight: "100vh" }}>

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

        </div>
    )
}

export default Paymentmodal;