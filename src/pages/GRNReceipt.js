import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GRNReceipt() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [grn, setGrn] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGRN = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/purchases/${id}`);
                setGrn(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGRN();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Loading Receipt...</div>;
    if (!grn) return <div className="text-center mt-5 text-danger">Receipt Not Found!</div>;

    return (
        <div className="container mt-4">
            <style>
                {`
                @media print {
                    .sidebar, .navbar, nav, .btn, .no-print, aside {
                        display: none !important;
                    }
                    #printableArea {
                        width: 100% !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        margin: 0 !important;
                        padding: 20px !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    body {
                        background-color: white !important;
                    }
                }
                `}
            </style>

            <div className="card shadow p-4" id="printableArea">
                <h2 className="text-center border-bottom pb-3 fw-bold">GRN RECEIPT</h2>
                <div className="row mt-4">
                    <div className="col-6">
                        <p><strong>GRN ID:</strong> #{grn.id}</p>
                        <p><strong>Supplier:</strong> {grn.supplier_name}</p>
                    </div>
                    <div className="col-6 text-end">
                        <p><strong>Date:</strong> {new Date(grn.purchase_date).toLocaleDateString()}</p>
                    </div>
                </div>
                <table className="table table-bordered mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Medicine</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{grn.medicine_name}</td>
                            <td className="text-center">{grn.quantity}</td>
                            <td className="text-end">Rs. {grn.unit_price}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4 text-end">
                    <h5 className="fw-bold">Total: Rs. {(grn.quantity * grn.unit_price).toFixed(2)}</h5>
                </div>
            </div>

            
            <div className="text-center mt-4 mb-5 no-print">
                {/* Print Button */}
                <button className="btn btn-success px-4 me-3 shadow" onClick={() => window.print()}>
                    <i className="fa fa-print me-2"></i> Print Receipt
                </button>

                {/* Back Button */}
                <button className="btn btn-primary px-4 shadow" onClick={() => navigate(-1)}>
                    <i className="fa fa-arrow-left me-2"></i> Back 
                </button>
            </div>
        </div>
    );
}