'use client';

import "../../css/editprofile.css";
import Footer from "../homeScreen/footer";
import Image from 'next/image';

const EditProfile = () => {
    return (
        <div className="container-fluid edit_profile pt-3">
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
                                <div className="input_name">srushtip579@gamil.com</div>
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
                                <div className="lable_name">User Name</div>
                                <div className="input_name">
                                    <input placeholder="Enter user name here" type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">First Name</div>
                                <div className="input_name">
                                    <input placeholder="Enter first name here" type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">Last Name</div>
                                <div className="input_name">
                                    <input placeholder="Enter last name here" type="text" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="per_detail my-3">
                        <div className="per_detail2 px-5 py-2">
                            <div className="fs-4 edit_pro_header my-3">Address (Optional)</div>

                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">Pincode</div>
                                <div className="input_name">
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">Street</div>
                                <div className="input_name">
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">City</div>
                                <div className="input_name">
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">State</div>
                                <div className="input_name">
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex mb-3 py-2">
                                <div className="lable_name">Country</div>
                                <div className="input_name">
                                    <input type="text" className="form-control" />
                                </div>
                            </div>

                        </div>
                    </section>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default EditProfile;