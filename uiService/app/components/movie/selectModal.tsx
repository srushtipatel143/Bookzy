"use client";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

interface MovieScreenProps {
    movie: {
        _id: string;
        title: string;
        imageURl: string;
        duration: number;
        releaseDate: string;
        movieLanguage: { language: string; status: boolean; _id: string }[];
        movieType: { type: string; status: boolean; _id: string }[];
        cast: { actor: string; role: string; imageUrl: string; _id: string }[];
        about: string;
        ratingData: {
            totalRating: number;
            votes: number;
        };
        screenTypes: [];
    };
}

const SelectModal = ({ movie }: MovieScreenProps) => {
    const router = useRouter();
    const [selectFormat, setSelectFormat] = useState<boolean>(false);

    const handleButtonClick = () => {
        setSelectFormat(true);
    };

    return (
        <div>
            <button className="movie_book_btn" onClick={handleButtonClick}>
                Book tickets
            </button>
            <Modal centered show={selectFormat} onHide={() => setSelectFormat(false)}>
                <Modal.Header className="border-0" closeButton>
                    <span className="fw-lighter fs-5"> Select language and format</span>
                </Modal.Header>
                <Modal.Body className="p-0 mb-4">
                    <div>
                        {movie.movieLanguage.map((item) => (
                            <div key={item._id} >
                                <div className="my-2 py-2 px-4 select_language"> {item.language}</div>
                                <div className="px-4" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {movie.screenTypes.map((item, index) => (
                                        <div key={index} className={`select_screen_modal`} onClick={() => router.push("/explore/cinema")}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default SelectModal;
