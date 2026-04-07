import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExpiredItems() {
    const [expiredMeds, setExpiredMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeds = async () => {
            try {
        
                const res = await axios.get('http://localhost:5000/api/medicines');
                const today = new Date().toISOString().split('T')[0];
                
            
                const filtered = res.data.filter(item => item.expireDate && item.expireDate < today);
                setExpiredMeds(filtered);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching expired meds:", err);
                setLoading(false);
            }
        };
        fetchMeds();
    }, []);

    return (
        <div className="container py-4">
        
            <div className="d-flex align-items-center mb-4">
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                    <i className="fa fa-calendar-times text-danger fa-2x"></i>
                </div>
                <div>
                    <h2 className="fw-bold mb-0 text-dark">Expired Inventory</h2>
                    <p className="text-muted mb-0">List of medicines that have passed their expiry date</p>
                </div>
            </div>


            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3">Medicine Name</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Expiry Date</th>
                                <th>Stock Left</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">Loading data...</td></tr>
                            ) : expiredMeds.length > 0 ? (
                                expiredMeds.map((med, index) => (
                                    <tr key={index}>
                                        <td className="px-4 fw-bold">{med.name}</td>
                                        <td>{med.brand}</td>
                                        <td><span className="badge bg-info bg-opacity-10 text-info px-3">{med.category || 'N/A'}</span></td>
                                        <td className="text-danger fw-bold">{new Date(med.expireDate).toLocaleDateString()}</td>
                                        <td>{med.stock}</td>
                                        <td><span className="badge bg-danger">Expired</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        <i className="fa fa-check-circle text-success fa-3x mb-3"></i>
                                        <p className="fs-5 mb-0">No expired medicines found in inventory!</p>
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