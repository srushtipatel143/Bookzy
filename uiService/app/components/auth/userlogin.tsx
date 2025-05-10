'use client';

import "../../css/userlogin.css";
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from "react-icons/fi";
import Image from 'next/image';
import { API_AUTH_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import axios from "axios";

const UserLogin = () => {
  const router = useRouter();
  const [email,setEmail]=useState('');

  const submitForm=async()=>{
    try {
      const data={
        email:email
      }
      const response=await axios.post(`${API_AUTH_URL}/signin`,data);
      console.log(response.data)
      if(response.data.success){
        const id=response?.data?.data?._id;
        router.push(`/user/userotp/${id}`)
      }
    } catch (error:any) {
      toast.error(error.response.data.message)
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
        <div>
          <Image src="/booking_logo.png" alt="web_logo" width={75} height={75} className="mb-3"/>
        </div>
        <div className="mb-3">
          <p className="login_font">Please enter your email address for verification</p>
        </div>
        <div className="my-3">
          <input onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" placeholder="Enter email address" />
        </div>
        <div className="mt-5">
          <button className="button-primary w-100" onClick={submitForm}>Send Verification Code</button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default UserLogin;
