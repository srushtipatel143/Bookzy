"use client";
import "../../css/cityadmin.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const AdminCity = () => {
    return (
        <div className="container-fluid m-3 admin_div">
            <div className="admin_div_mainsec m-3">
                <div>City Management</div>
                <div>
                    <button className="admin_city_add">Add City</button>
                </div>
            </div>

            <DataTable sortOrder={-1} tableStyle={{ minWidth: '50rem' }}>
                 <Column header="No." sortable ></Column>
                <Column header="City" sortable></Column>
                <Column header="State" sortable></Column>
                <Column header="Country" sortable ></Column>
            </DataTable>
        </div>
    )
}

export default AdminCity;