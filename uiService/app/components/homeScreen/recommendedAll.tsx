'use client';
import Carousel from "./carousal";
import Footer from "./footer";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "../../css/recommendedall.css";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const RecommendedAll = () => {
    const router = useRouter();
    const [showLanguages, setshowlanguages] = useState(false);
    const [showGenres, setShowGenres] = useState(false);
    const [showFormt, setShowFormat] = useState(false);
    return (
        <div className="container-fluid m=0 recommed_all">
            <Carousel />
            <div className=" d-flex mt-5 pb-3 main_movie gap-5">
                <div className="left_fliter">
                    <div className="fs-3 fw-bold">Filters</div>
                    <div className="language_filter p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="lan_filter_title" onClick={() => setshowlanguages(!showLanguages)}>{showLanguages ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span style={{ color: showLanguages ? "#d71921" : "inherit" }}>Languages</span></div>
                            <span>Clear</span>
                        </div>
                        {showLanguages && (
                            <div className="pt-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {["Hindi", "English", "Bangali", "Punjabi", "Telugu", "Bhojpuri", "Marathi"].map((item, index) => (
                                    <span key={index} className="lag_modal" >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="language_filter p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="lan_filter_title" onClick={() => setShowGenres(!showGenres)}>{showGenres ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span style={{ color: showGenres ? "#d71921" : "inherit" }}>Genres</span></div>
                            <span>Clear</span>
                        </div>
                        {showGenres && (
                            <div className="pt-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {["Drama", "Action", "Comedy", "War", "Romantic", "Mystery", "Mystery"].map((item, index) => (
                                    <span key={index} className="lag_modal" >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="language_filter p-3 mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="lan_filter_title" onClick={() => setShowFormat(!showFormt)}>{showFormt ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span style={{ color: showFormt ? "#d71921" : "inherit" }}>Format</span></div>
                            <span>Clear</span>
                        </div>
                        {showFormt && (
                            <div className="pt-3" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {["2D", "3D", "4DX", "IMAX 2D", "IMAX 3D"].map((item, index) => (
                                    <span key={index} className="lag_modal" >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="see_browse">Browse by Cinemas</div>
                </div>
                <div className="right_movie">
                    <div className="fs-3 fw-bold mb-3">Movies in Ahmedabad</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {["Hindi", "English", "Bangali", "Punjabi", "Telugu", "Bhojpuri", "Marathi"].map((item, index) => (
                            <span key={index} className="lag_modal_right" >
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between coming_sec my-3 p-3">
                        <span className="fs-4 fw-bold">Coming Soon</span>
                        <span className="d-flex justify-content-center align-items-center gap-2">Explore Upcoming Movies<IoIosArrowForward /></span>
                    </div>
                    <div className="see_scroll">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item) => (
                            <div key={item} className="see-card p-0" onClick={() => router.push("/explore/movie")}>
                                <div style={{ height: "400px" }} className="mb-3">
                                    {/* <img
                                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrwFBFgTscQ8nz7a0Vi3BbA5OU0M4Wuu7itw&s`}
                                        style={{
                                            width: "100%",
                                            height: "80%",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                        alt="movie"
                                    /> */}

                                    <div className="recommendedAllMovie_wrapper">
                                        <Image
                                            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrwFBFgTscQ8nz7a0Vi3BbA5OU0M4Wuu7itw&s`}
                                            alt="movie"
                                            fill
                                            className="recommendedAllMovie_image"
                                        />
                                    </div>
                                    <p className="fs-5 p-0 mt-3 fw-bold">Sikandar</p>
                                    <span>Action,Drama</span>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RecommendedAll;
