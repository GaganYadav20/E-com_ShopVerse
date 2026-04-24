import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';
import { HiCube, HiTruck, HiCheck, HiX, HiClock } from 'react-icons/hi';

const statusConfig = {
  PENDING: { color: 'text-amber-400 bg-amber-400/10', icon: HiClock, label: 'Pending' },
  SHIPPED: { color: 'text-blue-400 bg-blue-400/10', icon: HiTruck, label: 'Shipped' },
  DELIVERED: { color: 'text-green-400 bg-green-400/10', icon: HiCheck, label: 'Delivered' },
  CANCELLED: { color: 'text-red-400 bg-red-400/10', icon: HiX, label: 'Cancelled' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getAll();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-6">📦</div>
          <h2 className="text-2xl font-bold text-white mb-3">No Orders Yet</h2>
          <p className="text-dark-400 mb-8">You haven't placed any orders yet.</p>
          <Link to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold
                       hover:shadow-xl hover:shadow-primary-500/30 transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="glass rounded-2xl overflow-hidden animate-slide-up">
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-dark-700/50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${status.color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Order #{order.id}</h3>
                      <p className="text-xs text-dark-400 mt-0.5">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-lg font-bold gradient-text">₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.productImage || 'https://via.placeholder.com/60'}
                          alt={item.productName}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.productId}`}
                            className="text-sm font-medium text-dark-200 hover:text-primary-300 transition-colors truncate block">
                            {item.productName}
                          </Link>
                          <p className="text-xs text-dark-500 mt-0.5">
                            Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-dark-200">
                          ₹{(item.quantity * item.price)?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div className="mt-4 pt-4 border-t border-dark-700/30 flex items-start gap-2">
                    <HiCube className="w-4 h-4 text-dark-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-dark-500">{order.shippingAddress}</p>
                  </div>

                  {/* Order Tracking Bar */}
                  {order.status !== 'CANCELLED' && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        {['PENDING', 'SHIPPED', 'DELIVERED'].map((step, i) => {
                          const steps = ['PENDING', 'SHIPPED', 'DELIVERED'];
                          const currentIndex = steps.indexOf(order.status);
                          const isActive = i <= currentIndex;
                          return (
                            <div key={step} className="flex-1 flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                ${isActive ? 'gradient-primary text-white' : 'bg-dark-800 text-dark-500'}`}>
                                {i + 1}
                              </div>
                              {i < 2 && (
                                <div className={`flex-1 h-0.5 mx-2 ${isActive && i < currentIndex ? 'bg-primary-500' : 'bg-dark-700'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-dark-500">Ordered</span>
                        <span className="text-[10px] text-dark-500">Shipped</span>
                        <span className="text-[10px] text-dark-500">Delivered</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
