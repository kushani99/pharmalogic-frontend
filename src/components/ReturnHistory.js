import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ReturnHistory() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchReturnHistory = async () => {
        setLoading(true);
        try {
            
            const response = await axios.get('http://localhost:5000/api/medicines/returns/all');
            
            
            setReturns(response.data);
            console.log("Data loaded successfully:", response.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            toast.error("Failed to load return history.");
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchReturnHistory();
    }, []);

    return (
        <div className="container-fluid mt-4">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">Sales Return History</h2>
                
                <button 
                    className="btn btn-primary shadow-sm" 
                    onClick={fetchReturnHistory} 
                    disabled={loading}
                >
                    <i className={`fa fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                    {loading ? "Refreshing..." : "Refresh Data"}
                </button>
            </div>

        
            <div className="table-responsive shadow-sm rounded-3 border">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th className="py-3">Return ID</th>
                            <th className="py-3">Order ID</th>
                            <th className="py-3">Medicine Name</th>
                            <th className="py-3 text-center">Qty</th>
                            <th className="py-3 text-center">Reason</th>
                            <th className="py-3">Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.length > 0 ? (
                            returns.map((item, index) => (
                                <tr key={index}>
                                    
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {item.return_id}
                                        </span>
                                    </td>

                                
                                    <td className="fw-bold">{item.order_id}</td>

                                    
                                    <td>
                                        {item.medicine_name ? (
                                            item.medicine_name
                                        ) : (
                                            <span className="text-muted italic small">Not Found (ID: {item.medicine_id})</span>
                                        )}
                                    </td>

                                    
                                    <td className="text-center fw-bold text-primary">
                                        {item.qty}
                                    </td>

                                
                                    <td className="text-center">
                                        <span className="badge rounded-pill bg-warning text-dark px-3" style={{fontSize: '12px'}}>
                                            {item.reason}
                                        </span>
                                    </td>

                                    
                                    <td>
                                        {item.return_date ? (
                                            <div style={{ lineHeight: '1.2' }}>
                                                <div className="fw-bold small">
                                                    {new Date(item.return_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                                    {new Date(item.return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ) : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    {loading ? (
                                        <span><i className="fa fa-spinner fa-spin me-2"></i>Loading...</span>
                                    ) : "No return records found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}