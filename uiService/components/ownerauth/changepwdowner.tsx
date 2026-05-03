"use client";

import "@/styles/userlogin.css";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Image from "next/image";
import { API_OWNER_AUTH_URL } from "@/utils/config";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import axios from "axios";

const ChangePasswordOwner = () => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [oldpassword, setOldpassword] = useState("");

    const submitForm = async () => {
        try {
            const data = {
                oldpassword: oldpassword,
                password: password,
            };
            if (password !== cpassword) {
                return toast.error("Password do not match");
            }
            const response = await axios.put(`${API_OWNER_AUTH_URL}/changepassword`, data, { withCredentials: true });
            if (response.data.success) {
                router.push(`/owner/dashboard`);
            }
            else {
                return toast.error(response.data.message);
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
                <div className="my-3">
                    <input
                        onChange={(e) => setOldpassword(e.target.value)}
                        type="password"
                        className="form-control"
                        placeholder="Enter current password"
                    />
                </div>
                <div className="my-3">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                    />
                </div>
                <div className="my-3">
                    <input
                        onChange={(e) => setCpassword(e.target.value)}
                        type="password"
                        className="form-control"
                        placeholder="Confirm new password"
                    />
                </div>
                <div className="mt-5">
                    <button className="button-primary w-100" onClick={submitForm}>
                        Submit
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ChangePasswordOwner;
