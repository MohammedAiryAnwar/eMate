import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const statusIcons = { pending: '⏳', confirmed: '✅', cancelled: '❌' };

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-20">
      <p className="text-6xl mb-4">📦</p>
      <p className="text-xl font-semibold text-gray-700">No orders yet!</p>
      <p className="text-gray-500 text-sm mt-2 mb-6">Place your first order from the cart</p>
      <Link to="/" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="bg-green-50 px-6 py-4 flex flex-wrap justify-between items-center gap-2 border-b">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-xs text-gray-700">{order._id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Placed on</p>
                <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-sm font-bold text-green-600">₹{order.totalAmount}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}>
                {statusIcons[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* Items */}
            <div className="px-6 py-4 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : <span className="text-xl">📦</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-bold text-gray-700">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            {(order.status === 'confirmed' || order.estimatedDelivery) && (
              <div className={`px-6 py-3 border-t flex items-center gap-2 ${order.status === 'cancelled' ? 'bg-red-50' : 'bg-blue-50'}`}>
                {order.status === 'confirmed' && order.estimatedDelivery ? (
                  <>
                    <span className="text-blue-500 text-lg">🚚</span>
                    <p className="text-sm text-blue-700 font-medium">
                      Estimated Delivery: <span className="font-bold">{order.estimatedDelivery}</span>
                    </p>
                  </>
                ) : order.status === 'confirmed' ? (
                  <>
                    <span className="text-green-500 text-lg">✅</span>
                    <p className="text-sm text-green-700 font-medium">Order confirmed! Delivery time will be updated soon.</p>
                  </>
                ) : null}
                {order.status === 'cancelled' && (
                  <>
                    <span className="text-red-500 text-lg">❌</span>
                    <p className="text-sm text-red-600 font-medium">This order was cancelled.</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
