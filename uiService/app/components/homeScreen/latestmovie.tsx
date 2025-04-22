'use client';

import "../../css/recommended.css";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import Image from 'next/image';

const LatestMovie = () => {
  return (
    <div className="container-fluid p-0" style={{ backgroundColor: "#2C2B2B" }}>
      <div className="movie_wrapper mx-auto">
        <div className="d-flex justify-content-between mb-2 first_movie_sec">
          <p className="title_font text-light my-3">Latest Movies</p>
          <p className="text_font d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
            See All <IoIosArrowForward />
          </p>
        </div>

        <div className="movie_scroll mb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div key={item} className="movie-card p-0">
              <div style={{ height: "350px" }}>
                <div className="latestMovie_wrapper">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrwFBFgTscQ8nz7a0Vi3BbA5OU0M4Wuu7itw&s"
                    alt="movie"
                    fill
                    className="latestMovie_image"
                  />
                </div>
              </div>
              <div className="rating_card p-2">
                <p className="m-0 d-flex align-items-center fs-5 gap-1">
                  <FaStar size={20} color="red" />
                  8/10 37.3K Votes
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestMovie;
