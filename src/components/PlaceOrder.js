import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PlaceOrder() {
    const [pharmacies, setPharmacies] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [form, setForm] = useState({ pharmacy_id: '', medicine_id: '', quantity: '' });

    const navigate = useNavigate(); 

    useEffect(() => {
    
        axios.get('http://localhost:5000/api/pharmacies/all').then(res => setPharmacies(res.data));
        axios.get('http://localhost:5000/api/medicines/all').then(res => setMedicines(res.data));
    }, []);

    const generateInvoice = (orderForm) => {
        try {
            const doc = new jsPDF();
            
            
            const selectedPharmacy = pharmacies.find(p => Number(p.id) === Number(orderForm.pharmacy_id));
            const selectedMedicine = medicines.find(m => Number(m.id) === Number(orderForm.medicine_id));

        
            doc.setFontSize(22);
            doc.setTextColor(0, 102, 204); 
            doc.text("PHARMALOGIC INVOICE", 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Pharmacy: ${selectedPharmacy ? selectedPharmacy.name : 'N/A'}`, 14, 35);
            doc.line(14, 40, 196, 40);

            
            const unitPrice = selectedMedicine ? Number(selectedMedicine.price) : 0;
            const qty = Number(orderForm.quantity);
            const total = unitPrice * qty;

            const tableColumn = ["Description", "Quantity", "Unit Price", "Total"];
            const tableRows = [
                [
                    selectedMedicine ? selectedMedicine.name : 'Unknown Medicine',
                    qty,
                    `Rs. ${unitPrice.toFixed(2)}`,
                    `Rs. ${total.toFixed(2)}`
                ]
            ];


            autoTable(doc, {
                startY: 50,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [0, 102, 204] }
            });

            
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`Net Total: Rs. ${total.toFixed(2)}`, 140, finalY);

            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("This is a computer generated invoice.", 14, finalY + 20);

            
            const fileName = selectedPharmacy ? `Invoice_${selectedPharmacy.name.replace(/\s+/g, '_')}.pdf` : 'Invoice.pdf';
            doc.save(fileName);

        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Could not generate PDF bill");
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        
        if (Number(form.quantity) <= 0) {
            toast.warning("Please enter a valid quantity");
            return;
        }

        try {

            const response = await axios.post('http://localhost:5000/api/orders/add', form);
            
        
            if(response.status === 201 || response.data.success) { 
                toast.success("Order Placed Successfully!");
                
                
                generateInvoice(form);
                
            
                setTimeout(() => {
                    navigate('/order-history');
                }, 2000); 
            }
        } catch (err) { 
            console.error("Order Error:", err);
            toast.error("Failed to place order. Please try again."); 
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4 border-0 rounded-4" style={{maxWidth: '500px', margin: 'auto'}}>
                <div className="text-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                        <i className="fa fa-shopping-cart text-primary fa-2x"></i>
                    </div>
                    <h3 className="fw-bold">New Pharmacy Order</h3>
                    <p className="text-muted small">Select items to generate instant invoice</p>
                </div>
                
                <form onSubmit={handleOrder}>
                    <div className="mb-3">
                        <label className="small fw-bold text-secondary mb-1">Select Pharmacy Target</label>
                        <select 
                            className="form-select border-0 bg-light py-2" 
                            required 
                            value={form.pharmacy_id}
                            onChange={e => setForm({...form, pharmacy_id: e.target.value})}
                        >
                            <option value="">-- Choose Pharmacy --</option>
                            {pharmacies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="small fw-bold text-secondary mb-1">Select Medicine</label>
                        <select 
                            className="form-select border-0 bg-light py-2" 
                            required 
                            value={form.medicine_id}
                            onChange={e => setForm({...form, medicine_id: e.target.value})}
                        >
                            <option value="">-- Choose Medicine --</option>
                            {medicines.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name} - (Rs. {Number(m.price).toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="small fw-bold text-secondary mb-1">Order Quantity</label>
                        <input 
                            type="number" 
                            className="form-control border-0 bg-light py-2" 
                            required 
                            min="1"
                            value={form.quantity} 
                            onChange={e => setForm({...form, quantity: e.target.value})} 
                            placeholder="Enter amount" 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-3 shadow-sm rounded-3">
                        <i className="fa fa-file-invoice-dollar me-2"></i> Confirm & Download Bill
                    </button>
                </form>
            </div>
        </div>
    );
}