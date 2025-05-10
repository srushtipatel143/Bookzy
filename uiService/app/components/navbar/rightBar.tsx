import { Offcanvas } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from "../context/userContext";

interface RightBarprops {
    canvasshow: boolean,
    setCanvasShow: (value: boolean) => void
}
const RightBar: React.FC<RightBarprops> = ({ canvasshow, setCanvasShow }) => {
    const router = useRouter();
    const { selectUser } = useUser();
    return (
        <Offcanvas
            show={canvasshow}
            onHide={() => setCanvasShow(false)}
            placement="end"
        >
            <div className="d-flex justify-content-between align-items-center px-3 py-2">
                <div>
                    <p className="fs-3 fw-bold m-0">Hey!</p>
                    {selectUser !== null && (
                        <span style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => {
                            setCanvasShow(false);
                            router.push("/user/editprofile")
                        }}>Edit Profile</span>
                    )}
                </div>
                {selectUser !== null && (
                    <div>
                        <Image src={selectUser?.imageURL} alt="user" height={40} width={40} style={{ borderRadius: "50%" }} />
                    </div>
                )}
            </div>
        </Offcanvas>
    )
}

export default RightBar;