import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    const location = useLocation();
    
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: 'fa-th-large' },
        { path: '/inventory', label: 'Medicine List', icon: 'fa-list' },
        { path: '/add-item', label: 'Add New Medicine', icon: 'fa-plus-square' },
        { path: '/expired-inventory', label: 'Expired Inventory', icon: 'fa-calendar-times' },
        { path: '/place-order', label: 'Place Order', icon: 'fa-cart-plus' }, 
        { path: '/pharmacy-orders', label: 'Current Orders', icon: 'fa-shopping-cart' }, 
        { path: '/order-history', label: 'Order History', icon: 'fa-history' },
        { path: '/sales-return', label: 'Process Return', icon: 'fa-undo' },
        { path: '/return-history', label: 'Return History', icon: 'fa-clock-rotate-left' },
        { path: '/add-supplier', label: 'Add Supplier', icon: 'fa-user-plus' },
        { path: '/view-suppliers', label: 'View Suppliers', icon: 'fa-truck' },
        { path: '/restock', label: 'Restock Inventory', icon: 'fa-box-open' },
        { path: '/purchase-history', label: 'Purchase Reports', icon: 'fa-file-invoice' },
        { path: '/customers', label: 'Manage Customers', icon: 'fa-users' }, 
        { path: '/customer-payments', label: 'Customer Payments', icon: 'fa-hand-holding-dollar' },
        { path: '/supplier-payments', label: 'Supplier Payments', icon: 'fa-money-bill-transfer' },
    ];

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        }
    };

    return (
        <div className="sidebar shadow d-flex flex-column" style={{ height: '100vh' }}>
            {/* Brand Logo */}
            <div className="sidebar-brand px-4 py-4">
                <h4 className="fw-bold mb-0">Pharma<span className="text-white">Logic</span></h4>
            </div>
            
            {/* Scrollable Menu Area */}
            <div className="flex-grow-1 overflow-auto custom-sidebar-scroll">
                <nav className="nav flex-column py-3">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path} 
                            className={`nav-link py-3 px-4 ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <i className={`fa ${item.icon} me-3`}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    
                    <hr className="border-secondary opacity-25 mx-3 my-4" />
                    
                    <button 
                        className="nav-link bg-transparent border-0 w-100 text-start text-danger px-4 pb-5" 
                        onClick={handleLogout}
                    >
                        <i className="fa fa-sign-out-alt me-3"></i>
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}