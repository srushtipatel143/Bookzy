'use client';

import { useEffect, useState } from "react";
import "../../css/editprofile.css";
import Footer from "../homeScreen/footer";
import Image from 'next/image';
import { API_AUTH_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useUser } from "../context/userContext";

interface Address {
    country: string;
    state: string;
    city: string;
    street: string;
    pincode: number | string;
}

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: number;
    mobile: number;
    imageURL: string;
    address: Address;
}

const EditProfile = () => {
    const [formData, setFormData] = useState<any>(null);

    const { setSelectUser } = useUser();
    const user = Cookies.get("token");
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (user) {
                    const userVal = user ? JSON.parse(user) : null;
                    const val = userVal?.token;
                    const response = await axios.get(`${API_AUTH_URL}/getuser`, {
                        headers: {
                            Authorization: `Bearer ${val}`
                        }
                    });
                    const userDetails = response?.data?.data;
                    setFormData({
                        ...userDetails,
                        ...userDetails?.address
                    });
                }
            } catch (error: any) {
                toast.error(error.response.data.message)
            }
        }
        fetchDetails();
    }, []);

    const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const profileEdit = async () => {

        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: {
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    street: formData.street,
                    pincode: formData.pincode,
                }
            };
            if (user) {
                const userVal = user ? JSON.parse(user) : null;
                const val = userVal?.token;
                const respose = await axios.put(`${API_AUTH_URL}/editprofile`, payload, {
                    headers: {
                        Authorization: `Bearer ${val}`
                    }
                });
                if (respose?.data?.success) {
                    setSelectUser((prev:any) => ({
                        ...prev,
                        user: payload?.firstName
                    }));
                    Cookies.set("token", JSON.stringify({ ...userVal, user: payload?.firstName }), { expires: 3650 });
                }
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }


    return (
        <div className="container-fluid edit_profile pt-3">
            <ToastContainer />
            <div className="edit_detail">
                <form>
                    <section className="acc_detail my-3">
                        <div className="acc_detail1 px-3">
                            <div className="edit_image position-relative ">
                                <Image
                                    src="/user.png"
                                    alt="user"
                                    height={75}
                                    width={75}
                                />
                            </div>
                        </div>
                        <div className="acc_detail2 px-5 py-2">
                            <div className="fs-4 edit_pro_header my-3">Account Details</div>
                            <div className="d-flex py-3">
                                <div className="lable_name">Email Address</div>
                                <div className="input_name">{formData?.email}</div>
                            </div>
                            <div className="d-flex align-items-center mb-3 py-3">
                                <div className="lable_name">Mobile Number</div>
                                <div className="input_name">
                                    <input type="text" placeholder="+Add Mobile Number" className="form-control phone_number" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="per_detail my-3">
                        <div className="per_detail2 px-5 py-2">
                            <div className="fs-4 edit_pro_header my-3">Personal Details</div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">First Name</div>
                                <div className="input_name">
                                    <input onChange={handlechange} name="firstName" value={formData?.firstName || ''} placeholder="Enter first name here" type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">Last Name</div>
                                <div className="input_name">
                                    <input onChange={handlechange} name="lastName" value={formData?.lastName || ''} placeholder="Enter last name here" type="text" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="per_detail my-3">
                        <div className="per_detail2 px-5 py-2">
                            <div className="fs-4 edit_pro_header my-3">Address (Optional)</div>
                            {formData && ["pincode", "street", "city", "state", "country"].map((field) => (
                                <div key={field} className="d-flex mb-3 py-2">
                                    <div className="lable_name">{field.charAt(0).toUpperCase() + field.slice(1)}</div>
                                    <div className="input_name">
                                        <input
                                            onChange={handlechange}
                                            name={field}
                                            value={formData[field] || ""}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <button className="my-3 edit_profile_btn" onClick={(e) => {
                        e.preventDefault();
                        profileEdit()
                    }}>Save Changes</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default EditProfile;