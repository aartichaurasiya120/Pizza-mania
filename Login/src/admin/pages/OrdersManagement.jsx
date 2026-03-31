import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../styles/admin.css';
import '../styles/table.css';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`http://localhost:8080/api/admin/orders?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(
                `http://localhost:8080/api/admin/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <Topbar title="Orders Management" subtitle="Manage all customer orders" />
                <div className="table-container">
                    <div className="table-header">
                        <h2>All Orders</h2>
                        <div className="table-actions">
                            <select
                                className="filter-select"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="">All Orders</option>
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <div className="table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total Amount</th>
                                        <th>Total Cost</th>
                                        <th>Net Profit</th>
                                        <th>Payment Method</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order.orderId || `#${order._id.slice(-6)}`}</td>
                                            <td>
                                                <div>{order.customerName}</div>
                                                <div style={{ fontSize: '12px', color: '#999' }}>{order.customerPhone}</div>
                                            </td>
                                            <td>₹{order.totalSellingPrice?.toFixed(2) || 0}</td>
                                            <td>₹{order.totalCostPrice?.toFixed(2) || 0}</td>
                                            <td style={{ color: order.netProfit >= 0 ? '#4caf50' : '#f44336' }}>
                                                ₹{order.netProfit?.toFixed(2) || 0}
                                            </td>
                                            <td>{order.paymentMethod}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        background: 'rgba(179, 0, 0, 0.2)',
                                                        border: '1px solid #b30000',
                                                        borderRadius: '4px',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersManagement;
