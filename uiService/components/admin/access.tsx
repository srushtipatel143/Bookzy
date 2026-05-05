"use client";
import "@/styles/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_ADMIN_AUTH_URL, API_OWNER_AUTH_URL } from "@/utils/config";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { CgClose } from "react-icons/cg";
import Select from 'react-select';
import Cookies from "js-cookie";
import { MdDelete } from "react-icons/md";

interface UserData {
    _id: string,
    userName: string,
    email: string,
    countryCode: string,
    role: string,
    mobile: string
}

interface userDataObject {
    _id?: string;
    userName?: string;
    email?: string;
    countryCode?: string;
    role?: string,
    mobile?: string
}

const AdminAccess = () => {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [userAddFormShow, setUserAddFormShow] = useState<boolean>(false);
    const [userDataObj, setUserDataObj] = useState<userDataObject>({});
    const [logUserRole, setLogUserRole] = useState('');
    const user = Cookies.get("logged_user");
    const [disable, setDisable] = useState<boolean>(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (user) {
                    const userVal = user ? JSON.parse(user) : null;
                    setLogUserRole(userVal?.role);

                    let getuserdata;

                    if (userVal?.role === 'masteradmin') {
                        getuserdata = await axios.get(`${API_ADMIN_AUTH_URL}/getalladmin`, {
                            withCredentials: true
                        });
                    }
                    else {
                        getuserdata = await axios.get(`${API_OWNER_AUTH_URL}/getallowner`, {
                            withCredentials: true
                        });
                    }
                    setUserData(getuserdata?.data?.data)
                }
            } catch (error: any) {
                return toast.error(error?.response?.data?.message);
            }
        }
        fetchDetails()
    }, []);

    const submitForm = async () => {
        try {
            if (userDataObj?._id) {
                let editUserRes;
                if (userDataObj.role === 'admin') {
                    editUserRes = await axios.put(`${API_ADMIN_AUTH_URL}/editadmin`, userDataObj, {
                        withCredentials: true
                    });
                }
                else {
                    editUserRes = await axios.put(`${API_OWNER_AUTH_URL}/editowner`, userDataObj, {
                        withCredentials: true
                    });
                }
                const data = editUserRes?.data?.data;
                setUserData((prevUser) =>
                    prevUser.map((item) =>
                        item._id === userDataObj._id ? { ...item, ...data } : item
                    )
                );
                setUserAddFormShow(false)
                setUserDataObj({});
                setDisable(false);
                return toast.success(`${userDataObj.role === 'admin' ? 'Admin' : 'Owner'} update successfully`);
            }
            else {
                let createUserRes;
                if (userDataObj.role === 'admin') {
                    createUserRes = await axios.post(`${API_ADMIN_AUTH_URL}/createadmin`, userDataObj, {
                        withCredentials: true
                    });
                }
                else {
                    createUserRes = await axios.post(`${API_OWNER_AUTH_URL}/createowner`, userDataObj, {
                        withCredentials: true
                    });
                }
                const data = createUserRes?.data?.data;
                setUserData((prevUser) => [...prevUser, data]);
                setUserAddFormShow(false)
                setUserDataObj({})
                return toast.success(`${userDataObj.role === 'admin' ? 'Admin' : 'Owner'} add successfully`);
            }
        } catch (error: any) {
            return toast.error(error.response.data.message);
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setUserDataObj((prev) => ({
            ...(prev || {}),
            [name]: value
        }))
    }

    const roleOptions = [
        ...(logUserRole === 'masteradmin' ? [{ value: 'admin', label: 'admin' }] : []),
        { value: 'owner', label: 'owner' }
    ];

    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Access Management</div>
                <div>
                    <button className="admin_city_add" onClick={() => setUserAddFormShow(true)}>Add User</button>
                </div>
            </div>

            <DataTable value={userData} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(rowData, options) => options.rowIndex + 1}></Column>
                <Column field="userName" header="User Name" sortable></Column>
                <Column field="email" header="Email" sortable></Column>
                <Column field="role" header="Role" sortable></Column>
                <Column header="Mobile no." body={(rowData) => '+' + rowData.countryCode + '  ' + rowData.mobile} ></Column>
                <Column header="Action" body={(rowData) => (
                    <div className="d-flex gap-2 justify-content-center">
                        <FaEdit onClick={async () => {
                            setUserAddFormShow(true);
                            let editModeRes;
                            if (rowData.role === 'admin') {
                                editModeRes = await axios.get(`${API_ADMIN_AUTH_URL}/getsingleadmin/${rowData._id}`, {
                                    withCredentials: true
                                });
                            }
                            else {
                                editModeRes = await axios.get(`${API_OWNER_AUTH_URL}/getsingleowner/${rowData._id}`, {
                                    withCredentials: true
                                });
                            }
                            setDisable(true)
                            setUserDataObj(editModeRes?.data?.data)
                        }} />
                        <MdDelete onClick={async () => {
                            await axios.put(`${API_ADMIN_AUTH_URL}/deleteadmin/${rowData._id}`, {}, {
                                withCredentials: true
                            });
                            setUserData((prevUser) =>
                                prevUser.filter((item) => item._id !== rowData._id)
                            );
                        }} />
                    </div>
                )} ></Column>
            </DataTable>

            <Modal
                show={userAddFormShow}
                onHide={() => {
                    setUserAddFormShow(false);
                    setUserDataObj({});
                    setDisable(false)
                }}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">Add User</h5>
                    <CgClose size={24} onClick={() => {
                        setUserAddFormShow(false);
                        setUserDataObj({});
                        setDisable(false)
                    }} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label admin_form_label">User Name</label>
                                <input type="text" name="userName" onChange={handleChange} value={userDataObj?.userName || ''} className="form-control" placeholder="Enter user name" />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label admin_form_label">Email</label>
                                <input type="email" disabled={disable} name="email" onChange={handleChange} value={userDataObj?.email || ''} className="form-control" placeholder="Enter email" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label admin_form_label">Role</label>
                                <Select
                                    name="role"
                                    options={roleOptions}
                                    isDisabled={disable}
                                    value={roleOptions.find(option => option.value === userDataObj?.role)}
                                    onChange={(selectedOption) => {
                                        setUserDataObj(prev => ({
                                            ...prev,
                                            role: selectedOption?.value || ''
                                        }));
                                    }}
                                    placeholder="-- Select role --"
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: 'black',
                                            backgroundColor: state.isFocused ? '#f0f0f0' : 'white'
                                        })
                                    }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label admin_form_label">Country Code</label>
                                <input type="text" name="countryCode" onChange={handleChange} value={userDataObj?.countryCode || ''} className="form-control" placeholder="Enter country code" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label admin_form_label">Mobile Number</label>
                                <input type="text" name="mobile" onChange={handleChange} value={userDataObj?.mobile || ''} className="form-control" placeholder="Enter phone number" />
                            </div>
                        </div>

                        <div className="text-end mt-4">
                            <button type="button" className="admin_form_btn px-4 py-2" onClick={submitForm} >
                                Submit
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AdminAccess;