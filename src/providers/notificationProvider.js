import React, { useState, useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import firebase from '../firebase';
import { useToken, useAuthToken } from '../hooks/token';

const NotificationContext = React.createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useToken();
    const [authToken, setAuthToken] = useAuthToken();
    const [updated, setUpdated] = useState(false);

    // initializing firestore refs
    const store = firebase.firestore();
    const notificationsRef = store.collection('notifications');

    useEffect(() => {
        setLoading(true);
        
        notificationsRef.where("to", "==", token || authToken).onSnapshot(snapChild=>{
            setNotifications(snapChild.docs.map(doc=> doc.data()) || notifications);
            // on change/updated
            snapChild.docChanges(item=>{
                setNotifications(item.docs.map(doc=> doc.data()) || notifications);
            });
        });
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications, loading
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationProvider;
