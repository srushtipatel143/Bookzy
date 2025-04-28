'use client';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from "react-icons/fi";

const BackButton = () => {
    const router = useRouter();
    return (
        <div
            className="position-absolute p-2"
            style={{ cursor: "pointer" }}
            onClick={() => router.back()}
        >
            <FiArrowLeft size={20} color="white" />
        </div>
    )
};

export default BackButton;