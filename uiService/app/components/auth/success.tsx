'use client';

import "../../css/userlogin.css";
import Link  from "next/link";
import Image from 'next/image';
const SuccessPage = () => {
  return (
    <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center bg_image">
      <div className="card p-4 text-center form_styling" style={{ width:"380px" }}>
        <div>
          <Image src="/success.svg" width={200} height={150} alt="web_logo" className="mb-3 success_img"/>
        </div>
        <div className="mt-2">
          <p className="success_font">Verification Successful</p>
        </div>
        <div className="mt-2">
          <Link className="button-primary" href="/">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
