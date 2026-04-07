import React, { useState, useEffect } from 'react';
import { getPurchaseHistory } from '../services/restockService';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { Link } from 'react-router-dom'; 

export default function PurchaseHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getPurchaseHistory();
                setHistory(data);
            } catch (err) {
                toast.error("Failed to load history!");
            }
        };
        fetchHistory();
    }, []);

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text("Agency Purchase History Report", 14, 20);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            const tableColumn = ["Date", "Medicine Name", "Supplier", "Quantity"];
            const tableRows = history.map(item => [
                new Date(item.purchase_date).toLocaleDateString(),
                item.medicine_name,
                item.supplier_name,
                item.quantity
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] }
            });

            doc.save(`Purchase_Report_${new Date().toLocaleDateString()}.pdf`);
            toast.success("PDF Downloaded Successfully! 📄");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Could not generate PDF.");
        }
    };

    return (
        <div className="container py-4">
            <div className="card border-0 shadow-sm p-4 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold m-0">
                        <i className="fa fa-history me-2 text-primary"></i>Stock Purchase History
                    </h3>
                    
                    <button 
                        className="btn btn-danger fw-bold shadow-sm" 
                        onClick={downloadPDF}
                        disabled={history.length === 0}
                    >
                        <i className="fa fa-file-pdf me-2"></i> Download PDF Report
                    </button>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Date & Time</th>
                                <th>Medicine Name</th>
                                <th>Supplier</th>
                                <th className="text-center">Qty Received</th>
                                <th className="text-center">Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((item) => (
                                <tr key={item.id}>
                                    <td className="small">{new Date(item.purchase_date).toLocaleString()}</td>
                                    <td className="fw-bold text-dark">{item.medicine_name}</td>
                                    <td><span className="badge bg-info text-dark">{item.supplier_name}</span></td>
                                    <td className="text-center fw-bold text-success">+{item.quantity}</td>
                                    <td className="text-center">
                                    
                                        <Link 
                                            to={`/grn/${item.id}`} 
                                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                        >
                                            <i className="fa fa-print me-1"></i> Print GRN
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center text-muted py-4">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}