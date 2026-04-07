import React, { useState } from 'react';
import { addMedicine } from '../services/medicineService'; 
import { useNavigate } from 'react-router-dom'; 

export default function AddItem() {
  const navigate = useNavigate();

  // 1. Initial State 
  const [formData, setFormData] = useState({ 
    itemName: '', 
    brand: '', 
    qty: '', 
    price: '', 
    expire: '',
    category: 'Tablet' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 2. Function to handle form submission
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = {
      name: formData.itemName,
      brand: formData.brand,
      stock: formData.qty,
      price: formData.price,
      expireDate: formData.expire,
      category: formData.category   
    };

    try {
      // API call to Backend
      await addMedicine(dataToSend);
      
      setIsLoading(false); 
      setShowToast(true);  

      
      setTimeout(() => {
        setShowToast(false);
        navigate('/inventory'); 
      }, 1500);

      
      setFormData({ itemName: '', brand: '', qty: '', price: '', expire: '', category: 'Tablet' });

    } catch (error) {
      console.error("Error saving medicine:", error);
      setIsLoading(false);
      alert("Failed to save data. Please check if the Backend is running.");
    }
  };

  return (
    <div className="container py-5 position-relative">
      
      {/* Success Toast Notification */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 9999 }}>
          <div className="card border-0 shadow-lg bg-success text-white px-3 py-2 animate__animated animate__fadeInRight" style={{ borderRadius: '15px', minWidth: '280px' }}>
            <div className="card-body d-flex align-items-center">
              <i className="fa fa-check-circle fs-3 me-3"></i>
              <div>
                <h6 className="mb-0 fw-bold">Success!</h6>
                <small className="opacity-75">Medicine added successfully.</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className={`card shadow border-0 p-2 ${isLoading ? 'opacity-75' : ''}`} style={{ transition: '0.3s' }}>
            
            <div className="card-header bg-white py-4 text-center border-0">
              <div className="mb-3">
                <div className="bg-primary bg-opacity-10 d-inline-block p-3 rounded-circle">
                  <i className="fa fa-pills text-primary fa-2x"></i>
                </div>
              </div>
              <h3 className="fw-bold text-dark mb-1">Add New Stock</h3>
              <p className="text-muted small">Update your pharmacy inventory with new items</p>
            </div>

            <div className="card-body px-4 pb-4 pt-0">
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  
                  {/* Medicine Name */}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Medicine Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><i className="fa fa-tag text-muted"></i></span>
                      <input 
                        type="text" 
                        className="form-control bg-light border-0" 
                        placeholder="Ex: Panadol 500mg"
                        value={formData.itemName}
                        onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                        disabled={isLoading}
                        required 
                      />
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Brand / Company</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><i className="fa fa-building text-muted"></i></span>
                      <input 
                        type="text" 
                        className="form-control bg-light border-0" 
                        placeholder="Ex: GSK Lanka"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        disabled={isLoading}
                        required 
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="col-12">
                    <label className="form-label fw-bold small text-secondary">Category</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><i className="fa fa-list text-muted"></i></span>
                      <select 
                        className="form-select bg-light border-0"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        disabled={isLoading}
                        required
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Injection">Injection</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Cream">Cream</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Qty, Price, Expire */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-secondary">Qty</label>
                    <input type="number" className="form-control bg-light border-0" value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} disabled={isLoading} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-secondary">Price (Rs)</label>
                    <input type="number" className="form-control bg-light border-0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} disabled={isLoading} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-secondary">Expiry</label>
                    <input type="date" className="form-control bg-light border-0 px-2" value={formData.expire} onChange={(e) => setFormData({...formData, expire: e.target.value})} disabled={isLoading} required />
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center" disabled={isLoading} style={{ height: '48px' }}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save me-2"></i> Save to Inventory
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}