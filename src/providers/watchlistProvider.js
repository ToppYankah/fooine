import React, { useState, useContext } from 'react';
import firebase from '../firebase';

const WatchlistContext = React.createContext();

export function useWatchlist() {
    return useContext(WatchlistContext);
}

function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState([]);
    const [checkOut, setCheckOut] = useState([]);
    const [loading, setLoading] = useState(false);

    const cartRef = firebase.firestore().collection('carts');

    const getWatchlist = (key)=>{
        setLoading(true);
        if(key){
            cartRef.doc(key).onSnapshot(snapshot=>{
                if(snapshot.data()){
                    setWatchlist(()=> snapshot.data().watchlist || [])
                    setCheckOut(()=> snapshot.data().watchlist || [])
                }
            })
        }
    }

    const addToWatchlist = (key, itemId)=>{
        setLoading(true);
        if(itemId != null && !watchlist.includes(itemId)){
            const newCart = [...watchlist, itemId];
            cartRef.doc(key).set({watchlist: newCart})
            .then(_=>{
                setWatchlist(newCart.map(item => item));
                setCheckOut([...checkOut, itemId])
                setLoading(false);
            })
            .catch(err=>{
                console.log(err);
                setLoading(false);
            })
        }
    }

    const removeFromWatchlist = (key, itemId)=>{
        setLoading(true);
        if(itemId && watchlist.includes(itemId) && watchlist.length > 0){
            const newCart = watchlist.filter(id=> id !== itemId);
            cartRef.doc(key).set({watchlist: newCart})
            .then(_=>{
                setWatchlist(newCart.map(item=> item));
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
        // remove checkedout watchlist items
        const newCart = watchlist.filter(id=> !checkOut.includes(id));
        cartRef.doc(key)
        .update({watchlist: [...newCart]})
        .then(_=>{
            setCheckOut([]);
            setWatchlist([...newCart]);
        }).catch(error=> {
            console.log(error);
        })
    }

    return (
        <WatchlistContext.Provider value={{
            watchlist, loading, checkOut,
            addToWatchlist, removeFromWatchlist, 
            removeFromCheckout, addToCheckout,
            clearCheckedOut, getWatchlist
        }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export default WatchlistProvider;
