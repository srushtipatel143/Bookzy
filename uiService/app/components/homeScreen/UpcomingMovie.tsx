'use client';

import "../../css/recommended.css";
import { IoIosArrowForward } from "react-icons/io";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UpcomingMovie = () => {
  const router = useRouter();
  return (
    <div className="container-fluid p-0 recommend_movie" >
      <div className="movie_wrapper mx-auto py-3">
        <div className="d-flex justify-content-between mb-2 first_movie_sec">
          <p className="title_font my-3">Upcoming Movies</p>
          <p className="text_font d-flex align-items-center gap-1" style={{ cursor: "pointer" }} onClick={() =>
            router.push("/explore/seeall/upcoming-movie")}>
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="latestMovie_image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingMovie;
