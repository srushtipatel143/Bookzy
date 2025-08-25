"use client";
import "../../css/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_OWNER_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { CgClose } from "react-icons/cg";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useParams } from "next/navigation";

interface CinemaData {
    id: number,
    cinemaName: string
}
interface screen {
    screenId: number;
    screenName: string;
}
interface showDataObject {
    _id?: string;
    cinemaId?: number | string,
    cinemaName?: string;
    screenType?: string;
    screenId?: number | string,
    screenName?: string,
    movieId?: string,
    movieName?: string,
    movieLanguage?: string,
    priceInfoForShow?: priceInfo[],
    showDate?: string,
    showStartTime?: string
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
    rowType?: string;
    price?: string;
}[];
interface priceValObject {
    rowType?: string;
    price?: string;
};
interface ShowData {
    _id: string,
    screenType: string,
    movieName: string,
    movieLanguage: string,
    showStartTime: string
}

const OwnerShow = () => {
    const [show, setShow] = useState<ShowData[]>([])
    const [cinema, setCinema] = useState<CinemaData[]>([]);
    const [screenData, setScreenData] = useState<screen[]>([]);
    const [movieData, setMovieData] = useState<movie[]>([])
    const [movieLan, setMovieLan] = useState<movieLLan[]>([])
    const [showAddFormShow, setShowAddFormShow] = useState<boolean>(false);
    const [showDataObj, setShowDataObj] = useState<showDataObject>({});
    const [priceInfo, setPriceInfo] = useState<priceInfo[]>([]);
    const [priceVal, setPriceVal] = useState<priceValObject>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("00:00");
    const params = useParams();
    const [disableField, setDisableField] = useState(false)
    const { cinemaId, screenId } = params;

    const addRowAndPrice = () => {
        setPriceInfo((prev) => [...prev, priceVal]);
        setPriceVal({})
    };

    const handleChangeVal = (e: any) => {
        const { name, value } = e.target;
        setPriceVal((prev) => ({
            ...(prev || {}),
            [name]: value
        }))
    }

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const obj = {
                    cinemaId: Number(cinemaId),
                    screenId: Number(screenId)
                }
                const fetchAllShow = await axios.post(`${API_OWNER_URL}/getshowbybinemaid`, obj, {
                    withCredentials: true
                });
                setShow(fetchAllShow?.data?.data)
            } catch (error: any) {
                return toast.error(error.response.data.message);
            }
        }
        fetchDetails()
    }, []);

    const getLocalMidnightInUTC = (dateStr: string): string => {
        if (dateStr.includes("-")) {
            const [day, month, year] = dateStr.split("-").map(Number);
            const localDate = new Date(year, month - 1, day, 0, 0, 0);
            return localDate.toISOString();
        }
        else {
            return dateStr;
        }

    };

    const getUTCDateTime = (date: Date, time: string): string => {
        const [hours, minutes] = time.split(":").map(Number);
        const localDateTime = new Date(date);
        localDateTime.setHours(hours, minutes, 0, 0);
        return localDateTime.toISOString();
    };

    const resetForm = () => {
        setShowDataObj({});
        setSelectedDate(null);
        setSelectedTime("00:00");
        setPriceInfo([]);
        setMovieLan([]);
        setScreenData([]);
        setDisableField(false);

    }

    const submitForm = async () => {
        try {
            showDataObj.priceInfoForShow = priceInfo || [];
            if(selectedTime==="00:00" && selectedDate!==null)
            {
                const dateTimeUTC = getUTCDateTime(selectedDate,"00:00");
                showDataObj.showStartTime=dateTimeUTC;
            }
            if (showDataObj?._id) {
                const editCinemaRes = await axios.put(`${API_OWNER_URL}/editshow`, showDataObj, {
                    withCredentials: true
                });
                const data = editCinemaRes?.data?.data;
                setShow((prevShow) =>
                    prevShow.map((item) =>
                        item._id === showDataObj._id ? { ...item, ...data } : item
                    )
                );
                setShowAddFormShow(false);
                setShowDataObj({});
                return toast.success("Show updated successfully");
            } else {
                const createShowRes = await axios.post(`${API_OWNER_URL}/addshow`, showDataObj, {
                    withCredentials: true
                });
                const data = createShowRes?.data?.data;
                setShow((prevShow) => [...prevShow, data]);
                setShowAddFormShow(false);
                setShowDataObj({});
                return toast.success("Show added successfully");
            }
        } catch (error: any) {
            return toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

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
    }));

    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Show Management</div>
                <div>
                    <button className="admin_city_add" onClick={async () => {
                        setShowAddFormShow(true)
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

            <DataTable value={show} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                <Column field="movieName" header="Movie Name" sortable></Column>
                <Column
                    field="showStartTime"
                    header="Show Time"
                    sortable
                    body={(rowData) => {
                        const date = new Date(rowData.showStartTime);
                        return date.toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        });
                    }}
                ></Column>
                <Column field="screenType" header="Screen Type" sortable></Column>
                <Column header="Edit" body={(rowData) => (
                    <FaEdit
                        onClick={async () => {
                            setDisableField(true);
                            setShowAddFormShow(true);
                            const editModeRes = await axios.get(`${API_OWNER_URL}/getShow/${rowData._id}`, {
                                withCredentials: true
                            });
                            const dataval = editModeRes?.data?.data;
                            setShowDataObj(dataval)
                            setPriceInfo(dataval?.priceInfoForShow)
                            const getcitydata = await axios.get(`${API_OWNER_URL}/getallcinema`, {
                                withCredentials: true
                            });
                            setCinema(getcitydata?.data?.data.groupedCinemaRes);
                            const getMovieDataRes = await axios.get(`${API_OWNER_URL}/getmovieaddoption`, {
                                withCredentials: true
                            });
                            const getScreendata = await axios.get(`${API_OWNER_URL}/getScreenByCinemaId/${dataval?.cinemaId}`, {
                                withCredentials: true
                            });
                            setScreenData(getScreendata?.data?.data);
                            setMovieData(getMovieDataRes?.data?.data)

                            const movieLanguage = getMovieDataRes?.data?.data.find((option: any) => option._id === dataval?.movieId)
                            setMovieLan(movieLanguage?.movieLanguage || []);

                            setSelectedDate(dataval.showDate)
                            const utcDate = new Date(dataval.showStartTime);
                            const istTime = utcDate.toLocaleTimeString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            });
                            setSelectedTime(istTime);

                        }}
                    />
                )} ></Column>
            </DataTable>

            <Modal
                show={showAddFormShow}
                onHide={() => {
                    setShowAddFormShow(false);
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
                        setShowAddFormShow(false);
                        resetForm();
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
                                    isDisabled={disableField}
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
                                    isDisabled={disableField}
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
                                        setMovieLan(movieLanguage?.movieLanguage || []);
                                        setShowDataObj(prev => ({
                                            ...prev,
                                            movieId: selectedOption?.value || '',
                                            movieName: selectedOption?.label || ''
                                        }));
                                    }}
                                    placeholder="-- Select movie --"
                                    isDisabled={disableField}
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
                                <input type="text" name="screenType" onChange={handleChange} value={showDataObj?.screenType || ''} className="form-control" placeholder="Enter screen type" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex flex-column">
                                    <label className="form-label admin_form_label me-2" style={{ whiteSpace: "nowrap" }}>
                                        Show Date
                                    </label>
                                    <DatePicker
                                        className="form-control"
                                        placeholderText="dd/mm/yyyy"
                                        dateFormat="dd/MM/yyyy"
                                        selected={selectedDate}
                                        onChange={(date: Date | null) => {
                                            setSelectedDate(date)
                                            if (date !== null) {
                                                const day = date.getDate().toString().padStart(2, "0");
                                                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                                const year = date.getFullYear();
                                                const formattedDate = `${day}-${month}-${year}`;
                                                const dateOnlyUTC = getLocalMidnightInUTC(formattedDate);
                                                setShowDataObj((prev) => ({
                                                    ...prev,
                                                    showDate: dateOnlyUTC
                                                }))
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex flex-column">
                                    <label className="form-label admin_form_label me-2" style={{ whiteSpace: "nowrap" }}>
                                        Show Time
                                    </label>
                                    <TimePicker
                                        disableClock={true}
                                        format="HH:mm"
                                        value={selectedTime}
                                        onChange={(time) => {
                                            setSelectedTime(time || "00:00")
                                            if (selectedDate !== null) {
                                                const newTime = time ?? "00:00";
                                                const dateTimeUTC = getUTCDateTime(selectedDate, newTime);
                                                setShowDataObj((prev) => ({
                                                    ...prev,
                                                    showStartTime: dateTimeUTC
                                                }))
                                            }
                                        }}
                                        clearIcon={null}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3 align-items-end">
                                <div className="col-md-4">
                                    <label className="form-label admin_form_label">Row Type</label>
                                    <input type="text" name="rowType" value={priceVal.rowType || ''} onChange={handleChangeVal} className="form-control" placeholder="Enter rowtype"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label admin_form_label">Price</label>
                                    <input type="text" name="price" value={priceVal.price || ''} onChange={handleChangeVal} className="form-control" placeholder="Enter price"
                                    />
                                </div>
                                <div className="col-md-4 d-flex">
                                    <button type="button" className="btn btn-secondary mt-auto" onClick={addRowAndPrice} >Add</button>
                                </div>
                            </div>
                            <DataTable value={priceInfo}>
                                <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                                <Column field="rowType" header="Row Type"></Column>
                                <Column field="price" header="Price"></Column>
                                <Column body={(rawData, options) => (
                                    <FaTrash
                                        style={{ cursor: "pointer" }}
                                        onClick={() => { setPriceInfo((prev) => prev.filter((_, i) => i !== options.rowIndex)) }}
                                    />
                                )} header="Action"></Column>
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