import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Loader from '../../components/Loader';
import { HiUsers, HiCube, HiClipboardList, HiCurrencyDollar, HiArrowRight, HiTrendingUp } from 'react-icons/hi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getOrders(0, 5),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.content || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { icon: HiCurrencyDollar, label: 'Total Revenue', value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
    { icon: HiClipboardList, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
    { icon: HiCube, label: 'Total Products', value: stats?.totalProducts || 0, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10' },
    { icon: HiUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10' },
  ];

  const statusColors = {
    PENDING: 'text-amber-400 bg-amber-400/10',
    SHIPPED: 'text-blue-400 bg-blue-400/10',
    DELIVERED: 'text-green-400 bg-green-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-dark-400 mt-1">Overview of your store performance</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
                  style={{ WebkitTextFillColor: 'unset', color: card.color.includes('green') ? '#22c55e' : card.color.includes('blue') ? '#3b82f6' : card.color.includes('purple') ? '#a855f7' : '#f59e0b' }} />
              </div>
              <HiTrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-dark-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/products"
              className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <HiCube className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-100">Manage Products</p>
                  <p className="text-xs text-dark-500">Add, edit, or delete products</p>
                </div>
              </div>
              <HiArrowRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/admin/orders"
              className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <HiClipboardList className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-100">Manage Orders</p>
                  <p className="text-xs text-dark-500">Update order statuses</p>
                </div>
              </div>
              <HiArrowRight className="w-4 h-4 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <HiArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-dark-500 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-dark-500 uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">Order</th>
                    <th className="text-left pb-3 font-medium">Customer</th>
                    <th className="text-left pb-3 font-medium">Amount</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-left pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/30">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3 font-medium text-dark-200">#{order.id}</td>
                      <td className="py-3 text-dark-400">{order.userName}</td>
                      <td className="py-3 font-medium text-dark-200">${order.totalAmount?.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${statusColors[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-dark-500 text-xs">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
