'use client';

import "../css/show.css";
import "../css/cinema.css";
import { useRouter } from 'next/navigation';
import { CiHeart } from "react-icons/ci";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";
import {toast,ToastContainer} from "react-toastify";
import Cookies from "js-cookie";
import { API_USER_URL } from "../utils/config";

interface cinema{
    id:number,
    cinemaName:string,
    cinemaLandmark:string
}

const Cinemascreen = () => {
    const router = useRouter();
    const [cinema,setcinema]=useState<cinema[]>([]);
    useEffect(()=>{
        const fetchDetails=async()=>{
            try {
                const selectedCity=Cookies.get("selected_city");
                if (!selectedCity) {
                    toast.error("City is not selected");
                    return;
                }
                const cityData = JSON.parse(selectedCity);
                const getCinemaRes=await axios.get(`${API_USER_URL}/getAllCinemaByCity/${cityData.id}`);
                const cinemaDetails=getCinemaRes?.data?.data;
                setcinema(cinemaDetails);

            } catch (error:any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    },[])

    console.log(cinema)
    return (
        <div className="container-fluid p-0 show_detail">
            <div className="container-fluid p-0 mt-3 show_inner_detail">
                <div className="d-flex flex-column mt-1 show_detail_title show_detail_title_ext">
                    <div
                        className="position-absolute start-0 mt-2 px-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => router.back()} >
                        <FiArrowLeft size={20} color="black" />
                    </div>
                    <div className="mt-1">
                        <p className="show_detail_title_text">Sikandar - (Hindi)</p>
                    </div>
                    <div className="d-flex gap-2">
                        {["Action", "Drama"].map((item, index) => (
                            <div className="show_detail_type" key={index}><span>{item}</span></div>
                        ))}
                    </div>
                </div>
                <div className="hrLine"></div>
            </div>
            <div className="cinema_list mt-3" onClick={() => router.push("/explore/show")}>
                {cinema.map((item) => (
                    <div key={item.id} className="cinema_name">
                        <CiHeart size={20} />
                        <span className="cinema_text">{item.cinemaName} : {item.cinemaLandmark}</span>
                    </div>
                ))}
            </div>
            <ToastContainer/>
        </div>
    )
}

export default Cinemascreen;