'use client';

import "../../css/recommended.css";
import { IoIosArrowForward } from "react-icons/io";
import Image from 'next/image';
import { useRouter } from 'next/navigation';import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { API_USER_URL } from "@/app/utils/config";
import { setUpcomingMovies } from "@/app/store/features/upcomingMovie/upcoming-movie";
import { UpcomingMovie } from "../movie/upcomingMovieInterface";


const UpcomingMovieScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [upcomingMovies, setUpcomingMoviesdata] = useState<UpcomingMovie[]>([]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const selectedCity = Cookies.get("selected_city");
        if (selectedCity) {
          const cityData = JSON.parse(selectedCity);
          const cityID = cityData.id;
          const cache: Cache = await caches.open("movie-cache");
          const getUpcomongtMovies = await axios.get(`${API_USER_URL}/upcomingmovie/${cityID}`);
          setUpcomingMoviesdata(getUpcomongtMovies.data.data);
          dispatch(setUpcomingMovies(getUpcomongtMovies.data.data));
          const cacheKey = `/upcoming-movies/${cityID}`;
          const jsonBlob = new Blob([JSON.stringify(getUpcomongtMovies.data.data)], { type: 'application/json' });
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
    <div className="container-fluid p-0 mb-3 recommend_movie" style={{ backgroundColor: "#2C2B2B" }}>
      <div className="movie_wrapper mx-auto py-3">
        <div className="d-flex justify-content-between mb-2 first_movie_sec">
          <p className="title_font text-light my-3">Upcoming Movies</p>
          <p className="text_font d-flex align-items-center gap-1" style={{ cursor: "pointer" }} onClick={() =>
            router.push("/explore/seeall/upcoming-movie")}>
            See All <IoIosArrowForward />
          </p>
        </div>

        <div className="movie_scroll mb-3">
          {upcomingMovies.map((item) => (
            <div key={item._id} onClick={() => router.push(`/explore/movie/${item._id}`)} className="movie-card p-0">
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
            </div>
          ))}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default UpcomingMovieScreen;
