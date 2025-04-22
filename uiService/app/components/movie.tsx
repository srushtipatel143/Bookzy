'use client';

import "../css/movie.css";
import { FaStar } from "react-icons/fa";
import Footer from "./homeScreen/footer";
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from "react-icons/fi";
import Image from 'next/image';

const Moviescreen = () => {
    const router = useRouter();
    return (
        <div className="container-fluid mt-3 p-0 ">
            <div className="d-flex movie_detail">
                <div
                    className="position-absolute p-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.back()} >
                    <FiArrowLeft size={20} color="white"/>
                </div>
                <div className="d-flex align-items-center ">
                    <div className="movie_left my-5 ms-5 me-3">
                    </div>
                    <div className="movie_right mx-3">
                        <p className="display-6">Sikandar</p>
                        <div className="d-flex movie_rate_section">
                            <p className="m-0 d-flex align-items-center fs-5 gap-1">
                                <FaStar size={20} color="red" />
                                8/10 (37.3K votes)
                            </p>
                            <button className="movie_rate_btn">Rate Now</button>
                        </div>
                        <div className="movie_type_lan">
                            <div className="movie_type_sec">2D,3D,4D</div>
                            <div className="movie_lan_sec">Hindi,English</div>
                        </div>
                        <div className="d-flex">
                            <p>2h 13m</p>
                            <ul>
                                <li>Action,Drama</li>
                                <li>30 Mar,2025</li>
                            </ul>
                        </div>
                        <div>
                            <button className="movie_book_btn" onClick={() => router.push("/explore/cinema")}>Book tickets</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about_movie py-4 recommend_movie">
                <p className="about_movie_title">About The Movie</p>
                <p>
                    Sikandar follows the journey of a man who overcomes all hurdles that life throws his way just so that he can alleviate the plight of the less fortunate and those in need of his help. His transition from a nonchalant man to a selfless man, inspired by his wife, makes him emerge as a beacon of hope for those ensnared in darkness.
                </p>
            </div>
            <div className="about_movie py-4 recommend_movie">
                <p className="about_movie_title">Cast</p>

                <div className="cast_scroll mt-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                        <div key={item} className="cast-card p-0">
                            <Image height={120} width={120}  src="https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg"   alt="cast_image" className="cast_img" />
                            <p>Jannelia D'suza</p>
                            <p>Actor</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Moviescreen;