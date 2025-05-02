"use client";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import { useState } from "react";

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
        availableScreen:{
            language:string;
            screenType:[];
        } [];
    };
}

const SelectModal = ({ movie }: MovieScreenProps) => {
    const router = useRouter();
    const [selectFormat, setSelectFormat] = useState<boolean>(false);

    const handleButtonClick = () => {
        setSelectFormat(true);
    };

    const selectValue = (data:any) => {

        const value = {
            movieId: movie._id,
            movieName: movie.title,
            type: movie.movieType,
            selectLanguage:data.language,
            selectScreen:data.screenType
        }
        localStorage.setItem("select-movie",JSON.stringify(value));
        router.push("/explore/cinema")
    }

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
                        {movie.availableScreen.map((item) => (
                            <div key={item.language} >
                                <div className="my-2 py-2 px-4 select_language"> {item.language}</div>
                                <div className="px-4" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    {item.screenType.map((val, index) => (
                                        <div key={index} className={`select_screen_modal`} onClick={() => selectValue({ language: item.language, screenType: val })}>
                                            {val}
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
