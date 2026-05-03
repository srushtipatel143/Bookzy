import { Modal } from "react-bootstrap";
import Image from 'next/image';
import "@/styles/seat.css";

interface selectNoOfSeatProps {
    selectNoOfSeat: number,
    setSelectNoOfSeat: (value: number) => void,
    selectNoOfSeatModal: boolean,
    setSelectNoOfSeatModal: (value: boolean) => void,
    priceInfoForShow: {
        rowType: string;
        price: number;
        _id: string;
    }[];
}

const SeatNomodal: React.FC<selectNoOfSeatProps> = ({ selectNoOfSeat, setSelectNoOfSeat, selectNoOfSeatModal, setSelectNoOfSeatModal, priceInfoForShow }) => {

    return (
        <div>
            <Modal show={selectNoOfSeatModal} centered contentClassName="custom_modal">
                <Modal.Header className="border-0" >

                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div>How Many Seats?</div>
                        <div className="mt-4">
                            <Image
                                src="/scooter.avif"
                                alt="movie"
                                height={100}
                                width={100}
                                priority
                            />
                        </div>
                        <div className="mt-4 d-flex gap-3 ">
                            {[1, 2, 3, 4, 5].map((item, index) => (
                                <div key={index} className={`cursor-pointer ${selectNoOfSeat-1 === index ? 'seat_select_count' : 'noseat_select_count'}`} onClick={() => setSelectNoOfSeat(index+1)}>{item}</div>
                            ))}
                        </div>
                        <div className="hrLine2"></div>
                        <div className="d-flex gap-4 mt-4">
                            {priceInfoForShow.map((item) => (
                                <div className="d-flex flex-column justify-content-center align-items-center" key={item._id}>
                                    <div style={{ color: "grey", fontSize: "14px" }}>{item.rowType}</div>
                                    <div style={{ fontWeight: "600", fontSize: "14px" }}>Rs.{item.price}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4" style={{width:"100%"}}>
                            <button onClick={()=>{
                               setSelectNoOfSeatModal(false)
                            }} className="select_seat_btn">Select Seats</button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SeatNomodal;