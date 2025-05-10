'use client'

import "../../css/userlogin.css";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { API_AUTH_URL } from "../../utils/config";
import axios from "axios";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

const UserOtp = () => {
    const router = useRouter();
    const params = useParams();
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const slug = params.slug;

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];

        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: any, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    };

    const verifyCode = async (val: string) => {
        try {
            const data = {
                userId: slug,
                otp: val
            }

            const response = await axios.post(`${API_AUTH_URL}/validateotp`, data);
            if (response.data.success) {
                const {token,imageURL} = response?.data;
                Cookies.set("token", JSON.stringify({token,imageURL}), { expires: 3650 });
                router.push("/user/success")
            }

        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center bg_image">
            <div className="card p-4 text-center form_styling" style={{ width: "350px" }}>
                <div
                    className="position-absolute top-0 start-0 m-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.back()} >
                    <FiArrowLeft size={20} />
                </div>
                <div >
                    <Image src="/booking_logo.png" alt="web_logo" height={75} width={75} className="mb-3" />
                </div>
                <div className="mb-3">
                    <p className="login_font">Please enter verification code</p>
                </div>
                <div className="my-3 d-flex justify-content-center align-items-center">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            className="form-control mx-1 text-center"
                            maxLength={1}
                            value={digit}
                            ref={(el) => { inputRef.current[index] = el }}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <div className="mt-3">
                    <button className="button-primary w-100" onClick={() => {
                        // console.log(otp)
                        const val = otp.join('');
                        if (val !== '' && val.length === 6) {
                            verifyCode(val);
                        }
                    }}>Verify</button>
                </div>
                <div className="mt-4">
                    <p className="resendOtp_font">Resend verification code</p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UserOtp;
