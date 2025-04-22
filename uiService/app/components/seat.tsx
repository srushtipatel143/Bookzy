'use client';

import { useRouter } from 'next/navigation';
import { RiArrowLeftWideFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import "../css/seat.css";

const Seatscreen = () => {
    const router = useRouter();

    return (
        <div className="container-fluid p-0" style={{ minHeight: "100vh" }}>
            <div className="d-flex seat_top align-items-center justify-content-between px-3 pb-2">
                <div className="d-flex justify-content-center align-items-center">
                    <div style={{ cursor: "pointer" }} onClick={() => router.back()}> <RiArrowLeftWideFill size={40} /></div>
                    <div>
                        <span className="fs-5 fw-bold">Sikandar</span>
                        <br />
                        <span className="fs-6">PVR: Palladium Mall, Ahmedabad | Tuesday,Apr 8, 2025, 01:30 PM</span>
                    </div>
                </div>
                <div style={{ cursor: "pointer" }} onClick={() => router.back()}>
                    <RxCross2 size={18} />
                </div>
            </div>
            <div className="show_time_list p-3">
                {["1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM", "1:00 PM"].map((item, index) => (
                    <div className="seat_show_time" key={index}>{item}</div>
                ))}
            </div>
            <div className="hrLine1"></div>
            <div className="show_seat">
                <div className="seat_main_sec p-3">
                    {[
                        { category: "Platinum", rows: ["A", "B", "C"] },
                        { category: "Gold", rows: ["D", "E", "F"] },
                        { category: "Silver", rows: ["G", "H", "I", "J"] }
                    ].map((section, index) => (
                        <div key={index} className="seat_category">
                            <div className="seatCategory my-1">Rs. 399 {section.category}</div>
                            <div className="hrLineSeat my-1"></div>
                            {section.rows.map((row, rowIndex) => (
                                <div key={rowIndex} className="d-flex seat_row">
                                    <div className="row_label">{row}</div>
                                    <div className="d-flex row_seat">
                                        {Array.from({ length: 15 }).map((_, seatIndex) => (
                                            <div key={seatIndex} className="seat">
                                                {seatIndex + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Seatscreen;
