import { Modal } from "react-bootstrap";
import Image from 'next/image';

const SeatNomodal = () => {

    return (
        <div>
            <Modal show={true} centered contentClassName="custom_modal">
                <Modal.Header className="border-0" >

                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div>How Many Seats?</div>
                        <div className="mt-4">
                            <Image
                                src="/scooter.webp"
                                alt="movie"
                                height={120}
                                width={120}
                                priority
                                
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SeatNomodal;