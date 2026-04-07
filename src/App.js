import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav'; 
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import Orders from './pages/Orders';
import AddPharmacy from './pages/AddPharmacy';
import Login from './pages/Login';
import MedicineList from './components/MedicineList';
import History from './pages/History';
import Supplier from './pages/Supplier'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Restock from './pages/Restock';
import PurchaseHistory from './pages/PurchaseHistory';
import CustomerPayments from './pages/CustomerPayments';
import SupplierPayments from './pages/SupplierPayments';
import ManageCustomers from './components/ManageCustomers';
import PlaceOrder from './components/PlaceOrder';
import PharmacyOrders from './pages/PharmacyOrders';
import ExpiredItems from './pages/ExpiredItems';
import SalesReturn from './components/SalesReturn';
import ReturnHistory from './components/ReturnHistory'; 
import SupplierList from './pages/SupplierList'; 
import GRNReceipt from './pages/GRNReceipt';


const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('isAuthenticated');
  return isAuth ? children : <Navigate to="/login" />;
};

function App() {
  const isAuth = localStorage.getItem('isAuthenticated');
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <Router>
      <div className="d-flex">
    
        {isAuth && (
          <div className={showSidebar ? "sidebar show" : "sidebar"}>
            <Sidebar />
          </div>
        )} 
        
        
        <div className={isAuth ? "main-content w-100 bg-light min-vh-100" : "w-100"}>
        
          {isAuth && <TopNav onToggle={toggleSidebar} />}

          <Routes>
            <Route path="/login" element={<Login />} />
            
          
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/add-pharmacy" element={<ProtectedRoute><AddPharmacy /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><MedicineList /></ProtectedRoute>} />
            <Route path="/order-history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/add-supplier" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
            <Route path="/restock" element={<ProtectedRoute><Restock /></ProtectedRoute>} />
            <Route path="/purchase-history" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />
            <Route path="/customer-payments" element={<ProtectedRoute><CustomerPayments /></ProtectedRoute>} />
            <Route path="/supplier-payments" element={<ProtectedRoute><SupplierPayments /></ProtectedRoute>} />
            <Route path="/expired-inventory" element={<ProtectedRoute><ExpiredItems /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><ManageCustomers /></ProtectedRoute>} />
            <Route path="/place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
            <Route path="/pharmacy-orders" element={<ProtectedRoute><PharmacyOrders /></ProtectedRoute>} />
            <Route path="/sales-return" element={<ProtectedRoute><SalesReturn /></ProtectedRoute>} />
            <Route path="/return-history" element={<ProtectedRoute><ReturnHistory /></ProtectedRoute>} />
             <Route path="/view-suppliers" element={<ProtectedRoute><SupplierList /></ProtectedRoute>} />
            <Route path="/grn/:id" element={<ProtectedRoute><GRNReceipt /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;