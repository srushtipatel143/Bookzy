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
import { API_USER_URL } from "@/app/utils/config";
import { LatestMovie } from "../movie/latestMovieInterface";
import { useDispatch } from "react-redux";
import { setLatestMovies } from "@/app/store/features/latestMovie/latest-movie";

const LatestMovieScreen = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const [latestMovies, setLatestMoviesdata] = useState<LatestMovie[]>([]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const selectedCity = Cookies.get("selected_city");
        if (selectedCity) {
          const cityData = JSON.parse(selectedCity);
          const cityID = cityData.id;
          const cache: Cache = await caches.open("movie-cache");
          const getLatestMovies = await axios.get(`${API_USER_URL}/getlatestmovie/${cityID}`);
          setLatestMoviesdata(getLatestMovies.data.data);
          dispatch(setLatestMovies(getLatestMovies.data.data));
          const cacheKey = `/latest-movies/${cityID}`;
          const jsonBlob = new Blob([JSON.stringify(getLatestMovies.data.data)], { type: 'application/json' });
          const responseToCache = new Response(jsonBlob);
          await cache.put(cacheKey, responseToCache);
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
    fetchDetails();
  }, []);

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="movie_wrapper mx-auto">
        <div className="d-flex justify-content-between mb-2 first_movie_sec">
          <p className="title_font text-dark my-3">Latest Movies</p>
          <p className="text_font d-flex align-items-center gap-1" style={{ cursor: "pointer" }} onClick={() => {
            router.push("/explore/seeall/latest-movie")
          }}>
            See All <IoIosArrowForward />
          </p>
        </div>

        <div className="movie_scroll mb-3">
          {latestMovies.map((item) => (
            <div key={item._id} className="movie-card p-0" onClick={() => router.push(`/explore/movie/${item._id}`)}>
              <div style={{ height: "350px" }}>
                <div className="latestMovie_wrapper">
                  <Image
                    src={item.imageURl}
                    alt="movie"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="latestMovie_image"
                  />
                </div>
              </div>
              <div className="rating_card p-2">
                <p className="m-0 d-flex align-items-center fs-5 gap-1">
                  <FaStar size={20} color="red" />
                  {item.ratingData ? `${item.ratingData.totalRating}/10 (${item.ratingData.votes} Votes)` : 'N / A'}
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

export default LatestMovieScreen;
