'use client';
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import "@/styles/userlogin.css";
import RightBar from "./rightBar";
import Image from 'next/image';
import Cookies from "js-cookie";
import { useUser } from "@/components/context/userContext";

const OwnerNavbar = () => {
  const { selectUser, setSelectUser } = useUser();
  const [canvasshow, setCanvasShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = Cookies.get("logged_user");
    if (user) {
      const userVal = user ? JSON.parse(user) : null;
      setSelectUser(userVal)
    }
    else {
      setSelectUser(null)
    }
  }, []);
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
          </div>
          <div className="d-flex align-items-center gap-4">

            <div className="d-flex align-items-center gap-2">
              {selectUser !== null ? (
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
                  <p className="m-0 d-none d-sm-block">Hi,{selectUser?.user
                    ? (selectUser.user.length > 7
                      ? `${selectUser.user.substring(0, 7)}...`
                      : selectUser.user)
                    : 'Guest'}</p>
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

export default OwnerNavbar;
