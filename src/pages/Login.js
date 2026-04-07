import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check credentials
    if (username === 'admin' && password === '123') {
      
    
      localStorage.setItem('isAuthenticated', 'true');
      
      toast.success("Login Successful! Welcome back.");
      
    
      window.location.href = "/"; 
      
    } else {
      toast.error("Invalid Credentials! Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg border-0 p-4 mt-5 rounded-4">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary">PharmaLogic</h3>
              <p className="text-muted small">Agency Management System</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-bold small">Username</label>
                <input 
                  type="text" 
                  className="form-control shadow-none" 
                  placeholder="Enter username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small">Password</label>
                <input 
                  type="password" 
                  className="form-control shadow-none" 
                  placeholder="Enter password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}