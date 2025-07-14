"use client";
import "../../css/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_OWNER_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { CgClose } from "react-icons/cg";
import Select from 'react-select';
import { SingleValue } from "react-select";

interface CinemaData {
    id: number,
    city: string,
    state: string,
    country: string,
    isUserMatch: boolean
}

interface city {
    id: number;
    city: string;
}

interface status {
    id: number;
    status: string;
}

interface facility {
    id: number;
    name: string;
}

interface CinemaDataObject {
    id?: number;
    cinemaName?: string;
    cinemaLandmark?: string;
    country?: string;
    cityId?: number | string;
    status?: number | string;
    facility?: facilityVal[];
}

interface facilityVal {
    facilityName?: string,
    status?: number
};

interface FacilityOption {
    value: string;
    label: string;
}

const OwnerCinema = () => {
    const [cinema, setCinema] = useState<CinemaData[]>([]);
    const [facility, setFacility] = useState<facilityVal>({
        facilityName: '',
        status: 1
    })
    const [city, setCity] = useState<city[]>([])
    const [status, setStatus] = useState<status[]>([])
    const [facilityData, setFacilityData] = useState<facility[]>([])
    const [cityAddFormShow, setCityAddFormShow] = useState<boolean>(false);
    const [cinemaDataObj, setCinemaDataObj] = useState<CinemaDataObject>({});
    const [selectedFacility, setSelectedFacility] = useState<FacilityOption | null>(null);


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getcitydata = await axios.get(`${API_OWNER_URL}/getallcinema`, {
                    withCredentials: true
                });
                setCinema(getcitydata?.data?.data.groupedCinemaRes);
                setCity(getcitydata?.data?.data.cityResponse)
                setStatus(getcitydata?.data?.data.statusResponse)
                setFacilityData(getcitydata?.data?.data.facilityResponse)
            } catch (error: any) {
                return toast.error(error.response.data.message);
            }
        }
        fetchDetails()
    }, []);

    const submitForm = async () => {
        try {
            if (cinemaDataObj?.id) {
                const editCinemaRes = await axios.put(`${API_OWNER_URL}/editcinema`, cinemaDataObj, {
                    withCredentials: true
                });
                const data = editCinemaRes?.data?.data;
                setCinema((prevCity) =>
                    prevCity.map((item) =>
                        item.id === cinemaDataObj.id ? { ...item, ...data } : item
                    )
                );
                setCityAddFormShow(false)
                setCinemaDataObj({})
                return toast.success("Cinema update successfully");
            }
            else {
                const createCinemaRes = await axios.post(`${API_OWNER_URL}/addcinema`, cinemaDataObj, {
                    withCredentials: true
                });
                const data = createCinemaRes?.data?.data;
                setCinema((prevCity) => [...prevCity, data]);
                setCityAddFormShow(false)
                setCinemaDataObj({})
                return toast.success("Cinema add successfully");
            }
        } catch (error: any) {
            return toast.error(error.response.data.message);
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCinemaDataObj((prev) => ({
            ...(prev || {}),
            [name]: value
        }))
    }

    const cityOptions = city.map((item) => ({
        value: item.id,
        label: item.city
    }));

    const statusOptions = status.map((item) => ({
        value: item.id,
        label: item.status
    }));

    const facilityStatus = [
        { value: 1, label: "Available" },
        { value: 2, label: "Not Available" }
    ];

    const facilityOptions = facilityData.map((item) => ({
        value: item.name,
        label: item.name,
        isDisabled: !!cinemaDataObj?.facility?.some(f => f.facilityName === item.name)
    }));



    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Cinema Management</div>
                <div>
                    <button className="admin_city_add" onClick={() => setCityAddFormShow(true)}>Add Cinema</button>
                </div>
            </div>

            <DataTable value={cinema} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                <Column field="city" header="City" sortable></Column>
                <Column field="cinemaName" header="Ciname Name" sortable></Column>
                <Column
                    header="Facility"
                    body={(rowData) => (
                        <div>
                            {rowData.facility?.map((item: any) => (
                                <div key={item.facilityName}>{item.facilityName}</div>
                            ))}
                        </div>
                    )}
                ></Column>
                <Column field="cinemaLandmark" header="Landmark" sortable></Column>
                <Column  body={(rawData)=>rawData.screens?rawData.screens:'0'} header="No. of screens" sortable ></Column>
                <Column header="Action" body={() => (
                    <FaEdit />
                )} ></Column>
            </DataTable>

            <Modal
                show={cityAddFormShow}
                onHide={() => {
                    setCityAddFormShow(false);
                    setCinemaDataObj({});
                }}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">Add Cinema</h5>
                    <CgClose size={24} onClick={() => {
                        setCityAddFormShow(false);
                        setCinemaDataObj({});
                    }} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label admin_form_label">City</label>
                                <Select
                                    options={cityOptions}
                                    value={cityOptions.find(option => option.value === cinemaDataObj?.cityId)}
                                    onChange={(selectedOption) => {
                                        setCinemaDataObj(prev => ({
                                            ...prev,
                                            cityId: selectedOption?.value || '',
                                            city:selectedOption?.label || ''
                                        }));
                                    }}
                                    placeholder="-- Select city --"
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: 'black',
                                            backgroundColor: state.isFocused ? '#f0f0f0' : 'white'
                                        })
                                    }}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label admin_form_label">Cinema Name</label>
                                <input type="text" name="cinemaName" onChange={handleChange} value={cinemaDataObj?.cinemaName || ''} className="form-control" placeholder="Enter cinema name" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label admin_form_label">Status</label>
                                <Select
                                    name="role"
                                    options={statusOptions}
                                    value={statusOptions.find(option => option.value === cinemaDataObj?.status)}
                                    onChange={(selectedOption) => {
                                        setCinemaDataObj(prev => ({
                                            ...prev,
                                            status: selectedOption?.value || ''
                                        }));
                                    }}
                                    placeholder="-- Select city --"
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
                            <div className="col-md-7 mb-3">
                                <label className="form-label admin_form_label">Landmark</label>
                                <textarea name="cinemaLandmark" onChange={handleChange} value={cinemaDataObj?.cinemaLandmark || ''} className="form-control" />
                            </div>
                            <div className="col-md-5 mb-3">
                                <label className="form-label admin_form_label">Facility</label>
                                <div className="d-flex gap-1">
                                    <div className="col-md-10 mb-3">
                                        <Select
                                            name="role"
                                            options={facilityOptions}
                                            value={selectedFacility}
                                            onChange={(selectedOption: SingleValue<FacilityOption>) => {
                                                setSelectedFacility(selectedOption);
                                                setFacility({
                                                    facilityName: selectedOption?.value ?? '',
                                                    status: 1
                                                });
                                            }}
                                            placeholder="-- Select facility --"
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    color: state.isDisabled ? '#999' : 'black',
                                                    backgroundColor: state.isDisabled ? '#f9f9f9'
                                                        : state.isFocused
                                                            ? '#f0f0f0'
                                                            : 'white',
                                                    cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                if (!facility.facilityName?.trim()) {
                                                    toast.warn("Please select a facility before adding.");
                                                    return;
                                                }
                                                setCinemaDataObj((prev) => ({
                                                    ...prev,
                                                    facility: [...(prev.facility || []), facility]
                                                }));
                                                setFacility({
                                                    facilityName: '',
                                                    status: 1
                                                });
                                                setSelectedFacility(null);
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DataTable value={cinemaDataObj?.facility}>
                            <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                            <Column field="facilityName" header="Facility"></Column>
                            <Column body={(rawData,options) => (
                                <Select
                                    options={facilityStatus}
                                    value={facilityStatus.find(option => option.value === rawData?.status)}
                                    placeholder="-- Select city --"
                                    onChange={(selectedOption) => {
                                        const updatedFacilities = [...(cinemaDataObj.facility || [])];
                                        updatedFacilities[options.rowIndex] = {
                                            ...updatedFacilities[options.rowIndex],
                                            status: Number(selectedOption?.value)
                                        };
                                        setCinemaDataObj((prev) => ({
                                            ...prev,
                                            facility: updatedFacilities
                                        }));
                                    }}
                                    menuPortalTarget={document.body}
                                    styles={{
                                        option: (provided, state) => ({  
                                            ...provided,
                                            color: 'black',
                                            backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                                            zIndex: 9999
                                        }),
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />
                            )} header="Action"></Column>
                        </DataTable>
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

export default OwnerCinema;