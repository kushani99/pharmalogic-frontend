import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function History() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/orders/all'); 
        setAllOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error("History Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const filtered = allOrders.filter(order =>
      order.pharmacy_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, allOrders]);


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Pharmacy Delivery History Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    const tableRows = filteredOrders.map(order => [
      (order.id || 0) + 1000, 
      order.pharmacy_name || 'N/A',
      `${order.medicine_name} (x${order.quantity})`,
      order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A',
      `Rs. ${parseFloat(order.total_amount || 0).toLocaleString()}`,
      order.status || 'Pending',
      order.delivery_status || 'Pending'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Pharmacy Name', 'Medicine & Qty', 'Order Date', 'Total', 'Payment', 'Delivery']],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 9 }
    });

    doc.save("Delivery_History_Report.pdf");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Delivery History</h2>
        
        <button className="btn btn-primary px-4 fw-bold shadow-sm" onClick={downloadPDF} disabled={filteredOrders.length === 0}>
          Download Report
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <input type="text" className="form-control border-0 bg-light" placeholder="Search Pharmacy..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="bg-dark text-white">
              <tr className="small text-uppercase fw-bold">
                <th className="ps-4 py-3">Order ID</th>
                <th>Pharmacy Name</th>
                <th>Medicine & Qty</th>
                <th>Order Date</th>
                <th>Total (Rs.)</th>
                <th className="text-center">Payment Status</th>
                <th className="text-center">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order.id || index}>
                    {/* මෙතනින් # අයින් කළා */}
                    <td className="ps-4 fw-bold text-muted">{(order.id || 0) + 1000}</td>
                    <td className="fw-bold">{order.pharmacy_name || 'N/A'}</td>
                    <td>{order.medicine_name} (x{order.quantity})</td>
                    <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="fw-bold text-primary">{parseFloat(order.total_amount || 0).toLocaleString()}</td>
                    <td className="text-center">
                      <span className={`badge rounded-pill px-3 py-2 ${order.status === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge rounded-pill px-3 py-2 ${order.delivery_status === 'Delivered' ? 'bg-info-subtle text-info' : 'bg-secondary-subtle text-secondary'}`}>
                        {order.delivery_status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-5 text-muted">{loading ? "Loading..." : "No delivery records found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}