"use client";
import "../../css/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from "react";
import { API_ADMIN_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaEdit } from "react-icons/fa";


interface CityData {
    id: Number,
    city: String,
    state: String,
    country: String,
    isUserMatch: Boolean
}


const AdminCity = () => {
    const [city, setCity] = useState<CityData[]>([]);

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
    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>City Management</div>
                <div>
                    <button className="admin_city_add">Add City</button>
                </div>
            </div>

            <DataTable value={city} rows={10} tableStyle={{ minWidth: '50rem' }} sortOrder={-1}>
                <Column header="No." body={(rowData, options) => options.rowIndex + 1}   ></Column>
                <Column field="city" header="City" sortable></Column>
                <Column field="state" header="State" sortable></Column>
                <Column field="country" header="Country" sortable ></Column>
                <Column header="Action" body={(rowData)=>(
                    rowData.isUserMatch? <FaEdit/>:null
                )} ></Column>
            </DataTable>

            <ToastContainer />
        </div>
    )
}


export default AdminCity;