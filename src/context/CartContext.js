import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from Supabase on mount or when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (user) {
          // Load cart from Supabase for logged-in user
          const { data, error } = await supabase
            .from('carts')
            .select('cart_items')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error loading cart from Supabase:', error);
          } else if (data && data.cart_items) {
            setCartItems(data.cart_items);
          }
        } else {
          // For guest users, try to load from sessionStorage as fallback
          const savedCart = sessionStorage.getItem('biofactor_cart');
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart));
            } catch (error) {
              console.error('Error parsing cart from sessionStorage:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to Supabase whenever it changes
  useEffect(() => {
    if (loading) return; // Don't save on initial load

    const saveCart = async () => {
      try {
        if (user) {
          // Save to Supabase for logged-in user
          const { error } = await supabase
            .from('carts')
            .upsert({
              user_id: user.id,
              cart_items: cartItems,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (error) {
            console.error('Error saving cart to Supabase:', error);
          }
        } else {
          // For guest users, save to sessionStorage as fallback
          sessionStorage.setItem('biofactor_cart', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [cartItems, loading]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    
    try {
      if (user) {
        const { error } = await supabase
          .from('carts')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Error clearing cart from Supabase:', error);
        }
      } else {
        sessionStorage.removeItem('biofactor_cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
