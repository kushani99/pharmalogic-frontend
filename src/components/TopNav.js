import React from 'react';

export default function TopNav({ onToggle }) {
    return (
    
        <nav className="navbar navbar-light bg-white shadow-sm mb-4 px-3 d-lg-none">
            <button className="btn btn-primary" onClick={onToggle}>
                <i className="fa fa-bars"></i>
            </button>
            <span className="fw-bold ms-2">PharmaLogic</span>
        </nav>
    );
}