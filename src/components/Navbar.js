import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">PharmaLogic</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-item">Add Item</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-pharmacy">Add Pharmacy</Link>
            </li>
            
            {/* අලුතින් එකතු කළ Supplier බටන් එක */}
            <li className="nav-item">
              <Link className="nav-link" to="/add-supplier">Add Supplier</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/orders">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/order-history">History</Link>
            </li>
            <li className="nav-item">
           <Link className="nav-link" to="/restock">Restock Stock</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/purchase-history">Purchase History</Link>
              </li>
          </ul>
          <button className="btn btn-outline-light btn-sm fw-bold" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}