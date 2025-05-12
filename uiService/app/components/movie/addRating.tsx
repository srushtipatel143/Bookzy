'use client';
import { Modal } from "react-bootstrap";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { API_USER_URL } from "../../utils/config";
import axios from "axios";
import { useRouter } from 'next/navigation';

interface MovieScreenProps {
    movie: {
        _id: string;
        title: string;
    };
}

const AddRating = ({ movie }: MovieScreenProps) => {
    const [rateModal, setRateModal] = useState(false)
    const [rating, setRating] = useState<number>(0);
    const router=useRouter();
    const user = Cookies.get("token");
    const handleSubmitRating = async () => {
        try {
            const data = {
                movieId: movie._id,
                ratings: rating
            }
            if (user) {
                if (rating>0) {
                    const userVal = user ? JSON.parse(user) : null;
                    const val = userVal?.token;
                    const response = await axios.post(`${API_USER_URL}/addrating`, data, {
                        headers: {
                            Authorization: `Bearer ${val}`
                        }
                    });
                    if (response?.data?.success) {
                        setRateModal(false);
                        setRating(0);
                        toast.success(response.data.message)
                    }
                }
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    };

    return (
        <div className="ms-auto">
            <ToastContainer />
            <button className="movie_rate_btn" onClick={() =>{
                if(!user){
                    router.push("/user/userlogin")
                }
                else{
                    setRateModal(true);
                }
            }}>Rate Now</button>
            <Modal backdrop={false} centered show={rateModal} onHide={() => {
                setRateModal(false)
                setRating(0);
            }}>
                <Modal.Header className="px-3 py-2 border-0 justify-content-center btn__close shadow-sm" closeButton>
                    <div className="text-center w-100">
                        <div className="fw-bold mb-1">How was the movie?</div>
                        <div className="fw-lighter">{movie.title}</div>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-0 m-3">
                    <div className="p-1 text-center">
                        <p>How would you rate the movie?</p>
                        <input
                            type="range"
                            min={0}
                            max={10}
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="form-range custom-range"
                            style={{ '--fill-percent': `${(rating / 10) * 100}%` } as React.CSSProperties} />
                        <div className="mt-2 fw-bold" >Rating : {rating}/10</div>
                        <button className={`${rating !== 0 ? "submit_rating" : "no_submit_rating"} mt-3`}
                            onClick={handleSubmitRating}>
                            Submit Rating
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default AddRating;