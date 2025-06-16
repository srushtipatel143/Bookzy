"use client";

import "../../css/userlogin.css";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { API_ADMIN_AUTH_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../context/userContext";

const UserLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const { setSelectUser } = useUser();

  const submitForm = async () => {
    try {
      const data = {
        email: email,
        password: password,
      };
      if (password !== cpassword) {
        return toast.error("Password do not match");
      }
      const response = await axios.post(
        `${API_ADMIN_AUTH_URL}/adminlogin`,
        data
      );
      if (response.data.success) {
        const { imageURL, user, role } = response?.data;
        Cookies.set("logged_user", JSON.stringify({ imageURL, user, role }), {
          expires: 3650,
        });
        setSelectUser(response.data);
        router.push(`/admin/dashboard`);
      }
    } catch (error: any) {
      return toast.error(error.response.data.message);
    }
  };
  return (
    <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center bg_image">
      <div className="card p-4  form_styling" style={{ width: "350px" }}>
        <div
          className="position-absolute top-0 start-0 m-3"
          style={{ cursor: "pointer" }}
          onClick={() => router.back()}
        >
          <FiArrowLeft size={20} />
        </div>
        <div className="text-center">
          <Image
            src="/booking_logo.png"
            alt="web_logo"
            width={75}
            height={75}
            className="mb-3"
          />
        </div>
        <div className="mb-3 text-center">
          <p className="login_font">
            Please enter your email address for verification
          </p>
        </div>
        <div className="my-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            placeholder="Enter email address"
          />
        </div>
        <div className="my-3">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        <div className="my-3">
          <input
            onChange={(e) => setCpassword(e.target.value)}
            type="password"
            className="form-control"
            placeholder="Confirm password"
          />
        </div>
        <div
          className="d-flex ms-auto forgot_password_admin"
          onClick={() => router.push("/admin/forgotpasswordadmin")}
        >
          <span>Forgot password?</span>
        </div>
        <div className="mt-5">
          <button className="button-primary w-100" onClick={submitForm}>
            Sign in
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
