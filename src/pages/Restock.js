import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { updateStock } from '../services/restockService';

export default function Restock() {
    const [medicines, setMedicines] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        medicine_id: '',
        supplier_id: '',
        quantity: '',
        unit_price: '' 
    });
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const medsRes = await axios.get('http://localhost:5000/api/medicines');
                const suppsRes = await axios.get('http://localhost:5000/api/suppliers');
                setMedicines(medsRes.data);
                setSuppliers(suppsRes.data);
            } catch (err) {
                toast.error("Failed to load data!");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    

    console.log("Sending Data:", formData); 

    try {
        await updateStock(formData);
        toast.success("Stock updated successfully!");
        setFormData({ medicine_id: '', supplier_id: '', quantity: '', unit_price: '' });
    } catch (err) {
        toast.error("Failed to update stock.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="container py-4">
            <div className="card border-0 shadow-lg p-4 rounded-4 bg-white mx-auto" style={{ maxWidth: '600px' }}>
                <h3 className="fw-bold text-center mb-4 text-primary">Agency Restock</h3>
                
                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Select Medicine</label>
                        <select 
                            className="form-select" 
                            required 
                            value={formData.medicine_id}
                            onChange={(e) => setFormData({...formData, medicine_id: e.target.value})}
                        >
                            <option value="">-- Choose Medicine --</option>
                            {medicines.map(med => (
                                <option key={med.id} value={med.id}>{med.name} (Current: {med.stock})</option>
                            ))}
                        </select>
                    </div>

        
                    <div className="mb-3">
                        <label className="form-label fw-bold">Select Supplier</label>
                        <select 
                            className="form-select" 
                            required 
                            value={formData.supplier_id}
                            onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                        >
                            <option value="">-- Choose Supplier --</option>
                            {suppliers.map(sup => (
                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                            ))}
                        </select>
                    </div>

                    
                    <div className="mb-3">
                        <label className="form-label fw-bold">Received Quantity</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Enter amount" 
                            required
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                    </div>

    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Unit Price (Rs.)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            className="form-control" 
                            placeholder="Enter price per unit" 
                            required
                            value={formData.unit_price}
                            onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                        />
                    </div>
                

                    <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading}>
                        {loading ? "Updating..." : "Update Agency Stock"}
                    </button>
                </form>
            </div>
        </div>
    );
}