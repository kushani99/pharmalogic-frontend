import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/suppliers');
            setSuppliers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    
   const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
        try {
            
            await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
            alert("Deleted!");
            fetchSuppliers(); 
        } catch (err) {
            console.error("Error deleting supplier:", err);
            alert("Could not delete. Check backend console.");
        }
    }
};

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="fa fa-truck text-primary fa-2x"></i>
                </div>
                <div>
                    <h2 className="fw-bold mb-0 text-dark">Supplier Directory</h2>
                    <p className="text-muted mb-0">List of all registered pharmaceutical suppliers</p>
                </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3">Company Name</th>
                                <th>Phone Number</th>
                                <th>Email Address</th>
                                <th>Address</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">Loading data...</td></tr>
                            ) : suppliers.length > 0 ? (
                                suppliers.map((s, index) => (
                                    <tr key={index}>
                                        <td className="px-4 fw-bold text-dark">{s.name}</td>
                                        <td className="text-secondary">{s.phone}</td>
                                        <td>{s.email}</td>
                                        <td className="text-muted small">{s.address}</td>
                                        <td className="text-center">
                                            <span className="badge bg-success-subtle text-success rounded-pill px-3">Active</span>
                                        </td>
                                        <td className="text-center">
                                            
                                            <button 
                                                className="btn btn-sm btn-outline-danger border-0" 
                                                onClick={() => handleDelete(s.id)} 
                                                title="Delete Supplier"
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No suppliers found in the database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}