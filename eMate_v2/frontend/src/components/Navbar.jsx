import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
          🛒 <span>eMate</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
          {user && <Link to="/profile" className="hover:text-green-600 transition-colors">Profile</Link>}
          {user && user.role !== 'admin' && (
            <Link to="/my-orders" className="hover:text-green-600 transition-colors">My Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-green-600 transition-colors">Admin Panel</Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/cart" className="relative">
                <span className="text-2xl">🛍️</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <span className="text-gray-600 text-sm hidden md:block">Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
