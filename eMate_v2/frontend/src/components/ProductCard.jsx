import { toast } from 'react-toastify';
import { addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.warn('Please login to add items to cart!');
      return navigate('/login');
    }
    try {
      await addToCart({ productId: product._id, quantity: 1 });
      fetchCart();
      toast.success(`${product.name} added to cart! 🛒`);
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const categoryColors = {
    'Daily Use': 'bg-blue-100 text-blue-700',
    'Books': 'bg-yellow-100 text-yellow-700',
    'Stationary': 'bg-purple-100 text-purple-700',
    'Electronics': 'bg-red-100 text-red-700',
  };

  return (
    <div className="card flex flex-col">
      <div className="h-48 bg-green-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">📦</span>
        )}
      </div>

      <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit mb-2 ${categoryColors[product.category] || 'bg-green-100 text-green-700'}`}>
        {product.category}
      </span>

      <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-green-600 font-bold text-xl">₹{product.price}</span>
        <span className="text-xs text-gray-400">Stock: {product.stock}</span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`mt-3 w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
          product.stock === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'btn-primary'
        }`}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
      </button>
    </div>
  );
};

export default ProductCard;
