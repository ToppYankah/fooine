import React, { useState, useContext } from 'react';
import api from '../api';
import { useAuth } from './authProvider';

const CartContext = React.createContext();

export function useCart() {
    return useContext(CartContext);
}

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [checkOut, setCheckOut] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCart = (key)=>{
        setLoading(true);
        if(key){
            const result = api.getUserCart(key);
            console.log(result);
            if(result.success){
                setCart(result.cart);
            }
        }
    }

    const addToCart = (key, item)=>{
        setLoading(true);
        if(item != null && !cart.includes(item)){
            const result = api.addProductToCart(key, item.id);
            console.log(result)
            if(result.success){
                const newCart = cart;
                newCart.unshift(item);
                setCart(newCart.map(prod=> prod));
                
                // update ready for checkout
                const newCheckoutList = checkOut;
                newCheckoutList.push(item.id);
                setCheckOut(newCheckoutList.map(item=> item));
            }
        }
        setLoading(false);
    }

    const removeFromCart = (key, item)=>{
        setLoading(true);
        if(item && cart.includes(item) && cart.length > 0){
            const result = api.removeProductFromCart(key, item.id);
            console.log(result)
            if(result.success){
                const newCart = cart.filter(filterItem=> filterItem.id !== item.id);
                setCart(newCart.map(item=> item));
    
                // update ready for checkout
                const newCheckoutList = checkOut;
                newCheckoutList.filter(id=> id !== item.id);
                setCheckOut(newCheckoutList.map(item=> item));
            }
        }
        setLoading(false);
    }

    const removeFromCheckout = (id)=>{
        const newCheckoutList = checkOut;
        setCheckOut(newCheckoutList.filter(index=> index !== id));
    }

    const addToCheckout = (id)=>{
        const newCheckoutList = checkOut;
        newCheckoutList.push(id);
        setCheckOut(newCheckoutList.map(item=> item));
    }

    const getCheckoutTally = ()=>{
        let output = 0;

        cart.forEach(item=>{
            if(checkOut.includes(item.id)){
                output += parseFloat(item.price);
            }
        });

        return output;
    }

    const getProductsForCheckout = ()=>{
        let output = [];

        cart.forEach(item=>{
            if(checkOut.includes(item.id)){
                output.push(item);
            }
        });

        return output;
    }

    const clearCheckedOut = (key)=>{
        const toBeCleared = getProductsForCheckout().map(item=> item.id);
        const result = api.clearCheckedOut(key, toBeCleared);
        if(result.success){
            setCart(cart.filter(item=> !toBeCleared.includes(item.id)));
        }
    }

    return (
        <CartContext.Provider value={{
            cart, loading, checkOut,
            addToCart, removeFromCart, 
            removeFromCheckout, addToCheckout,
            getCheckoutTally, getProductsForCheckout,
            clearCheckedOut, getCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;
