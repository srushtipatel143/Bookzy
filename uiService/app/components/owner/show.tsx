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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface CinemaData {
    id: number,
    cinemaName: string
}
interface screen {
    screenId: number;
    screenName: string;
}
interface showDataObject {
    _id?: number;
    cinemaId?: number | string,
    cinemaName?: string;
    screenType?: string;
    screenId?: number | string,
    screenName?: string,
    movieId?: string,
    movieName?: string,
    movieLanguage?: string
}
interface movie {
    _id?: string,
    title: string,
    movieLanguage: movieLLan[]
}
interface movieLLan {
    language: string
};
interface priceInfo {
    rowType: string;
    price: string;
}[];

const OwnerShow = () => {
    const [cinema, setCinema] = useState<CinemaData[]>([]);
    const [screenData, setScreenData] = useState<screen[]>([]);
    const [movieData, setMovieData] = useState<movie[]>([])
    const [movieLan, setMovieLan] = useState<movieLLan[]>([])
    const [cinemaAddFormShow, setCinemaAddFormShow] = useState<boolean>(false);
    const [showDataObj, setShowDataObj] = useState<showDataObject>({});
    const [priceInfo, setPriceInfo] = useState<priceInfo[]>([])

    useEffect(() => {
        const fetchDetails = async () => {
            try {
            } catch (error: any) {
                return toast.error(error.response.data.message);
            }
        }
        fetchDetails()
    }, []);

    const submitForm = async () => {
        try {
            console.log(showDataObj)
            if (showDataObj?._id) {
                // const editCinemaRes = await axios.put(`${API_OWNER_URL}/editcinema`, showDataObj, {
                //     withCredentials: true
                // });
                // const data = editCinemaRes?.data?.data;
                // setCinema((prevCity) =>
                //     prevCity.map((item) =>
                //         item.id === showDataObj.id ? { ...item, ...data } : item
                //     )
                // );
                // setCinemaAddFormShow(false)
                // setShowDataObj({})
                // return toast.success("Cinema update successfully");
            }
            else {
                // const createCinemaRes = await axios.post(`${API_OWNER_URL}/addcinema`, showDataObj, {
                //     withCredentials: true
                // });
                // const data = createCinemaRes?.data?.data;
                // setCinema((prevCity) => [...prevCity, data]);
                // setCinemaAddFormShow(false)
                // setShowDataObj({})
                // return toast.success("Cinema add successfully");
            }
        } catch (error: any) {
            return toast.error(error.response.data.message);
        }
    }

    const handleChange = async (e: any) => {
        const { name, value } = e.target;
        setShowDataObj((prev) => ({
            ...(prev || {}),
            [name]: value
        }))
    }

    const cinemaOptions = cinema.map((item) => ({
        value: item.id,
        label: item.cinemaName
    }));

    const screenOptions = screenData.map((item) => ({
        value: item.screenId,
        label: item.screenName
    }));

    const movieOptions = movieData.map((item) => ({
        value: item._id,
        label: item.title
    }));

    const movieLanguageOption = movieLan.map((item) => ({
        value: item.language,
        label: item.language
    }))

    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Show Management</div>
                <div>
                    <button className="admin_city_add" onClick={async () => {
                        setCinemaAddFormShow(true)
                        const getcitydata = await axios.get(`${API_OWNER_URL}/getallcinema`, {
                            withCredentials: true
                        });
                        setCinema(getcitydata?.data?.data.groupedCinemaRes);
                        const getMovieDataRes = await axios.get(`${API_OWNER_URL}/getmovieaddoption`, {
                            withCredentials: true
                        })
                        setMovieData(getMovieDataRes?.data?.data)
                    }}>Add Show</button>
                </div>
            </div>

            {/* <DataTable value={cinema} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                <Column field="city" header="City" sortable></Column>
                <Column field="cinemaName" header="Ciname Name" sortable></Column>
                <Column
                    header="Facility"
                    body={(rowData) => (
                        <div>
                            {rowData.facility?.filter((item: any) => item.status !== 2)
                                .map((item: any) => (
                                    <div key={item.facilityName}>{item.facilityName}</div>
                                ))}
                        </div>
                    )}
                ></Column>
                <Column field="cinemaLandmark" header="Landmark" sortable></Column>
                <Column body={(rawData) => rawData.screens ? rawData.screens : '0'} header="No. of screens" sortable ></Column>
                <Column header="Add Screen" body={(rawData) => (
                    <div>
                        <button className="screen_add" onClick={() => {
                            router.push(`/owner/cinema/${rawData.id}`)
                        }}>Add</button>
                    </div>
                )}></Column>
                <Column header="Edit" body={(rowData) => (
                    <FaEdit onClick={async () => {
                        setCinemaAddFormShow(true);
                        const editModeRes = await axios.get(`${API_OWNER_URL}/getcinema/${rowData.id}`, {
                            withCredentials: true
                        });
                        setCinemaDataObj(editModeRes?.data?.data[0])
                    }} />
                )} ></Column>
            </DataTable> */}

            <Modal
                show={cinemaAddFormShow}
                onHide={() => {
                    setCinemaAddFormShow(false);
                    setShowDataObj({});
                }}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">Add Show</h5>
                    <CgClose size={24} onClick={() => {
                        setCinemaAddFormShow(false);
                        setShowDataObj({});
                    }} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label admin_form_label">Cinema Name</label>
                                <Select
                                    options={cinemaOptions}
                                    value={cinemaOptions.find(option => option.value === showDataObj?.cinemaId)}
                                    onChange={async (selectedOption) => {
                                        setShowDataObj(prev => ({
                                            ...prev,
                                            cinemaId: selectedOption?.value || '',
                                            cinemaName: selectedOption?.label || ''
                                        }));
                                        const getScreendata = await axios.get(`${API_OWNER_URL}/getScreenByCinemaId/${selectedOption?.value}`, {
                                            withCredentials: true
                                        });
                                        setScreenData(getScreendata?.data?.data);
                                    }}
                                    placeholder="-- Select cinema --"
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: 'black',
                                            backgroundColor: state.isFocused ? '#f0f0f0' : 'white'
                                        })
                                    }}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label admin_form_label">Screen Name</label>
                                <Select
                                    options={screenOptions}
                                    value={screenOptions.find(option => option.value === showDataObj?.screenId)}
                                    onChange={async (selectedOption) => {
                                        setShowDataObj(prev => ({
                                            ...prev,
                                            screenId: selectedOption?.value || '',
                                            screenName: selectedOption?.label || ''
                                        }));
                                    }}
                                    placeholder="-- Select screen --"
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: 'black',
                                            backgroundColor: state.isFocused ? '#f0f0f0' : 'white'
                                        })
                                    }}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label admin_form_label">Movie Name</label>
                                <Select
                                    options={movieOptions}
                                    value={movieOptions.find(option => option.value === showDataObj?.movieId)}
                                    onChange={async (selectedOption) => {

                                        const movieLanguage = movieData.find((option) => option._id === selectedOption?.value)
                                        console.log(movieLanguage?.movieLanguage)
                                        setMovieLan(movieLanguage?.movieLanguage || []);
                                        setShowDataObj(prev => ({
                                            ...prev,
                                            movieId: selectedOption?.value || '',
                                            movieName: selectedOption?.label || ''
                                        }));
                                    }}
                                    placeholder="-- Select movie --"
                                    styles={{
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: 'black',
                                            backgroundColor: state.isFocused ? '#f0f0f0' : 'white'
                                        })
                                    }}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label admin_form_label">Movie Language</label>
                                <Select
                                    options={movieLanguageOption}
                                    value={movieLanguageOption.find(option => option.value === showDataObj?.movieLanguage)}
                                    onChange={async (selectedOption) => {
                                        setShowDataObj(prev => ({
                                            ...prev,
                                            movieLanguage: selectedOption?.value || ''
                                        }));
                                    }}
                                    placeholder="-- Select language --"
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
                                <label className="form-label admin_form_label">Screen Type</label>
                                <input type="text" name="cinemaName" onChange={handleChange} value={showDataObj?.screenType || ''} className="form-control" placeholder="Enter screen type" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex flex-column">
                                    <label className="form-label admin_form_label me-2" style={{ whiteSpace: "nowrap" }}>
                                        Movie Date
                                    </label>
                                    <DatePicker
                                        className="form-control"
                                        placeholderText="Choose date"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex flex-column">
                                    <label className="form-label admin_form_label me-2" style={{ whiteSpace: "nowrap" }}>
                                        Movie Time
                                    </label>
                                    <TimePicker
                                        disableClock={true}   // hides analog clock
                                        format="HH:mm"        // 24 hr format
                                        clearIcon={null}      // hides clear button
                                        className="form-control"
                                    />
                                </div>
                            </div>


                            <div className="row mb-3 align-items-end">
                                <div className="col-md-4">
                                    <label className="form-label admin_form_label">Row Type</label>
                                    <input type="text" name="rowType" onChange={handleChange} className="form-control" placeholder="Enter rowtype"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label admin_form_label">Price</label>
                                    <input type="text" name="price" onChange={handleChange} className="form-control" placeholder="Enter price"
                                    />
                                </div>
                                <div className="col-md-4 d-flex">
                                    <button type="button" className="btn btn-secondary mt-auto">Add</button>
                                </div>
                            </div>
                            <DataTable value={priceInfo}>
                                <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                                <Column field="rowtype" header="Row Type"></Column>
                                <Column field="price" header="Price"></Column>
                                {/* <Column body={(rawData, options) => (
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
                                )} header="Action"></Column> */}
                            </DataTable>
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

export default OwnerShow;