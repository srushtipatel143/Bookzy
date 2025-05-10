'use client';

import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import "../../css/userlogin.css";
import RightBar from "./rightBar";
import Citymodal from "./citymodal";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useSearch } from "../context/searchContext";
import { useUser } from "../context/userContext";

const Navbar = () => {
  const { setShowSearch } = useSearch();
  const {selectUser,setSelectUser}=useUser();
  const [canvasshow, setCanvasShow] = useState(false);
  const [topCanvas, setTopCanvas] = useState(false)

  const [loggedUser, setLoggedUser] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const selectedCity = Cookies.get("selected_city");
    const user = Cookies.get("token");
    if (selectedCity) {
      const city = selectedCity ? JSON.parse(selectedCity) : null;
      setSelectedCity(city.city);
      if (user) {
         const userVal = user ? JSON.parse(user) : null;
         console.log(user)
        setSelectUser(userVal)
        setLoggedUser(true)
      }
      else {
        setLoggedUser(false)
      }
    }
    else {
      setTopCanvas(true)
    }
  }, [topCanvas]);
  return (
    <div className="container-fluid p-0 navbar_bg">
      <div className="navbar-wrapper mx-auto">
        <nav className="navbar px-2 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
              <Image src="/booking_logo.png" alt="web_logo" width={45} height={45} />
              <p
                className="m-0 fs-4 d-none d-md-block"
                style={{ lineHeight: "1", position: "relative", top: "-3px" }}
              >
                Bookzy
              </p>
            </div>

            <form className="form-inline d-none d-md-block">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <IoSearch size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 search-input"
                  placeholder="Search for Cinemas and Movies"
                  aria-label="Search"
                  onClick={() => {
                    setShowSearch(true)
                  }}
                  onKeyDown={() => setShowSearch(true)}
                  style={{ outline: "none", boxShadow: "none" }}
                />
              </div>
            </form>
          </div>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-1">
              <p className="m-0">{selectedCity}</p>
              <IoIosArrowDown style={{ cursor: "pointer" }} onClick={() => setTopCanvas(true)} size={18} />
            </div>
            <Citymodal topCanvas={topCanvas} setTopCanvas={setTopCanvas} />


            <div className="d-flex align-items-center gap-2">
              {loggedUser ? (
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={selectUser?.imageURL}
                    alt="user"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                    }}
                  />
                  <p className="m-0 d-none d-sm-block">Hi, Guest</p>
                </div>
              ) : (
                <button className="signin_btn" onClick={() => router.push("/user/userlogin")}>Sign in</button>
              )}

              <IoMenu size={32} style={{ cursor: "pointer" }} onClick={() => setCanvasShow(true)} />
              <RightBar canvasshow={canvasshow} setCanvasShow={setCanvasShow} />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
