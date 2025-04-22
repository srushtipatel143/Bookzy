'use client'

import "../../css/userlogin.css";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const UserOtp = () => {
    const router=useRouter();
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
                    <Image src="/booking_logo.png" alt="web_logo" height={75} width={75} className="mb-3"/>
                </div>
                <div className="mb-3">
                    <p className="login_font">Please enter verification code</p>
                </div>
                <div className="my-3 d-flex justify-content-center align-items-center">
                    <input type="text" className="form-control mx-1" />
                    <input type="text" className="form-control mx-1" />
                    <input type="text" className="form-control mx-1" />
                    <input type="text" className="form-control mx-1" />
                    <input type="text" className="form-control mx-1" />
                    <input type="text" className="form-control mx-1" />
                </div>
                <div className="mt-3">
                    <button className="button-primary w-100" onClick={()=>router.push("/user/success")}>Verify</button>
                </div>
                <div className="mt-4">
                    <p className="login_font">Resend verification code in 45 seconds</p>
                </div>
            </div>
        </div>
    );
};

export default UserOtp;
