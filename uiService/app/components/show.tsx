'use client';
import "../css/show.css";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_USER_URL } from "../utils/config";
import Image from 'next/image';

interface cinema {
    id: number;
    cinemaName: string;
    cinemaLandmark: string;
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
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const cinemaId = localStorage.getItem("selected-cinema");
                const response = await axios.get(`${API_USER_URL}/getmoviesincinema/${cinemaId}`);
                setshowData(response?.data?.data);
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
                    <div className="mt-1 d-flex">
                        <Image src={"/location.svg"} alt="icons" width={30} height={30} />
                        <p className="show_detail_title_text">{showData?.cinemaName} , {showData?.cinemaLandmark}</p>
                    </div>
                </div>
                <div className="hrLine"></div>
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