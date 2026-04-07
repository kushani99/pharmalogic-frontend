import React, { useState, useEffect } from 'react';
import { getMedicines } from '../services/medicineService';
import { getPharmacies } from '../services/pharmacyService';
import { getOrders } from '../services/orderService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [incomeStats, setIncomeStats] = useState({ total: 0, cash: 0, card: 0, online: 0 });
  const [todayOutgoing, setTodayOutgoing] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [pendingDeliveryCount, setPendingDeliveryCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s for real-time inventory sync without refresh
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getMedicines(), getPharmacies(), getOrders(),
        axios.get('http://localhost:5000/api/supplier-payments'),
        axios.get('http://localhost:5000/api/customer-payments/report')
      ]);
      
      const medData = results[0].status === 'fulfilled' ? (results[0].value || []) : [];
      const pharmData = results[1].status === 'fulfilled' ? (results[1].value || []) : [];
      const orderData = results[2].status === 'fulfilled' ? (results[2].value || []) : [];
      const outgoingResData = results[3].status === 'fulfilled' ? (results[3].value.data || []) : [];
      const incomingResData = results[4].status === 'fulfilled' ? (results[4].value.data || []) : [];
      
      setInventory(medData);
      setPharmacyCount(Array.isArray(pharmData) ? pharmData.length : 0);
      
      const localNow = new Date();
      const today = localNow.getFullYear() + '-' + String(localNow.getMonth() + 1).padStart(2, '0') + '-' + String(localNow.getDate()).padStart(2, '0');
      const expiredList = Array.isArray(medData) ? medData.filter(item => item.expireDate && item.expireDate < today) : [];
      setExpiredCount(expiredList.length);

      let income = { total: 0, cash: 0, card: 0, online: 0 };
      let delivered = 0;
      let pendingDelivery = 0; 

      if (Array.isArray(orderData)) {
        orderData.forEach(order => {
          if (!order.order_date) return;
          try {
            const oDate = new Date(order.order_date);
            const orderDateStr = oDate.getFullYear() + '-' + String(oDate.getMonth() + 1).padStart(2, '0') + '-' + String(oDate.getDate()).padStart(2, '0');
            
            if (orderDateStr === today) {
              if (order.delivery_status === 'Delivered') {
                delivered += 1;
              } else if (order.delivery_status === 'Pending') {
                pendingDelivery += 1;
              }
            }
          } catch (err) {
            // Ignore format errors
          }
        });
      }

      if (Array.isArray(incomingResData)) {
        incomingResData.forEach(payment => {
          if (!payment.payment_date) return;
          try {
            const payDate = new Date(payment.payment_date);
            const payDateStr = payDate.getFullYear() + '-' + String(payDate.getMonth() + 1).padStart(2, '0') + '-' + String(payDate.getDate()).padStart(2, '0');

            if (payDateStr === today) {
              const amount = parseFloat(payment.amount || 0);
              income.total += amount;
              const method = (payment.method || 'cash').toLowerCase();
              if (method === 'cash') income.cash += amount;
              else if (method === 'card') income.card += amount;
              else income.online += amount;
              
              console.log(`[Income Calc] Match found! Payment Date: ${payDateStr} vs Today: ${today} | Calculated Total now: ${income.total}`);
            }
          } catch (err) {
            // Ignore format errors
          }
        });
      }

      let outgoingSum = 0;
      if (Array.isArray(outgoingResData)) {
        outgoingResData.forEach(p => {
          if (!p.date && !p.payment_date) return;
          try {
            const pDate = new Date(p.date || p.payment_date).toISOString().split('T')[0];
            if (pDate === today) outgoingSum += parseFloat(p.amount || 0);
          } catch (err) {
            // Ignore format errors
          }
        });
      }

      setIncomeStats(income);
      setTodayOutgoing(outgoingSum);
      setDeliveredCount(delivered);
      setPendingDeliveryCount(pendingDelivery); 

    } catch (e) { 
      console.error("Error loading data", e);
    } finally { 
      setLoading(false); 
    }
  };

  // ✅ නිවැරදි කරන ලද Delete Function එක
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/medicines/${id}`);
        
        if (res.data.success) {
          alert("Medicine deleted successfully!");
          
          // ✅ මෙතනදී inventory එක update කිරීමෙන් Table එකෙන් අදාළ දත්තය මැකී යයි
          setInventory(prevInventory => prevInventory.filter(med => med.id !== id));
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete the medicine.");
      }
    }
  };

  const lowStockCount = inventory.filter(i => Number(i.stock) < 10).length;
  const netProfit = incomeStats.total - todayOutgoing;

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : statusFilter === 'Low' ? Number(item.stock) < 10 : Number(item.stock) >= 10;
    return matchesSearch && matchesStatus;
  });

  const styles = {
    wrapper: { background: '#f0f2f5', padding: '30px', minHeight: '100vh' },
    card: { border: 'none', borderRadius: '20px', padding: '25px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
    incomeCard: { background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' },
    outgoingCard: { background: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)' },
    profitCard: { background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)' },
    summaryBox: { background: 'white', borderRadius: '15px', padding: '20px', textAlign: 'center', transition: '0.3s' },
    icon: { position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '5rem', opacity: '0.15' }
  };

  return (
    <div style={styles.wrapper}>
      <div className="mb-4">
        <h2 className="fw-bold">PharmaLogic Analytics</h2>
        <p className="text-muted small">Daily Finance & Inventory Status</p>
      </div>

      {expiredCount > 0 && (
        <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center mb-4 p-3 rounded-4">
          <i className="fa fa-triangle-exclamation fs-4 me-3"></i>
          <div className="flex-grow-1">
            <h6 className="mb-0 fw-bold">Critical: {expiredCount} Expired Medicines Found!</h6>
          </div>
          <button className="btn btn-danger btn-sm rounded-pill px-3" onClick={() => navigate('/expired-inventory')}>View List</button>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div style={{...styles.card, ...styles.incomeCard}}>
            <h6 className="text-uppercase small fw-bold opacity-75">Today's Income</h6>
            <h2 className="fw-bold">Rs. {incomeStats.total.toLocaleString()}</h2>
            <div className="mt-2 small">Cash: {incomeStats.cash.toLocaleString()} | Online: {incomeStats.online.toLocaleString()}</div>
            <i className="fa fa-wallet" style={styles.icon}></i>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{...styles.card, ...styles.outgoingCard}}>
            <h6 className="text-uppercase small fw-bold opacity-75">Today's Outgoing</h6>
            <h2 className="fw-bold">Rs. {todayOutgoing.toLocaleString()}</h2>
            <div className="mt-2 small">Supplier Payments</div>
            <i className="fa fa-hand-holding-dollar" style={styles.icon}></i>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{...styles.card, ...(netProfit >= 0 ? styles.profitCard : styles.outgoingCard)}}>
            <h6 className="text-uppercase small fw-bold opacity-75">Net Profit</h6>
            <h2 className="fw-bold">Rs. {netProfit.toLocaleString()}</h2>
            <div className="mt-2 small">{netProfit >= 0 ? "Performance: Good" : "Status: Loss"}</div>
            <i className="fa fa-chart-line" style={styles.icon}></i>
          </div>
        </div>
      </div>

      {/* Summary Stats Boxes */}
      <div className="row g-3 mb-5 text-center">
        {[
          { label: 'Delivered', val: deliveredCount, icon: 'fa-truck', color: '#10b981', bg: '#d1fae5' },
          { label: 'Pending Delivery', val: pendingDeliveryCount, icon: 'fa-clock', color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Pharmacies', val: pharmacyCount, icon: 'fa-hospital', color: '#3b82f6', bg: '#e0f2fe' },
          { label: 'Low Stock', val: lowStockCount, icon: 'fa-triangle-exclamation', color: '#ef4444', bg: '#fee2e2' },
          { label: 'Total Meds', val: inventory.length, icon: 'fa-pills', color: '#8b5cf6', bg: '#ede9fe' }
        ].map((item, i) => (
          <div key={i} className="col-md-2" style={{ flex: '1' }}>
            <div style={{...styles.summaryBox, borderTop: `5px solid ${item.color}`}}>
              <i className={`fa ${item.icon} fs-2 mb-2`} style={{color: item.color}}></i>
              <h4 className="fw-bold mb-0">{item.val}</h4>
              <small className="text-muted fw-bold" style={{ fontSize: '0.75rem' }}>{item.label}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-4 px-4 border-0">
          <div className="row align-items-center">
            <div className="col-md-4"><h5 className="mb-0 fw-bold">Live Inventory Stock</h5></div>
            <div className="col-md-4">
              <input type="text" className="form-control rounded-pill bg-light border-0" placeholder="Search medicine..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-md-4">
              <select className="form-select rounded-pill bg-light border-0" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Stock Levels</option>
                <option value="Low">Low Stock</option>
                <option value="Available">Available</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-uppercase fw-bold text-muted">
                <th className="ps-4">Medicine</th><th>Stock</th><th>Price</th><th>Status</th><th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4 fw-bold">
                    <i className="fa fa-info-circle me-2"></i> No Database Records Available.
                  </td>
                </tr>
              ) : filteredInventory.map(item => (
                <tr key={item.id}>
                  <td className="ps-4"><b>{item.name}</b><br/><small className="text-muted">{item.brand}</small></td>
                  <td className={`fw-bold ${Number(item.stock) < 10 ? 'text-danger' : ''}`}>{item.stock} Units</td>
                  <td>Rs. {parseFloat(item.price || 0).toFixed(2)}</td>
                  <td><span className={`badge rounded-pill ${Number(item.stock) >= 10 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>{Number(item.stock) >= 10 ? 'In Stock' : 'Low'}</span></td>
                  <td className="text-center">
                    <button 
                      className="btn btn-sm btn-light border-0 shadow-sm px-3"
                      onClick={() => handleDelete(item.id, item.name)}
                      title="Delete Medicine"
                    >
                      <i className="fa fa-trash text-danger me-1"></i> Delete
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