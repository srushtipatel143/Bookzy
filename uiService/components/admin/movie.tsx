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
import { IoMdCloseCircle } from "react-icons/io";
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';


interface MovieData {
    _id: string;
    title: string,
    movieImageURl: string | File,
    releaseDate: string,
    duration: number,
    movieLanguage: movieLanguage,
    movieType: movieType,
    about: string,
    cast: cast
}

interface movieLanguage {
    language: string
}

interface movieType {
    type: string
}

interface cast {
    id?: string,
    _id?: string,
    actor: string,
    role: string;
    imageUrl: string | File
}

interface movieDataObject {
    _id?: string;
    title?: string,
    movieImageURl?: string | File,
    releaseDate?: string,
    duration?: number,
    movieLanguage?: movieLanguage,
    movieType?: movieType,
    about?: string,
    cast?: cast
}

const AdminMovie = () => {
    const [movie, setMovie] = useState<MovieData[]>([]);
    const [formStep, setFormStep] = useState(1);
    const [movieAddFormShow, setMovieAddFormShow] = useState<boolean>(false);
    const [movieLanguage, setMovieLanguage] = useState<movieLanguage[]>([]);
    const [movieType, setMovieType] = useState<movieType[]>([]);
    const [movieTypeVal, setMovieTypVal] = useState('');
    const [movieLanguageVal, setMovieLanguageVal] = useState('');
    const [cast, setCast] = useState<cast[]>([]);
    const [movieDataObj, setMovieDataObj] = useState<movieDataObject>({});
    const [castVal, setCastVal] = useState<cast>({ actor: '', role: '', imageUrl: '' });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const getMoviedata = await axios.get(`${API_ADMIN_URL}/getAllMovie`, {
                    withCredentials: true
                });
                setMovie(getMoviedata?.data?.data)
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

    const addMovieLanguage = () => {
        if (movieLanguageVal.trim() === '') return;
        setMovieLanguage(prev => [...prev, { language: movieLanguageVal }]);
        setMovieLanguageVal('');
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCastVal((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const addMovieCast = () => {
        if (castVal.actor.trim() === '' || castVal.role.trim() === '') return;
        const uniqueId = uuidv4();
        setCast(prev => [...prev, { id: uniqueId, actor: castVal.actor, role: castVal.role, imageUrl: castVal?.imageUrl }]);
        setCastVal({ actor: '', role: '', imageUrl: '' });
    };

    const buildFormData = () => {
        const formData = new FormData();
        Object.entries(movieDataObj).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.set(key, value); 
            } else if (typeof value === 'object' && value !== null) {
                formData.set(key, JSON.stringify(value));
            } else {
                formData.set(key, value?.toString() || "");
            }
        });
        formData.set("movieType", JSON.stringify(movieType));
        formData.set("movieLanguage", JSON.stringify(movieLanguage));
        formData.set("cast", JSON.stringify(cast));
        return formData;
    };

    const submitform = async (e: any) => {
        e.preventDefault();
        const formData = buildFormData();
        if (movieDataObj._id) {
            const updateMovieRes = await axios.put(`${API_ADMIN_URL}/updatemovie`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (updateMovieRes.data.success) {
                toast.success(updateMovieRes.data.message)
                resetForm();
                const data = updateMovieRes?.data?.data;
                setMovie((prevMovie) =>
                    prevMovie.map((item) =>
                        item._id === movieDataObj._id ? { ...item, ...data } : item
                    )
                );
            }
        }
        else {
            const createMovieRes = await axios.post(`${API_ADMIN_URL}/addMovie`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (createMovieRes.data.success) {
                toast.success(createMovieRes.data.message)
                resetForm();
                const data = createMovieRes?.data?.data;
                setMovie((prevmovie) => [...prevmovie, data]);
            }
        }
    }

    const handleChangefun = (e: any) => {
        const { name, value } = e.target;
        setMovieDataObj((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const resetForm = () => {
        setMovieAddFormShow(false);
        setMovieDataObj({});
        setCastVal({ actor: '', role: '', imageUrl: '' });
        setCast([]);
        setMovieTypVal('');
        setMovieType([]);
        setMovieLanguageVal('');
        setMovieLanguage([]);
        setFormStep(1);
    };

    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>Movie Management</div>
                <div>
                    <button className="admin_city_add" onClick={() => setMovieAddFormShow(true)}>Add Movie</button>
                </div>
            </div>

            <div className="table-responsive mb-3">
                <DataTable value={movie}
                    rows={10}
                    sortOrder={-1}
                    style={{ minWidth: '1000px' }}>
                    <Column header="No." body={(_, options) => options.rowIndex + 1} />
                    <Column field="title" header="Title" sortable />
                    <Column field="releaseDate" header="releaseDate" sortable />
                    <Column field="duration" header="Movie Duration" sortable />
                    <Column header="Language" body={(rowData) => (
                        <div className="d-flex flex-column">
                            {rowData.movieLanguage?.map((item: any, index: number) => (
                                <span key={index} style={{ marginRight: "5px" }}>{item.language}</span>
                            ))}
                        </div>
                    )} />
                    <Column header="Movie type" body={(rowData) => (
                        <div className="d-flex flex-column">
                            {rowData.movieType?.map((item: any, index: number) => (
                                <span key={index} style={{ marginRight: "5px" }}>{item.type}</span>
                            ))}
                        </div>
                    )} />
                    <Column
                        header="Movie Poster"
                        body={(rowData) => (
                            <Image height={130} width={100} src={rowData.movieImageURl} style={{ borderRadius: "8px", objectFit: "cover" }} alt="Movie_poster" />
                        )}
                    />
                    <Column header="Action" body={(rowData) => (<FaEdit onClick={async () => {
                        setMovieAddFormShow(true);
                        const editModeRes = await axios.get(`${API_ADMIN_URL}/getSingleMovie/${rowData._id}`, {
                            withCredentials: true
                        });
                        const movie = editModeRes?.data?.data;
                        const originalDate = new Date(movie.releaseDate);
                        originalDate.setDate(originalDate.getDate() + 1);
                        const formattedDate = originalDate.toISOString().split("T")[0];
                        setMovieDataObj({
                            ...movie,
                            releaseDate: formattedDate
                        });
                        setMovieLanguage(movie.movieLanguage)
                        setMovieType(movie.movieType)
                        setCast(movie.cast)
                    }} style={{ cursor: "pointer" }} />)} />
                </DataTable>
            </div>

            <Modal
                show={movieAddFormShow}
                onHide={resetForm}
                contentClassName="admin_form"
                centered
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 admin_form_heading">{formStep === 1 ? 'Movie Detail' : 'Casting Detail'}</h5>
                    <CgClose size={24} onClick={resetForm} style={{ cursor: "pointer" }} />
                </Modal.Header>
                <Modal.Body>
                    <div className="admin_form_line w-100 mb-3"></div>
                    <form>
                        {formStep === 1 && (
                            <>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Movie Title</label>
                                        <input type="text" className="form-control" name="title" onChange={handleChangefun} value={movieDataObj?.title || ''} placeholder="Enter movie title" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label" >Release Date</label>
                                        <input type="date" name="releaseDate" onChange={handleChangefun} value={movieDataObj?.releaseDate || ''} className="form-control" />
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Movie Duration</label>
                                        <input type="text" className="form-control" name="duration" onChange={handleChangefun} value={movieDataObj?.duration || ''} placeholder="Enter movie duration" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label admin_form_label">Movie Description</label>
                                        <textarea className="form-control custom-textarea" name="about" onChange={handleChangefun} value={movieDataObj?.about || ''} placeholder="Enter movie description" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label admin_form_label">Movie Poster Image</label>
                                        <input type="file" name="movieImageURl" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setMovieDataObj((prev) => ({ ...prev, movieImageURl: file }));
                                            }
                                        }} className="form-control" />
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
                                            <div className="mt-3 d-flex flex-wrap align-items-center gap-2">
                                                {movieType.map((item, index) => (
                                                    <div className="admin_val_Add" key={index}>{item.type} <IoMdCloseCircle onClick={() => {
                                                        const updated = [...movieType];
                                                        updated.splice(index, 1);
                                                        setMovieType(updated);
                                                    }}
                                                        style={{ cursor: 'pointer' }} /> </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3 d-flex flex-column">
                                        <label className="form-label admin_form_label">Movie Language</label>
                                        <div className="d-flex gap-2">
                                            <div className="col-md-10">
                                                <input type="text" value={movieLanguageVal || ''} name="language" onChange={(e) => {
                                                    setMovieLanguageVal(e.target.value)
                                                }} className="form-control" placeholder="Enter movie type" />
                                            </div>
                                            <div className="col-md-2">
                                                <button type="button" onClick={addMovieLanguage} className="btn btn-secondary">Add</button>
                                            </div>
                                        </div>

                                        {movieLanguage.length > 0 && (
                                            <div className="mt-3 d-flex flex-wrap align-items-center gap-2">
                                                {movieLanguage.map((item, index) => (
                                                    <div className="admin_val_Add" key={index}>{item.language} <IoMdCloseCircle onClick={() => {
                                                        const updated = [...movieLanguage];
                                                        updated.splice(index, 1);
                                                        setMovieLanguage(updated);
                                                    }}
                                                        style={{ cursor: 'pointer' }} /> </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        {formStep === 2 && (
                            <>
                                <div className="row mb-3">
                                    <div className="d-flex align-items-end gap-2 w-100 my-2">
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="form-label">Actor/Actress Name</label>
                                            <input type="text" name="actor" value={castVal?.actor?.toString() || ''} onChange={handleChange} className="form-control" placeholder="Enter Character real name" />
                                        </div>
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="form-label">Role</label>
                                            <input type="text" name="role" value={castVal?.role?.toString() || ''} onChange={handleChange} className="form-control" placeholder="Enter role" />
                                        </div>
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="form-label">Image</label>
                                            <input type="file" name="imageUrl" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setCastVal((prev) => ({ ...prev, imageUrl: file }));
                                                }
                                            }}
                                                className="form-control" placeholder="Enter role" />
                                        </div>
                                        <div>
                                            <button type="button" className="btn btn-secondary" onClick={addMovieCast}> Add </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {cast && cast.length > 0 && (
                                        <div className="mt-3">
                                            <div className="w-100">
                                                <DataTable value={cast} rows={10}>
                                                    <Column header="No." body={(_, options) => options.rowIndex + 1} />
                                                    <Column field="actor" header="Actor/Actress Name" />
                                                    <Column field="role" header="Role" /><Column
                                                        header="Action"
                                                        body={(rowData) => (
                                                            <IoMdCloseCircle
                                                                onClick={() => {
                                                                    const idVal = rowData.id || rowData._id;
                                                                    setCast(prev => prev.filter(item => (item.id || item._id) !== idVal));
                                                                }}
                                                                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                                                            />
                                                        )}
                                                    />
                                                </DataTable>
                                            </div>
                                        </div>
                                    )}
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
                                <button type="submit" className="admin_form_btn px-4 py-2" onClick={submitform}>Submit</button>
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