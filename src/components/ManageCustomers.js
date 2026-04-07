import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    location: '', 
    phone: '', 
    email: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pharmacies/all');
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("Do you want to delete this customer?")) {
        try {
            
            await axios.delete(`http://localhost:5000/api/pharmacies/${id}`);
            alert("Customer deleted!");
            fetchCustomers(); 
        } catch (err) {
            console.error(err);
        }
    }
};
  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/pharmacies', formData);
      setFormData({ name: '', location: '', phone: '', email: '' });
      fetchCustomers(); 
      alert("Customer details saved!");
    } catch (err) {
      alert("Failed to save.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">Customer Management</h3>

      
      <div className="card shadow-sm border-0 p-4 mb-5 rounded-4 bg-light">
        <h5 className="fw-bold mb-3"><i className="fa fa-hospital me-2"></i>Register New Pharmacy</h5>
        <form onSubmit={handleSave} className="row g-3">
          <div className="col-md-3">
            <label className="small fw-bold">Pharmacy Name</label>
            <input type="text" className="form-control border-0 shadow-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">Phone Number</label>
            <input type="text" className="form-control border-0 shadow-sm" value={formData.phone} maxLength="10" onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} required />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">Location</label>
            <input type="text" className="form-control border-0 shadow-sm" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">Email (Optional)</label>
            <input type="email" className="form-control border-0 shadow-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="col-md-12 text-end">
            <button type="submit" className="btn btn-primary px-5 fw-bold shadow-sm" disabled={isLoading}>{isLoading ? 'Saving...' : 'Add Now'}</button>
          </div>
        </form>
      </div>

      
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="ps-3">ID</th>
                <th>PHARMACY NAME</th>
                <th>LOCATION</th>
                <th>PHONE</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                
                  <td className="ps-3 text-muted">{c.id}</td> 
                  <td className="fw-bold">{c.name}</td>
                  <td>{c.location}</td>
                  <td>{c.phone}</td>
                  <td className="text-center">
                    
                    <button 
                      type="button"
                      className="btn btn-sm btn-light text-danger"
                      onClick={() => handleDelete(c.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}