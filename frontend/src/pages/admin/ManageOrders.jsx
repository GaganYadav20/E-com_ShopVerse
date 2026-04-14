import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { HiClock, HiTruck, HiCheck, HiX } from 'react-icons/hi';

const statuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusConfig = {
  PENDING: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: HiClock },
  SHIPPED: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: HiTruck },
  DELIVERED: { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: HiCheck },
  CANCELLED: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: HiX },
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const { data } = await adminAPI.getOrders(page, 15);
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
        <p className="text-dark-400 mt-1">View and update order statuses</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-dark-200">No Orders Found</h3>
          <p className="text-dark-500 mt-1">Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className="glass rounded-2xl overflow-hidden animate-slide-up">
                <div className="p-4 sm:p-6">
                  {/* Header row */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Order #{order.id}</h3>
                        <p className="text-xs text-dark-500 mt-0.5">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold gradient-text">${order.totalAmount?.toFixed(2)}</p>
                      <p className="text-xs text-dark-500">{order.items?.length || 0} items</p>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-dark-500">Customer: </span>
                      <span className="text-dark-200 font-medium">{order.userName}</span>
                    </div>
                    <div>
                      <span className="text-dark-500">Email: </span>
                      <span className="text-dark-300">{order.userEmail}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {order.items?.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50 text-xs">
                        <img src={item.productImage || 'https://via.placeholder.com/24'} alt="" className="w-6 h-6 rounded object-cover" />
                        <span className="text-dark-300 truncate max-w-[120px]">{item.productName}</span>
                        <span className="text-dark-500">×{item.quantity}</span>
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <span className="flex items-center px-3 py-1.5 rounded-lg bg-dark-800/50 text-xs text-dark-500">
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Status update */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-dark-700/30">
                    <span className="text-sm text-dark-400 mr-2">Update status:</span>
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(order.id, s)}
                        disabled={order.status === s}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                          ${order.status === s
                            ? `${statusConfig[s].color} border cursor-default`
                            : 'bg-dark-800/50 text-dark-400 border-dark-700/50 hover:border-primary-500/50 hover:text-dark-200'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="px-4 py-2 rounded-lg glass text-sm text-dark-300 disabled:opacity-40 transition-all">Previous</button>
          <span className="text-sm text-dark-400 px-3">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            className="px-4 py-2 rounded-lg glass text-sm text-dark-300 disabled:opacity-40 transition-all">Next</button>
        </div>
      )}
    </div>
  );
}
