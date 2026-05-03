import { Offcanvas } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from "@/components/context/userContext";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ADMIN_AUTH_URL } from "@/utils/config";
import { MdDashboardCustomize } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { BiSolidMoviePlay } from "react-icons/bi";


interface RightBarprops {
    canvasshow: boolean,
    setCanvasShow: (value: boolean) => void
}
const RightBar: React.FC<RightBarprops> = ({ canvasshow, setCanvasShow }) => {
    const router = useRouter();
    const { selectUser, setSelectUser } = useUser();
    const signout = async () => {
        try {
            await axios.get(`${API_ADMIN_AUTH_URL}/logout`, {
                withCredentials: true
            })
            Cookies.remove("logged_user");
            router.push(("/"))
            setSelectUser(null);
            setCanvasShow(false)
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <Offcanvas
            show={canvasshow}
            onHide={() => setCanvasShow(false)}
            placement="end"
        >
            <div className="d-flex justify-content-between align-items-center px-4 py-2">
                <div>
                    <p className="fs-3 fw-bold m-0">Hey!</p>
                    {selectUser !== null && (
                        <span style={{ fontSize: "14px", cursor: "pointer" }} onClick={() => {
                            setCanvasShow(false);
                            router.push("/admin/editprofile")
                        }}>Edit Profile</span>
                    )}
                </div>
                {selectUser !== null && (
                    <div>
                        <Image src={selectUser?.imageURL} alt="user" height={40} width={40} style={{ borderRadius: "50%" }} />
                    </div>
                )}
            </div>
            {selectUser !== null && (
                <div className="d-flex flex-column px-3 py-2 gap-2">

                    <div onClick={() => {
                        router.push("/admin/dashboard")
                        setCanvasShow(false)
                    }} className="side_menu_admin px-2 gap-3"><MdDashboardCustomize size={24} />Dashboard</div>

                    <div onClick={() => {
                        router.push("/admin/access")
                        setCanvasShow(false)
                    }} className="side_menu_admin px-2 gap-3" ><FaUserFriends size={24} />Access Management</div>

                    <div onClick={() => {
                        router.push("/admin/city")
                        setCanvasShow(false)
                    }} className="side_menu_admin px-2 gap-3"><FaCity size={24} />City Management</div>

                    <div onClick={() => {
                        router.push("/admin/movie")
                        setCanvasShow(false)
                    }} className="side_menu_admin px-2 gap-3"><BiSolidMoviePlay size={24} />Movie Mangement</div>

                    <div onClick={() => {
                        router.push("/admin/adminpasswordchange")
                        setCanvasShow(false)
                    }} className="side_menu_admin px-2 gap-3"> <RiLockPasswordFill size={24} />Change Password</div>

                </div>
            )}
            {selectUser !== null && (
                <div className="">
                    <button className="sign_outBtn py-1" onClick={signout}>
                        Sign out
                    </button>
                </div>
            )}
        </Offcanvas>
    )
}

export default RightBar;