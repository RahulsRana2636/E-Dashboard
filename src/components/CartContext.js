// CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";

// Define initial state
const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

// Create context
const CartContext = createContext();

// Define reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const updatedCart = [...state.cart, action.payload];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return {
        ...state,
        cart: updatedCart,
      };
    case "REMOVE_FROM_CART":
      const filteredCart = state.cart.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(filteredCart));
      return {
        ...state,
        cart: filteredCart,
      };
    // Add more cases for other actions if needed
    default:
      return state;
  }
};

// Create custom hook for using the context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Create context provider component
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Update local storage whenever the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, useCart };
