'use client';

import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import "@/styles/userlogin.css";
import RightBar from "./rightBar";
import Citymodal from "./citymodal";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useSearch } from "@/components/context/searchContext";
import { useUser } from "@/components/context/userContext";

const Navbar = () => {
  const { setShowSearch } = useSearch();
  const { selectUser, setSelectUser } = useUser();
  const [canvasshow, setCanvasShow] = useState(false);
  const [topCanvas, setTopCanvas] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const selectedCity = Cookies.get("selected_city");
    const user = Cookies.get("logged_user");

    if (selectedCity) {
      const city = JSON.parse(selectedCity);
      setSelectedCity(city.city);

      if (user) {
        setSelectUser(JSON.parse(user));
      } else {
        setSelectUser(null);
      }
    } else {
      setTopCanvas(true);
    }
  }, [topCanvas]);

  return (
    <div className="container-fluid p-0 navbar_bg">
      <div className="navbar-wrapper mx-auto">

        <nav className="navbar navbar-expand-lg px-2 py-2">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <div
              className="d-flex align-items-center gap-1"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/")}
            >
              <Image src="/booking_logo.png" alt="logo" width={40} height={40} />
              <p className="m-0 fs-5 d-none d-md-block">Bookzy</p>
            </div>
            <div className="d-none d-md-flex align-items-center flex-grow-1">
              <div className="input-group w-75">

                <span className="input-group-text bg-white border-end-0">
                  <IoSearch size={14} />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search movies & cinemas"
                  onClick={() => setShowSearch(true)}
                  onKeyDown={() => setShowSearch(true)}
                />
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <IoSearch className="d-md-none" size={22} style={{ cursor: "pointer" }} onClick={() => setShowSearch(true)} />
            <div className="d-flex align-items-center gap-1">
              <span className="small">{selectedCity}</span>
              <IoIosArrowDown size={16} style={{ cursor: "pointer" }} onClick={() => setTopCanvas(true)} />
            </div>

            <Citymodal topCanvas={topCanvas} setTopCanvas={setTopCanvas} />
            {selectUser ? (
              <div className="d-flex align-items-center gap-2">
                <img src={selectUser?.imageURL} alt="user" className="user_img" />
                <span className="d-none d-sm-block small">Hi, {selectUser.user?.slice(0, 7)}</span>
              </div>
            ) : (
              <button className="signin_btn" onClick={() => router.push("/user/userlogin")}>
                Sign in
              </button>
            )}
            <IoMenu size={28} style={{ cursor: "pointer" }} onClick={() => setCanvasShow(true)} />
            <RightBar canvasshow={canvasshow} setCanvasShow={setCanvasShow} />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

