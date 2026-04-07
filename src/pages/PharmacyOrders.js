import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

export default function PharmacyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 


    const fetchOrders = async () => {
        setLoading(true);
        try {
           const response = await axios.get('http://localhost:5000/api/orders');
            
            const activeOrders = response.data.filter(order => order.delivery_status !== 'Delivered');
            setOrders(activeOrders);
        } catch (error) {
            toast.error("Error loading orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleMarkAsPaid = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/mark-paid/${id}`, { method: 'Cash' });
            toast.success("Order marked as Paid!");
            fetchOrders(); 
        } catch (error) {
            toast.error("Failed to update payment status");
        }
    };


    const handleMarkAsDelivered = async (id) => {
        try {
            
            await axios.put(`http://localhost:5000/api/orders/update-delivery/${id}`, { status: 'Delivered' });
            
            
            toast.success("Order Delivered Successfully!");

            
            setTimeout(() => {
                navigate('/order-history'); 
            }, 1500);

        } catch (error) {
            toast.error("Failed to update delivery status");
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">Current Pharmacy Orders</h3>
                <span className="badge bg-primary px-3 py-2 rounded-pill">Orders: {orders.length}</span>
            </div>
            
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Loading current orders...</p>
                </div>
            ) : (
                <div className="row">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
                                <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className="badge bg-light text-dark border">#{(order.id || 0) + 1000}</span>
                                        <span className={`badge rounded-pill px-3 ${order.status === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                    
                                    <h5 className="fw-bold text-dark mb-1">{order.pharmacy_name}</h5>
                                    <p className="text-muted small mb-3">Ordered on: {new Date(order.order_date).toLocaleDateString()}</p>
                                    
                                    <div className="bg-light p-2 rounded-3 mb-3">
                                        <p className="mb-0 small"><strong>Medicine:</strong> {order.medicine_name}</p>
                                        <p className="mb-0 small"><strong>Quantity:</strong> {order.quantity}</p>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                                        <span className="fw-bold text-primary fs-5">Rs. {parseFloat(order.total_amount || 0).toLocaleString()}</span>
                                        <div className="d-flex gap-2">
                                            
                                            {order.status !== 'Paid' && (
                                                <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => handleMarkAsPaid(order.id)}>
                                                    Pay
                                                </button>
                                            )}
                                    
                                            <button className="btn btn-sm btn-primary px-3 rounded-pill shadow-sm" onClick={() => handleMarkAsDelivered(order.id)}>
                                                <i className="fa fa-truck me-1"></i> Deliver
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <i className="fa fa-check-circle text-success fs-1 mb-3 opacity-25"></i>
                            <p className="text-muted">All orders have been delivered!</p>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/order-history')}>View History</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}