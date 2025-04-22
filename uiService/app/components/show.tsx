'use client';
import "../css/show.css";
import { useRouter } from 'next/navigation';
import { IoSearch } from "react-icons/io5";
import { FiArrowLeft } from "react-icons/fi";

const Showlist = () => {
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
                <div className="d-flex show_detail_title show_detail_title_ext">
                    <div className="show_detail_sec2 w-100">
                        <div className="d-flex show_Date_sec">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                                <div key={index} className="show_detail_date px-3 py-2 text-center flex-column">
                                    <div className="date-day">fri</div>
                                    <div className="date-date">04</div>
                                    <div className="date-month">apr</div>
                                </div>
                            ))}
                        </div>
                        <div className="show_filter_sec">
                            <div className="show_detail_ext ms-auto">Hindi-2D</div>
                            <div className="show_detail_ext">Price Range</div>
                            <div className="show_detail_ext"> <IoSearch size={18} /></div>
                        </div>
                    </div>
                </div>
                <div className="hrLine1"></div>
            </div>

            <div className="p-0 mt-3 show_detail_title show_data">
                <div className="d-flex flex-column">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                        <div key={index} className="show_movie_name">
                            <div className="d-flex m-2">
                                <div className="show_movie_name_left"><p className="fs-6">Sikandar</p></div>
                                <div className="show_movie_name_right">
                                    {["1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM"].map((item, index) => (
                                        <div className="show_movie_time" onClick={() => router.push("/seat")} key={index}>{item}</div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default Showlist;