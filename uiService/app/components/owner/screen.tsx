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
import { useRouter } from 'next/navigation';

interface Row {
    rowName: string;
    noOfRowSeat: number;
    rowType: string;
    statusId: number;
    seatStartFrom: number;
    seatEndTo: number;
}

interface Screen {
    screenName: string;
    noOfRows: number;
    totalNoOFSeats: number;
    rowsInfo: Row[];
}


const OwnerScreen = () => {

    const [screenData, setScreenData] = useState([]);
    const [screenAddFormShow, setscreenAddFormShow] = useState<boolean>(false)
    const [screens, setScreens] = useState<Screen[]>([{
        screenName: "",
        noOfRows: 0,
        totalNoOFSeats: 0,
        rowsInfo: [],
    }]);


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
                noOfRows: 0,
                totalNoOFSeats: 0,
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

    const handleAddRow = (screenIndex: any) => {
        const updated = [...screens];
        updated[screenIndex].rowsInfo.push({
            rowName: "",
            noOfRowSeat: 0,
            rowType: "",
            statusId: 1,
            seatStartFrom: 0,
            seatEndTo: 0,
        });
        setScreens(updated);
    };

    const handleRemoveRow = (screenIndex: any, rowIndex: any) => {
        const updated = [...screens];
        updated[screenIndex].rowsInfo = updated[screenIndex].rowsInfo.filter((_, i) => i !== rowIndex);
        setScreens(updated);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const payload = {
            cinemaId: 1,
            screens,
        };
        console.log("Final Payload:", payload);
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
                        <button className="screen_add">Add</button>
                    </div>
                )}></Column>
            </DataTable>

            <Modal
                show={screenAddFormShow}
                onHide={() => {
                    setscreenAddFormShow(false);
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
                        setscreenAddFormShow(false)
                    }} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        {screens.map((screen, screenIndex) => (
                            <>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label admin_form_label">Screen Name</label>
                                        <div className="d-flex gap-2">
                                            <div className="col-md-8">
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
                                </div>
                                {screen.rowsInfo.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        style={{ display: "flex", gap: "0.5rem", marginBottom: "10px", alignItems: "center" }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Row Name"
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].rowName`}
                                            value={row.rowName}
                                            onChange={(e) => handleRowChange(screenIndex, rowIndex, "rowName", e.target.value)}
                                            className="form-control"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Seats"
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].noOfRowSeat`}
                                            value={row.noOfRowSeat}
                                            onChange={(e) => handleRowChange(screenIndex, rowIndex, "noOfRowSeat", e.target.value)}
                                            className="form-control"
                                        />
                                        <select
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].rowType`}
                                            value={row.rowType}
                                            onChange={(e) => handleRowChange(screenIndex, rowIndex, "rowType", e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Choose Type</option>
                                            <option value="Gold">Gold</option>
                                            <option value="Silver">Silver</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Start"
                                            name={`screens[${screenIndex}].rowsInfo[${rowIndex}].seatStartFrom`}
                                            value={row.seatStartFrom}
                                            onChange={(e) =>
                                                handleRowChange(screenIndex, rowIndex, "seatStartFrom", e.target.value)
                                            }
                                            className="form-control"
                                        />
                                        <input
                                            type="number"
                                            placeholder="End"
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
                            </>
                        ))}
                        <div className="d-flex justify-content-between text-end mt-4">
                            <button type="button" className="admin_form_btn px-4 py-2 " onClick={handleAddScreen}>
                                + Add Screen
                            </button>
                            <button type="button" className="admin_form_btn px-4 py-2" >
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