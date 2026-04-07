import React, { useEffect, useState } from 'react';
import { getMedicines, deleteMedicine } from '../services/medicineService';
import { toast } from 'react-toastify'; 

export default function MedicineList() {
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getMedicines();
            setMedicines(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load inventory data!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            try {
                await deleteMedicine(id);
                alert("Medicine deleted successfully!");
                fetchData();
            } catch (error) {
                const msg = error.response?.data?.error || "Failed to delete the medicine.";
                alert(msg); 
            }
        }
    };

    // --- Search Logic  ---
    const filteredMedicines = medicines.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Inventory Dashboard</h2>
                
            
                <div className="col-md-4">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="fa fa-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0" 
                            placeholder="Search by name or brand..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card shadow border-0 rounded-3">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Qty</th>
                                    <th>Price (Rs)</th>
                                    <th>Expiry Date</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.length > 0 ? (
                                    filteredMedicines.map((item) => (
                                        <tr key={item.id}>
                                            <td className="fw-bold">{item.name}</td>
                                            <td>{item.brand}</td>
                                            <td>
                                                <span className={`badge ${item.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                                                    {item.stock}
                                                </span>
                                            </td>
                                            <td>{parseFloat(item.price || 0).toFixed(2)}</td>
                                            <td>{new Date(item.expireDate).toLocaleDateString()}</td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <i className="fa fa-trash me-1"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-5">
                                            {searchTerm ? `No results found for "${searchTerm}"` : "No medicines found in the inventory."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}