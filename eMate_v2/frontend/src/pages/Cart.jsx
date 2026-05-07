import { useEffect, useState } from 'react';
import { getCart, removeFromCart, updateCartQty, clearCart, placeOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    try {
      const { data } = await getCart();
      setCartData(data.products || []);
    } catch {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
      loadCart();
      fetchCart();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartQty(productId, quantity);
      loadCart();
      fetchCart();
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared!');
      loadCart();
      fetchCart();
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const handlePlaceOrder = async () => {
    if (!window.confirm('Are you sure you want to place this order?')) return;
    setOrdering(true);
    try {
      await placeOrder();
      toast.success('🎉 Order placed successfully!');
      fetchCart();
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  const total = cartData.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );

  if (cartData.length === 0) return (
    <div className="text-center py-20">
      <p className="text-6xl mb-4">🛒</p>
      <p className="text-xl font-semibold text-gray-700">Your cart is empty!</p>
      <p className="text-gray-500 text-sm mt-2 mb-6">Add some products to get started</p>
      <Link to="/" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h1>
        <button onClick={handleClear} className="text-red-500 text-sm hover:underline">Clear All</button>
      </div>

      <div className="space-y-4 mb-6">
        {cartData.map((item) => {
          const product = item.productId;
          if (!product) return null;
          return (
            <div key={item._id} className="card flex items-center gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : <span className="text-3xl">📦</span>}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                <p className="text-green-600 font-bold">₹{product.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleUpdateQty(product._id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button onClick={() => handleUpdateQty(product._id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 font-bold">+</button>
              </div>

              <p className="font-bold text-gray-700 w-20 text-right">₹{product.price * item.quantity}</p>

              <button onClick={() => handleRemove(product._id)} className="text-red-400 hover:text-red-600 text-xl ml-2">✕</button>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2 text-gray-600">
          <span>Subtotal</span><span>₹{total}</span>
        </div>
        <div className="flex justify-between mb-2 text-gray-600">
          <span>Shipping</span><span className="text-green-600">FREE</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total</span><span className="text-green-600">₹{total}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={ordering}
          className="btn-primary w-full mt-4 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {ordering ? 'Placing Order...' : 'Place Order 🚀'}
        </button>
        <Link to="/my-orders" className="block text-center text-sm text-green-600 hover:underline mt-3">
          View My Orders →
        </Link>
      </div>
    </div>
  );
};

export default Cart;
