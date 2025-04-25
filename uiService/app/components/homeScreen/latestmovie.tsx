'use client';

import "../../css/recommended.css";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API_USER_URL } from "../../utils/config";

interface MovieDetails {
  imageURl: string;
}

interface latestMovie{
  _id:string
  movieDetail:MovieDetails
}

const LatestMovie = () => {
  const router = useRouter();
  const [latestMovies,setLatestMovies]=useState<latestMovie[]>([]);
  useEffect(() => {
    const fetchDetails =async() => {
      try {
        const selectedCity = Cookies.get("selected_city");
        if (selectedCity) {
          const cityData = JSON.parse(selectedCity);
          const cityID=cityData.id;
          const getLatestMovies = await axios.get(`${API_USER_URL}/getlatestmovie/${cityID}`);
          setLatestMovies(getLatestMovies.data.data)
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
    fetchDetails();
  }, []);

  console.log(latestMovies)

  return (
    <div className="container-fluid p-0">
      <div className="movie_wrapper mx-auto">
        <div className="d-flex justify-content-between mb-2 first_movie_sec">
          <p className="title_font text-dark my-3">Latest Movies</p>
          <p className="text_font d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
            See All <IoIosArrowForward />
          </p>
        </div>

        <div className="movie_scroll mb-3">
          {latestMovies.map((item) => (
            <div key={item._id} className="movie-card p-0" onClick={() => router.push("/explore/movie")}>
              <div style={{ height: "350px" }}>
                <div className="latestMovie_wrapper">
                  <Image
                    src={item.movieDetail.imageURl}
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
      <ToastContainer />
    </div>
  );
};

export default LatestMovie;
