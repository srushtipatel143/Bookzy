"use client";
import "../../css/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_ADMIN_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { CgClose } from "react-icons/cg";
import { IoMdCloseCircle } from "react-icons/io";

interface CityData {
    id: Number,
    city: String,
    state: String,
    country: String,
    isUserMatch: Boolean
}

interface movieLanguage {
    language: String
}

interface movieType {
    type: string
}


const AdminMovie = () => {
    const [city, setCity] = useState<CityData[]>([]);
    const [formStep, setFormStep] = useState(1);
    const [cityAddFormShow, setCityAddFormShow] = useState<boolean>(false);
    const [movieLanguage, setMovieLanguage] = useState<movieLanguage[]>([]);
    const [movieType, setMovieType] = useState<movieType[]>([]);
    const [movieTypeVal, setMovieTypVal] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getcitydata = await axios.get(`${API_ADMIN_URL}/getallcity`, {
                    withCredentials: true
                });
                setCity(getcitydata?.data?.data)
            } catch (error: any) {
                return toast.error(error.response.data.message);
            }
        }
        fetchDetails()
    }, []);

    const addMovieType = () => {
        if (movieTypeVal.trim() === '') return;
        setMovieType(prev => [...prev, { type: movieTypeVal }]);
        setMovieTypVal('');
    };


    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Movie Management</div>
                <div>
                    <button className="admin_city_add" onClick={() => setCityAddFormShow(true)}>Add Movie</button>
                </div>
            </div>

            <DataTable value={city} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(rowData, options) => options.rowIndex + 1}   ></Column>
                <Column field="city" header="City" sortable></Column>
                <Column field="state" header="State" sortable></Column>
                <Column field="country" header="Country" sortable ></Column>
                <Column header="Action" body={(rowData) => (
                    rowData.isUserMatch ? <FaEdit /> : null
                )} ></Column>
            </DataTable>

            <Modal
                show={cityAddFormShow}
                onHide={() => setCityAddFormShow(false)}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">{formStep === 1 ? 'Movie Detail' : 'Casting Detail'}</h5>
                    <CgClose size={24} onClick={() => setCityAddFormShow(false)} style={{ cursor: "pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        {formStep === 1 && (
                            <>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Movie Title</label>
                                        <input type="text" className="form-control" placeholder="Enter movie title" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Release Date</label>
                                        <input type="date" className="form-control" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Movie Duration</label>
                                        <input type="text" className="form-control" placeholder="Enter movie duration" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label admin_form_label">Movie Description</label>
                                        <textarea className="form-control custom-textarea" placeholder="Enter movie description" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Movie Poster Image</label>
                                        <input type="file" className="form-control" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3 d-flex flex-column">
                                        <label className="form-label admin_form_label">Movie Type</label>
                                        <div className="d-flex gap-2">
                                            <div className="col-md-10">
                                                <input type="text" className="form-control" value={movieTypeVal || ''} name="type" onChange={(e) => {
                                                    setMovieTypVal(e.target.value)
                                                }} placeholder="Enter movie type" />
                                            </div>
                                            <div className="col-md-2">
                                                <button type="button" onClick={addMovieType} className="btn btn-secondary">Add</button>
                                            </div>
                                        </div>

                                        {movieType.length > 0 && (
                                            <div className="mb-3">
                                                {movieType.map((item, index) => (
                                                    <span className="admin_val_Add" key={index}>{item.type} <IoMdCloseCircle /> </span>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                    <div className="col-md-6 mb-3 d-flex flex-column">
                                        <label className="form-label admin_form_label">Movie Language</label>
                                        <div className="d-flex gap-2">
                                            <div className="col-md-10">
                                                <input type="text" className="form-control" placeholder="Enter movie type" />
                                            </div>
                                            <div className="col-md-2">
                                                <button type="button" className="btn btn-secondary">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {formStep === 2 && (
                            <>
                                <div className="row mb-3">
                                    <div className="d-flex align-items-end gap-2 w-100 my-2">
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="form-label">Character Real Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Character real name" />
                                        </div>
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="form-label">Role</label>
                                            <input type="text" className="form-control" placeholder="Enter role" />
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-secondary"> Add </button>
                                        </div>

                                    </div>
                                </div>

                            </>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            {formStep > 1 && (
                                <button type="button" className="btn btn-secondary" onClick={() => setFormStep((prev) => prev - 1)} > Back </button>
                            )}

                            {formStep < 2 && (
                                <button type="button" className="btn btn-secondary" onClick={() => setFormStep((prev) => prev + 1)}>Next</button>
                            )}

                            {formStep === 2 && (
                                <button type="submit" className="admin_form_btn px-4 py-2">Submit</button>
                            )}
                        </div>
                    </form>

                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default AdminMovie;