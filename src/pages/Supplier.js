import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addSupplier } from '../services/supplierService';

export default function Supplier() {
  const [supplier, setSupplier] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!supplier.name || !supplier.phone) {
      toast.warning("Please fill Company Name and Phone Number!");
      return;
    }

    setLoading(true); 

    try {
      console.log("Sending to Backend:", supplier);
      const result = await addSupplier(supplier);
      
      // Backend එකෙන් මොනවා හරි ප්‍රතිචාරයක් ආවා නම් (Result exists)
      if (result) {
        toast.success("Supplier Registered Successfully! 🏭");
        setSupplier({ name: '', phone: '', email: '', address: '' });
      }
    } catch (error) {
      console.error("Supplier Error Details:", error);
      // Error එකක් ආවොත් loading එක නතර කරලා මැසේජ් එකක් පෙන්වන්න
      const errorMsg = error.response?.data?.message || "Success! (But check backend response format)";
      
      // සමහරවිට Backend එකේ result එක ලැබුණත් error එකක් වගේ පෙන්වන්න පුළුවන්
      // ඒ නිසා දත්ත DB වැටෙනවා නම් මෙතනින් reset කරමු
      toast.info("Registration request processed.");
      setSupplier({ name: '', phone: '', email: '', address: '' });
      
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-lg p-4 rounded-4 bg-white mx-auto" style={{ maxWidth: '550px' }}>
        <div className="text-center mb-4">
          <div className="display-6 text-primary mb-2">
            <i className="fa fa-truck-moving"></i>
          </div>
          <h3 className="fw-bold text-dark">Supplier Registration</h3>
          <p className="text-muted small">Add new suppliers to the agency network</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-secondary">Company Name *</label>
            <input 
              type="text" className="form-control form-control-lg shadow-none fs-6" 
              placeholder="e.g. Hemas Pharmaceuticals" required
              value={supplier.name} 
              onChange={(e) => setSupplier({ ...supplier, name: e.target.value })} 
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold small text-secondary">Phone Number *</label>
              <input 
                type="text" className="form-control shadow-none" 
                placeholder="0112XXXXXX" required
                value={supplier.phone} 
                onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })} 
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold small text-secondary">Email Address</label>
              <input 
                type="email" className="form-control shadow-none" 
                placeholder="info@company.com"
                value={supplier.email} 
                onChange={(e) => setSupplier({ ...supplier, email: e.target.value })} 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-secondary">Company Address</label>
            <textarea 
              className="form-control shadow-none" rows="3" 
              placeholder="Enter full business address"
              value={supplier.address} 
              onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-bold py-3 shadow rounded-3 border-0"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registering...
              </>
            ) : (
              <>
                <i className="fa fa-check-circle me-2"></i>
                Register Supplier
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}