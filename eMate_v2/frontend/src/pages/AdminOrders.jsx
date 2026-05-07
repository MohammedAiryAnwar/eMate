import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/api';
import { toast } from 'react-toastify';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryInputs, setDeliveryInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, status) => {
    const estimatedDelivery = deliveryInputs[orderId] || '';
    if (status === 'confirmed' && !estimatedDelivery.trim()) {
      toast.warn('Please enter an estimated delivery time before confirming.');
      return;
    }
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, { status, estimatedDelivery });
      toast.success(`Order ${status === 'confirmed' ? 'confirmed ✅' : 'cancelled ❌'}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  // Group orders by user email
  const grouped = orders.reduce((acc, order) => {
    const key = order.userEmail;
    if (!acc[key]) acc[key] = { userName: order.userName, email: order.userEmail, contactNumber: order.contactNumber, orders: [] };
    acc[key].orders.push(order);
    return acc;
  }, {});

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-20">
      <p className="text-6xl mb-4">📋</p>
      <p className="text-xl font-semibold text-gray-700">No orders yet!</p>
      <p className="text-gray-400 text-sm mt-2">Orders placed by users will appear here.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">📋 All Orders</h1>
      <p className="text-gray-500 text-sm mb-6">{orders.length} total order(s) from {Object.keys(grouped).length} user(s)</p>

      <div className="space-y-10">
        {Object.values(grouped).map((user) => (
          <div key={user.email} className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* User Header */}
            <div className="bg-green-700 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                  {user.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-base">{user.userName}</p>
                  <p className="text-green-200 text-xs">{user.email}</p>
                </div>
              </div>
              <div className="ml-auto flex gap-6 text-sm">
                <div>
                  <p className="text-green-300 text-xs">Contact</p>
                  <p className="font-medium">📞 {user.contactNumber}</p>
                </div>
                <div>
                  <p className="text-green-300 text-xs">Orders</p>
                  <p className="font-medium">{user.orders.length}</p>
                </div>
              </div>
            </div>

            {/* Orders for this user */}
            <div className="divide-y divide-gray-100">
              {user.orders.map((order) => (
                <div key={order._id} className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">₹{order.totalAmount}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Products in this order */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : <span>📦</span>}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-700">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Admin Actions */}
                  {order.status === 'pending' && (
                    <div className="flex flex-wrap gap-3 items-end mt-4 pt-4 border-t border-dashed">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-gray-500 mb-1">Estimated Delivery Time *</label>
                        <input
                          type="text"
                          placeholder="e.g. 2-3 business days, Jan 10, etc."
                          className="input-field text-sm py-1.5"
                          value={deliveryInputs[order._id] || ''}
                          onChange={(e) => setDeliveryInputs(prev => ({ ...prev, [order._id]: e.target.value }))}
                        />
                      </div>
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                        disabled={updatingId === order._id}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60"
                      >
                        ✅ Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        disabled={updatingId === order._id}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition disabled:opacity-60"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}

                  {order.status !== 'pending' && (
                    <div className={`mt-4 pt-3 border-t text-sm flex items-center gap-2 ${order.status === 'confirmed' ? 'text-green-700' : 'text-red-600'}`}>
                      {order.status === 'confirmed' ? (
                        <>
                          <span>🚚</span>
                          <span>Estimated Delivery: <strong>{order.estimatedDelivery || 'Not set'}</strong></span>
                        </>
                      ) : (
                        <><span>❌</span><span>Order cancelled</span></>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
