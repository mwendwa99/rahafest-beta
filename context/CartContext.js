// CartContext.js
import React, { createContext, useReducer, useContext } from "react";

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          total:
            state.total +
            parseFloat(action.payload.price) * action.payload.quantity,
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total:
          state.total +
          parseFloat(action.payload.price) * action.payload.quantity,
      };

    case "REMOVE_FROM_CART":
      const filteredItems = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.selectedSize === action.payload.selectedSize &&
            item.selectedColor === action.payload.selectedColor
          )
      );
      return {
        ...state,
        items: filteredItems,
        total:
          state.total -
          parseFloat(action.payload.price) * action.payload.quantity,
      };

    case "UPDATE_QUANTITY":
      const updatedItems = state.items.map((item) => {
        if (
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
        ) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        total: newTotal,
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
