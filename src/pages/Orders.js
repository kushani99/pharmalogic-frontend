import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // කෙලින්ම axios පාවිච්චි කරමු ප්‍රශ්නය කොහෙද කියලා හොයාගන්න ලේසි වෙන්න
            const res = await axios.get('http://localhost:5000/api/orders/all');
            console.log("Data from Backend:", res.data); // Debugging වලට මේක වැදගත්
            setOrders(res.data);
        } catch (error) {
            toast.error("Failed to load orders. Check Backend connection.");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (order) => {
        const doc = new jsPDF();
        
        // Header styling
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185);
        doc.text("PHARMALOGIC - INVOICE", 14, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 14, 30);
        
        const pName = order.customer_name || order.pharmacy_name || 'Unknown Pharmacy';
        doc.text(`Customer: ${pName}`, 14, 35);
        doc.text(`Invoice No: INV-00${order.id}`, 14, 40);

        // calculation
        const price = parseFloat(order.unit_price || order.price || 0);
        const qty = parseInt(order.quantity || 0);
        const total = order.total_amount || (price * qty);

        const tableColumn = ["Medicine Name", "Qty", "Unit Price", "Total"];
        const tableRows = [
            [
                order.medicine_name || 'N/A', 
                qty, 
                `Rs. ${price.toFixed(2)}`, 
                `Rs. ${parseFloat(total).toLocaleString()}`
            ]
        ];

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`Invoice_${order.id}.pdf`);
        toast.success("Invoice Downloaded!");
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">Pharmacy Orders History</h3>
                <button className="btn btn-primary btn-sm px-3" onClick={fetchOrders}>
                    <i className="fa fa-refresh me-2"></i>Refresh Data
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted small fw-bold">
                            <tr>
                                <th className="ps-4">ORDER ID</th>
                                <th>PHARMACY</th>
                                <th>MEDICINE</th>
                                <th>QTY</th>
                                <th>STATUS</th>
                                <th className="text-end pe-4">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">Loading...</td></tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="ps-4 text-muted">#00{order.id}</td>
                                        <td className="fw-bold">
                                            
                                            {order.customer_name || order.pharmacy_name}
                                        </td>
                                        <td>{order.medicine_name}</td>
                                        <td>{order.quantity}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${order.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button 
                                                className="btn btn-sm btn-outline-danger border-2 fw-bold"
                                                onClick={() => downloadInvoice(order)}
                                            >
                                                PDF Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <p className="text-muted mb-0">No records found. Check your API or Database.</p>
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