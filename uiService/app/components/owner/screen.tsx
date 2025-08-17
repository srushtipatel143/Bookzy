"use client";
import "../../css/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_OWNER_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { CgClose } from "react-icons/cg";
import { useParams } from "next/navigation";

interface Row {
    rowName: string;
    noOfRowSeat: string;
    rowType: string;
    statusId: number;
    seatStartFrom: string;
    seatEndTo: string;
}

interface Screen {
    screenName: string;
    noOfRows: string;
    totalNoOFSeats: string;
    rowsInfo: Row[];
}

const OwnerScreen = () => {
    const [screenData, setScreenData] = useState<Screen[]>([]);
    const [screenAddFormShow, setscreenAddFormShow] = useState<boolean>(false)
    const [screens, setScreens] = useState<Screen[]>([{
        screenName: "",
        noOfRows: '',
        totalNoOFSeats: '',
        rowsInfo: [],
    }]);
    const params = useParams();
    const cinemaId = params.id;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getScreendata = await axios.get(`${API_OWNER_URL}/getScreenByCinemaId/${cinemaId}`, {
                    withCredentials: true
                });
                setScreenData(getScreendata?.data?.data);
            } catch (error: any) {
                return toast.error(error.response.data.message);
            }
        }
        fetchDetails()
    }, []);

    const handleScreenChange = (index: number, field: keyof Screen, value: Screen[typeof field]) => {
        const updated = [...screens];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setScreens(updated);
    };

    const handleAddScreen = () => {
        setScreens([
            ...screens,
            {
                screenName: "",
                noOfRows: '',
                totalNoOFSeats: '',
                rowsInfo: [],
            },
        ]);
    };

    const handleRowChange = (screenIndex: number, rowIndex: number, field: keyof Row, value: string | number) => {
        const updated = [...screens];
        updated[screenIndex].rowsInfo[rowIndex] = {
            ...updated[screenIndex].rowsInfo[rowIndex],
            [field]: value,
        };
        setScreens(updated);
    };

    const handleAddRow = (screenIndex: number) => {
        const updated = [...screens];
        updated[screenIndex].rowsInfo.push({
            rowName: "",
            noOfRowSeat: "",
            rowType: "",
            statusId: 1,
            seatStartFrom: "",
            seatEndTo: "",
        });
        setScreens(updated);
    };

    const handleRemoveRow = (screenIndex: number, rowIndex: number) => {
        const updated = [...screens];
        updated[screenIndex].rowsInfo = updated[screenIndex].rowsInfo.filter((_, i) => i !== rowIndex);
        setScreens(updated);
    };

    const handleSubmit = async () => {
        const updatedScreens = screens.map((screen) => {
            let totalSeats = 0;
            const updatedRows = screen.rowsInfo.map((row) => {
                const start = parseInt(row.seatStartFrom) || 0;
                const end = parseInt(row.seatEndTo) || 0;
                const seatCount = end >= start ? end - start + 1 : 0;
                totalSeats += seatCount;

                return {
                    ...row,
                    noOfRowSeat: seatCount.toString(),
                };
            });
            return {
                ...screen,
                rowsInfo: updatedRows,
                noOfRows: updatedRows.length.toString(),
                totalNoOFSeats: totalSeats.toString(),
            };
        });
        const payload = { cinemaId:cinemaId, screens: updatedScreens };
        try {
            const createCinemaRes = await axios.post(`${API_OWNER_URL}/addscreen`, payload, {
                withCredentials: true
            });
            const resdata = createCinemaRes?.data?.data?.screens;
            setScreenData((prev) => [...prev, ...resdata])
            setScreens([{
                screenName: "",
                noOfRows: '',
                totalNoOFSeats: '',
                rowsInfo: [],
            }]);
            setscreenAddFormShow(false)
            return toast.success("Scren add successfully");
        } catch (error: any) {
            return toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Screen Management</div>
                <div>
                    <button className="admin_city_add" onClick={() => setscreenAddFormShow(true)}>Add Screen</button>
                </div>
            </div>

            <DataTable value={screenData} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(_, options) => options.rowIndex + 1}></Column>
                <Column field="screenName" header="Screen Name" sortable></Column>
                <Column field="noOfRows" header="Total Rows" sortable></Column>
                <Column field="totalNoOFSeats" header="Total Seats" sortable></Column>
            </DataTable>

            <Modal
                show={screenAddFormShow}
                onHide={() => {
                    setscreenAddFormShow(false);
                    setScreens([{
                        screenName: "",
                        noOfRows: '',
                        totalNoOFSeats: '',
                        rowsInfo: [],
                    }]);
                }}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">Add Screen</h5>
                    <CgClose size={24} onClick={() => {
                        setscreenAddFormShow(false);
                        setScreens([{
                            screenName: "",
                            noOfRows: '',
                            totalNoOFSeats: '',
                            rowsInfo: [],
                        }]);
                    }} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        {screens.map((screen, screenIndex) => (
                            <div key={screenIndex}>
                                <div className="row" >
                                    <label className="form-label admin_form_label">Screen Name</label>
                                    <div className="d-flex gap-2">
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                name={`screens[${screenIndex}].screenName`}
                                                value={screen.screenName}
                                                onChange={(e) => handleScreenChange(screenIndex, "screenName", e.target.value)}
                                                className="form-control" placeholder="Enter screen name"
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <button className="admin_form_btn px-4 py-2 bg-secondary text-light" type="button" onClick={() => handleAddRow(screenIndex)}>
                                                + Add Row
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {screen.rowsInfo.map((row, rowIndex) => (
                                    <div key={rowIndex} className="mt-2" style={{ display: "flex", gap: "0.5rem", marginBottom: "10px", alignItems: "center" }}>
                                        <input
                                            type="text"
                                            placeholder="Row Name"
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].rowName`}
                                            value={row.rowName}
                                            onChange={(e) => handleRowChange(screenIndex, rowIndex, "rowName", e.target.value)}
                                            className="form-control"
                                        />
                                        <select
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].rowType`}
                                            value={row.rowType}
                                            onChange={(e) => handleRowChange(screenIndex, rowIndex, "rowType", e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Choose Row Type</option>
                                            <option value="Gold">Gold</option>
                                            <option value="Silver">Silver</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Starting point"
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].seatStartFrom`}
                                            value={row.seatStartFrom}
                                            onChange={(e) =>
                                                handleRowChange(screenIndex, rowIndex, "seatStartFrom", e.target.value)
                                            }
                                            className="form-control"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Ending point"
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].seatEndTo`}
                                            value={row.seatEndTo}
                                            onChange={(e) =>
                                                handleRowChange(screenIndex, rowIndex, "seatEndTo", e.target.value)
                                            }
                                            className="form-control"
                                        />
                                        <button type="button" onClick={() => handleRemoveRow(screenIndex, rowIndex)}>
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="d-flex justify-content-between text-end mt-4">
                            <button type="button" className="admin_form_btn px-4 py-2 " onClick={handleAddScreen}>
                                + Add Screen
                            </button>
                            <button type="button" onClick={handleSubmit} className="admin_form_btn px-4 py-2" >
                                Submit
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default OwnerScreen;