import { createContext, useContext, useState, useEffect } from 'react';
import { getCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return setCart([]);
    try {
      const { data } = await getCart();
      setCart(data.products || []);
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
