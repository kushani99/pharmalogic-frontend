import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addSupplierPayment, getSupplierPayments } from '../services/paymentService';

export default function SupplierPayments() {
    const [outPayments, setOutPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        supplier: '',
        amount: '',
        method: 'Cash',
        ref: ''
    });

    // Fetch payments from Database on component load
    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await getSupplierPayments();
            setOutPayments(data);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to load payment records from database");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        
        const paymentData = {
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD
        };

        try {
            // Save to Database via Backend API
            await addSupplierPayment(paymentData);
            
            toast.success("Payment saved to database successfully! ✅");
            
            // Clear form and refresh table
            setFormData({ supplier: '', amount: '', method: 'Cash', ref: '' });
            fetchPayments(); 
        } catch (error) {
            console.error("Save Error:", error);
            toast.error("Failed to save payment to database");
        }
    };

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-4 text-dark">Supplier Payments (Outgoing)</h3>
            
            {/* ADD PAYMENT FORM */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-3">Record New Payment</h5>
                <form onSubmit={handleAddPayment} className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Supplier Name</label>
                        <input 
                            type="text" 
                            className="form-control shadow-none" 
                            required 
                            value={formData.supplier} 
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})} 
                            placeholder="e.g. Main Agency" 
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">Amount (Rs.)</label>
                        <input 
                            type="number" 
                            className="form-control shadow-none" 
                            required 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                            placeholder="0.00" 
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">Method</label>
                        <select 
                            className="form-select shadow-none" 
                            value={formData.method} 
                            onChange={(e) => setFormData({...formData, method: e.target.value})}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-bold">Ref No.</label>
                        <input 
                            type="text" 
                            className="form-control shadow-none" 
                            value={formData.ref} 
                            onChange={(e) => setFormData({...formData, ref: e.target.value})} 
                            placeholder="TXN / Chq No" 
                        />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100 fw-bold">Add Payment</button>
                    </div>
                </form>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Supplier / Agency</th>
                                <th>Paid Amount (Rs.)</th>
                                <th>Payment Method</th>
                                <th>Reference No.</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && outPayments.map(op => (
                                <tr key={op.id}>
                                    <td className="ps-4 fw-bold">{op.supplier}</td>
                                    <td className="text-primary fw-bold">
                                        Rs. {parseFloat(op.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">{op.method}</span>
                                    </td>
                                    <td className="text-muted small">{op.ref || 'N/A'}</td>
                                    <td>{new Date(op.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted">Loading payments...</p>
                        </div>
                    )}

                    {!loading && outPayments.length === 0 && (
                        <div className="text-center py-5 text-muted">No payments recorded in the database.</div>
                    )}
                </div>
            </div>
        </div>
    );
}