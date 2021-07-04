import React, { useState, useContext } from 'react';
import { v4 } from 'uuid';
import firebase from '../firebase';
import { useError } from './errorProvider';

const WatchlistContext = React.createContext();

export function useWatchlist() {
    return useContext(WatchlistContext);
}

function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState([]);
    const [checkOut, setCheckOut] = useState([]);
    const [loading, setLoading] = useState(false);
    const {createError} = useError();

    const watchlistRef = firebase.firestore().collection('watchlist');

    const isWatching = (prodId)=>{
        let output = false;
        watchlist.forEach(item=> {
            if(item.productId === prodId){
                output = true;
            }
        });
        return output;
    }

    const getWatchlist = (key)=>{
        setLoading(true);
        if(key){
            watchlistRef.where("userId", "==", key).onSnapshot(snapshot=>{
                setWatchlist(snapshot.docs.map(doc=> doc.data()) || [])
                setCheckOut(snapshot.docs.map(doc=> doc.data().productId) || [])
            })
        }
    }

    const addToWatchlist = (key, itemId)=>{
        setLoading(true);
        if(itemId != null && !watchlist.includes(itemId)){
            const docId = v4();
            const newWatch = {id: docId, userId: key, productId: itemId};
            watchlistRef.doc(docId).set(newWatch)
            .then(_=>{
                // setWatchlist([...watchlist, newWatch]);
                // setCheckOut([...checkOut, itemId])
                setLoading(false);
            })
            .catch(({message})=>{
                createError(message);
                setLoading(false);
            })
        }
    }

    const removeFromWatchlist = (prodId)=>{
        setLoading(true);
        const watchId = watchlist.filter(item=> item.productId === prodId)[0].id;
        if(watchId && watchlist.length > 0){
            watchlistRef.doc(watchId).delete()
            .then(_=>{
                // setWatchlist(watchlist.filter(watch=> watch.id !== watchId));
                // setCheckOut(checkOut.filter(item=> item !== watchId));
                setLoading(false);
            })
            .catch(({message})=>{
                setLoading(false);
                createError(message);
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
        const newWatchlist = watchlist.filter(id=> !checkOut.includes(id));
        watchlistRef.doc(key)
        .update({watchlist: [...newWatchlist]})
        .then(_=>{
            setCheckOut([]);
            setWatchlist([...newWatchlist]);
        }).catch(error=> {
            console.log(error);
        })
    }

    return (
        <WatchlistContext.Provider value={{
            watchlist, loading, checkOut,
            addToWatchlist, removeFromWatchlist, 
            removeFromCheckout, addToCheckout,
            clearCheckedOut, getWatchlist, isWatching
        }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export default WatchlistProvider;
