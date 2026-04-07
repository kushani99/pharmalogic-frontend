import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SalesReturn() {
    const [returnData, setReturnData] = useState({
        order_id: '',
        medicine_id: '',
        quantity: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    
    // Initializing the navigate function
    const navigate = useNavigate();

    const handleReturn = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sending the return data to the backend API
            const response = await axios.post('http://localhost:5000/api/medicines/returns/add', returnData);
            
            if (response.data.success) {
                toast.success("Return processed successfully! Stock has been updated.");
                
                // Redirecting to the Return History page after 1.5 seconds
                setTimeout(() => {
                    navigate('/return-history'); 
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error processing return. Please check your IDs and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{maxWidth: '500px', margin: 'auto'}}>
                <div className="text-center mb-4">
                    <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                        <i className="fa fa-undo text-danger fa-2x"></i>
                    </div>
                    <h3 className="fw-bold">Sales Return Management</h3>
                    <p className="text-muted small">Return items and update inventory automatically</p>
                </div>

                <form onSubmit={handleReturn}>
                    <div className="mb-3">
                        <label className="small fw-bold text-secondary mb-1">Order ID</label>
                        <input 
                            type="number" 
                            className="form-control border-0 bg-light" 
                            placeholder="Enter Order ID"
                            required
                            value={returnData.order_id}
                            onChange={(e) => setReturnData({...returnData, order_id: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="small fw-bold text-secondary mb-1">Medicine ID</label>
                        <input 
                            type="number" 
                            className="form-control border-0 bg-light" 
                            placeholder="Enter Medicine ID"
                            required
                            value={returnData.medicine_id}
                            onChange={(e) => setReturnData({...returnData, medicine_id: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="small fw-bold text-secondary mb-1">Return Quantity</label>
                        <input 
                            type="number" 
                            className="form-control border-0 bg-light" 
                            placeholder="0"
                            required
                            value={returnData.quantity}
                            onChange={(e) => setReturnData({...returnData, quantity: e.target.value})}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="small fw-bold text-secondary mb-1">Reason for Return</label>
                        <textarea 
                            className="form-control border-0 bg-light" 
                            rows="3"
                            placeholder="Ex: Expired, Damaged..."
                            required
                            value={returnData.reason}
                            onChange={(e) => setReturnData({...returnData, reason: e.target.value})}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-danger w-100 fw-bold py-3 shadow-sm rounded-3" disabled={loading}>
                        {loading ? (
                            <span><i className="fa fa-spinner fa-spin me-2"></i>Processing...</span>
                        ) : (
                            "Process Return & Update Stock"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}