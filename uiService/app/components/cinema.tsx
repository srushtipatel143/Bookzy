'use client';

import "../css/show.css";
import "../css/cinema.css";
import { useRouter } from 'next/navigation';
import { CiHeart } from "react-icons/ci";
import { FiArrowLeft } from "react-icons/fi";

const Cinemascreen = () => {
    const router = useRouter()
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 19].map((item, index) => (
                    <div key={index} className="cinema_name">
                        <CiHeart size={20} />
                        <span className="cinema_text">PVR:Palladium Mall,Ahmedabad</span>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Cinemascreen;