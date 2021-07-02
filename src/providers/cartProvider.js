import React, { useState, useContext } from 'react';
import api from '../api';
import firebase from '../firebase';

const CartContext = React.createContext();

export function useCart() {
    return useContext(CartContext);
}

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [checkOut, setCheckOut] = useState([]);
    const [loading, setLoading] = useState(false);

    const cartRef = firebase.firestore().collection('carts');

    const getCart = (key)=>{
        setLoading(true);
        if(key){
            cartRef.doc(key).onSnapshot(snapshot=>{
                if(snapshot.data()){
                    setCart(()=> snapshot.data().cart || [])
                    setCheckOut(()=> snapshot.data().cart || [])
                }
            })
        }
    }

    const addToCart = (key, itemId)=>{
        setLoading(true);
        if(itemId != null && !cart.includes(itemId)){
            const newCart = [...cart, itemId];
            cartRef.doc(key).set({cart: newCart})
            .then(_=>{
                setCart(newCart.map(item => item));
                setCheckOut([...checkOut, itemId])
                setLoading(false);
            })
            .catch(err=>{
                console.log(err);
                setLoading(false);
            })
        }
    }

    const removeFromCart = (key, itemId)=>{
        setLoading(true);
        if(itemId && cart.includes(itemId) && cart.length > 0){
            const newCart = cart.filter(id=> id !== itemId);
            cartRef.doc(key).set({cart: newCart})
            .then(_=>{
                setCart(newCart.map(item=> item));
                setCheckOut(checkOut.filter(item=> item !== itemId));
                setLoading(false);
            })
            .catch(err=>{
                console.log(err);
                setLoading(false);
            })
        }
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

    const clearCheckedOut = (key)=>{
        // remove checkedout cart items
        const newCart = cart.filter(id=> !checkOut.includes(id));
        cartRef.doc(key)
        .update({cart: [...newCart]})
        .then(_=>{
            setCheckOut([]);
            setCart([...newCart]);
        }).catch(error=> {
            console.log(error);
        })
    }

    return (
        <CartContext.Provider value={{
            cart, loading, checkOut,
            addToCart, removeFromCart, 
            removeFromCheckout, addToCheckout,
            clearCheckedOut, getCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;
