import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import SummaryCard from '../components/SummaryCard';
import '../styles/admin.css';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('http://localhost:8080/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const weeklyChartData = {
        labels: stats?.weeklyOrders?.map(d => d._id) || [],
        datasets: [{
            label: 'Weekly Revenue (₹)',
            data: stats?.weeklyOrders?.map(d => d.revenue) || [],
            borderColor: '#b30000',
            backgroundColor: 'rgba(179, 0, 0, 0.1)',
            tension: 0.4
        }]
    };

    const monthlyChartData = {
        labels: stats?.monthlyOrders?.map(d => d._id) || [],
        datasets: [{
            label: 'Monthly Orders',
            data: stats?.monthlyOrders?.map(d => d.count) || [],
            backgroundColor: '#b30000'
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#fff' } }
        },
        scales: {
            x: { ticks: { color: '#999' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            y: { ticks: { color: '#999' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    if (loading) {
        return <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <Topbar title="Dashboard" subtitle="Overview of your restaurant" />
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1>Welcome Back, Aarti!</h1>
                        <p>Here's what's happening with your restaurant today</p>
                    </div>

                    <div className="summary-cards">
                        <SummaryCard
                            icon="💰"
                            title="Total Revenue"
                            value={`₹${stats?.totalRevenue?.toFixed(2) || 0}`}
                        />
                        <SummaryCard
                            icon="📦"
                            title="Total Orders"
                            value={stats?.totalOrders || 0}
                        />
                        <SummaryCard
                            icon="⏳"
                            title="Pending Orders"
                            value={stats?.totalPendingOrders || 0}
                        />
                        <SummaryCard
                            icon="✅"
                            title="Delivered Orders"
                            value={stats?.totalDeliveredOrders || 0}
                        />
                        <SummaryCard
                            icon="💸"
                            title="Total Cost"
                            value={`₹${stats?.totalCost?.toFixed(2) || 0}`}
                        />
                        <SummaryCard
                            icon="📈"
                            title="Net Profit"
                            value={`₹${stats?.netProfit?.toFixed(2) || 0}`}
                            isPositive={stats?.netProfit > 0}
                        />
                    </div>

                    {/* Recent Orders Section */}
                    {stats?.recentOrders && stats.recentOrders.length > 0 && (
                        <div className="recent-orders">
                            <h3>Recent Orders (Latest 5)</h3>
                            <div className="orders-list">
                                {stats.recentOrders.map((order) => (
                                    <div key={order._id} className="order-item">
                                        <div className="order-info">
                                            <h4>{order.customerName}</h4>
                                            <p>{new Date(order.createdAt).toLocaleString()} - {order.status}</p>
                                        </div>
                                        <div className="order-amount">₹{order.totalSellingPrice}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="charts-section">
                        <div className="chart-card">
                            <h3>Weekly Revenue Trend</h3>
                            <div className="chart-container">
                                <Line data={weeklyChartData} options={chartOptions} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Monthly Orders</h3>
                            <div className="chart-container">
                                <Bar data={monthlyChartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
