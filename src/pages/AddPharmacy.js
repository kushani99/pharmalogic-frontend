import React, { useState } from 'react';
import { addPharmacy } from '../services/pharmacyService'; 

export default function AddPharmacy() {
  const [pharmacyName, setPharmacyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false); 

  const handlePharmacySave = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const pharmacyData = { 
      name: pharmacyName, 
      owner: ownerName, 
      location: address, 
      phone: contact,
      email: "" 
    };

    try {
      
      await addPharmacy(pharmacyData);
      
      alert("Pharmacy successfully registered to Database! ✅");
      
      
      setPharmacyName('');
      setOwnerName('');
      setAddress('');
      setContact('');
    } catch (error) {
      console.error("Error saving pharmacy:", error);
      alert("Failed to save pharmacy. Please check your backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ maxWidth: '600px', margin: 'auto' }}>
        <h3 className="text-center text-primary mb-4 fw-bold">Register New Pharmacy</h3>
        <form onSubmit={handlePharmacySave}>
          <div className="mb-3">
            <label className="form-label fw-bold">Pharmacy Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={pharmacyName} 
              onChange={(e) => setPharmacyName(e.target.value)} 
              required 
              placeholder="Ex: City Pharma"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Owner's Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={ownerName} 
              onChange={(e) => setOwnerName(e.target.value)} 
              required 
              placeholder="Enter owner's name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Business Address / Location</label>
            <textarea 
              className="form-control" 
              rows="2" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required
              placeholder="Street, City"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Contact Number</label>
            <input 
              type="tel" 
              className="form-control" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              required 
              placeholder="07x xxxxxxx"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
            {loading ? 'Registering...' : 'Register Pharmacy'}
          </button>
        </form>
      </div>
    </div>
  );
}