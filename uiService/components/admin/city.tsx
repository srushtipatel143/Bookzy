"use client";
import "@/styles/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_ADMIN_URL } from "@/utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { CgClose } from "react-icons/cg";

interface CityData {
    id: number,
    city: string,
    state: string,
    country: string,
    isUserMatch: boolean
}

interface CityDataObject {
    id?: number;
    city?: string;
    state?: string;
    country?: string;
}

const AdminCity = () => {
    const [city, setCity] = useState<CityData[]>([]);
    const [cityAddFormShow, setCityAddFormShow] = useState<boolean>(false);
    const [cityDataObj, setCityDataObj] = useState<CityDataObject>({});

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getcitydata = await axios.get(`${API_ADMIN_URL}/getallcity`, {
                    withCredentials: true
                });
                setCity(getcitydata?.data?.data)
            } catch (error: any) {
                return toast.error(error?.response?.data?.message);
            }
        }
        fetchDetails()
    }, []);

    const submitForm = async () => {
        try {
            if (cityDataObj?.id) {
                const editCityRes = await axios.put(`${API_ADMIN_URL}/editcity`, cityDataObj, {
                    withCredentials: true
                });
                const data = editCityRes?.data?.data;
                setCity((prevCity) =>
                    prevCity.map((item) =>
                        item.id === cityDataObj.id ? { ...item, ...data } : item
                    )
                );
                setCityAddFormShow(false)
                setCityDataObj({})
                return toast.success("City update successfully");
            }
            else {
                const createCityRes = await axios.post(`${API_ADMIN_URL}/addcity`, cityDataObj, {
                    withCredentials: true
                });
                const data = createCityRes?.data?.data;
                setCity((prevCity) => [...prevCity, data]);
                setCityAddFormShow(false)
                setCityDataObj({})
                return toast.success("City add successfully");
            }
        } catch (error: any) {
            return toast.error(error?.response?.data?.message);
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCityDataObj((prev) => ({
            ...(prev || {}),
            [name]: value
        }))
    }

    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>City Management</div>
                <div>
                    <button className="admin_city_add" onClick={() => setCityAddFormShow(true)}>Add City</button>
                </div>
            </div>

            <DataTable value={city} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(rowData, options) => options.rowIndex + 1}   ></Column>
                <Column field="city" header="City" sortable></Column>
                <Column field="state" header="State" sortable></Column>
                <Column field="country" header="Country" sortable ></Column>
                <Column header="Action" body={(rowData) => (
                    rowData.isUserMatch ? <FaEdit onClick={async () => {
                        setCityAddFormShow(true);
                        const editModeRes = await axios.get(`${API_ADMIN_URL}/getcity/${rowData.id}`, {
                            withCredentials: true
                        });
                        setCityDataObj(editModeRes?.data?.data[0])
                    }} /> : null
                )} ></Column>
            </DataTable>

            <Modal
                show={cityAddFormShow}
                onHide={() => {
                    setCityAddFormShow(false);
                    setCityDataObj({});
                }}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">Add City</h5>
                    <CgClose size={24} onClick={() => {
                        setCityAddFormShow(false);
                        setCityDataObj({});
                    }} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        <div className="mb-3">
                            <label className="form-label admin_form_label">City</label>
                            <input type="text" name="city" onChange={handleChange} value={cityDataObj?.city || ''} className="form-control" placeholder="Enter city name" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label admin_form_label">State</label>
                            <input type="text" name="state" onChange={handleChange} value={cityDataObj?.state || ''} className="form-control" placeholder="Enter state name" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label admin_form_label">Country</label>
                            <input type="text" name="country" onChange={handleChange} value={cityDataObj?.country || ''} className="form-control" placeholder="Enter country name" />
                        </div>

                        <div className="text-end mt-4">
                            <button type="button" className="admin_form_btn px-4 py-2" onClick={submitForm} >
                                Submit
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default AdminCity;