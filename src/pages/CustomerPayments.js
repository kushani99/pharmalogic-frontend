import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export default function CustomerPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true); 

    const fetchPayments = async () => {
        try {
            setLoading(true);
            
            const res = await axios.get('http://localhost:5000/api/customer-payments/report');
            setPayments(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const downloadPDF = () => {
        const doc = new jsPDF(); 
        doc.text("Pharmacy Payments Report (Income)", 14, 15);
        
    
        const tableRows = payments.map(p => [
            p.order_id || 'N/A',
            p.pharmacy_name || 'Unknown',
            `Rs. ${parseFloat(p.amount || 0).toLocaleString()}`, 
            p.method || 'Cash',
            p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'
        ]);

        autoTable(doc, {
            startY: 25,
            head: [['Order ID', 'Pharmacy', 'Amount', 'Method', 'Date']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [40, 167, 69] } 
        });
        doc.save("Pharmacy_Payment_Report.pdf");
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">Pharmacy Payments (Income)</h3>
                <button className="btn btn-danger shadow-sm fw-bold" onClick={downloadPDF} disabled={payments.length === 0}>
                    Download PDF Report
                </button>
            </div>
            
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Order ID</th>
                                <th>Pharmacy</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-2 text-muted">Loading payments data...</p>
                                    </td>
                                </tr>
                            ) : payments.length > 0 ? (
                                payments.map((p, index) => (
                                    <tr key={index}>
                                        
                                        <td className="ps-4 fw-bold text-secondary">{p.order_id}</td>
                                        
                                        
                                        <td className="fw-bold">{p.pharmacy_name}</td>
                                        
                        
                                        <td className="text-success fw-bold">
                                            Rs. {parseFloat(p.amount || 0).toLocaleString()}
                                        </td>
                                        
                                        
                                        <td>
                                            <span className="badge bg-info-subtle text-info px-3 rounded-pill">
                                                {p.method}
                                            </span>
                                        </td>
                                        
                                        
                                        <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}