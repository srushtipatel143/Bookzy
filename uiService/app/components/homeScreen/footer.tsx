'use client';

import "../../css/footer.css";
import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import Image from 'next/image';

const Footer = () => {
    return (
        <div className="container-fluid p-0">
            <div className="footer_part d-flex justify-content-center flex-column py-3">
                <div className="container d-flex flex-column mt-3">
                    <div>
                        <div className="mb-3 movie_links_tag">MOVIES NOW SHOWING IN AHMEDABAD</div>
                        <div className="d-flex mb-3">
                            {["Sikandar", "Don", "Main Tera Hero", "Padmavat"].map((item, index) => (
                                <div key={index}>
                                    {index > 0 && <span className="movie_sep px-1">|</span>}
                                    <span className="movie_link">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 movie_links_tag">UPCOMING MOVIES IN AHMEDABAD</div>
                        <div className="d-flex mb-3">
                            {["Sikandar", "Don", "Main Tera Hero", "Padmavat"].map((item, index) => (
                                <div key={index}>
                                    {index > 0 && <span className="movie_sep px-1">|</span>}
                                    <span className="movie_link">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 movie_links_tag">MOVIES BY GENRE</div>
                        <div className="d-flex mb-3">
                            {["Action", "Drama", "Romantic", "Horror"].map((item, index) => (
                                <div key={index}>
                                    {index > 0 && <span className="movie_sep px-1">|</span>}
                                    <span className="movie_link">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mb-3 movie_links_tag">MOVIES BY LANGUAGE</div>
                        <div className="d-flex mb-3">
                            {["Hindi", "English", "Gujrati", "Punjabi"].map((item, index) => (
                                <div key={index}>
                                    {index > 0 && <span className="movie_sep px-1">|</span>}
                                    <span className="movie_link">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <div className="ar_line"></div>
                    <div className="d-flex justify-content-center align-items-center gap-1">
                        <Image src="/booking_logo.png" alt="web_logo" height={60} width={60} />
                        <p className="m-0 fs-4 d-none d-sm-block" style={{ lineHeight: "1", position: "relative", top: "-3px", color: "#FFFFFF" }}>
                            Bookzy
                        </p>
                    </div>
                    <div className="ar_line"></div>
                </div>
                <div className="d-flex justify-content-center py-5 footer_content">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus id amet voluptatem, porro aut dicta rem fuga laboriosam atque  vel aperiam voluptate, assumenda hic consequatur nesciunt eaque veniam, cum sequi odio repellat provident quae obcaecati ipsum pariatur illo beatae non excepturi ullam i, dolor aliquam ut deserunt et saepe nesciunt ipsa similique ducimus, blanditiis architecto dolores recusandae, ex rem quos repudiandae consectetur doloremque accusantium voluptatibus eaque. Nihil laudantium delectus eveniet cum porro? Inventore beatae ut eos!</p>
                </div>
                <div className="d-flex justify-content-center pt-3">
                    <FaInstagramSquare className="icon-style" />
                    <FaWhatsappSquare className="icon-style" />
                    <FaSquareXTwitter className="icon-style" />
                    <FaFacebookSquare className="icon-style" />
                    <FaLinkedin className="icon-style" />
                </div>
                <div className="d-flex justify-content-center pt-5 footer_content">
                    <p>Copyright 2025 © Srushti. All rights reserved</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;