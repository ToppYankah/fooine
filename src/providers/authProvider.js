import React, { useState, useContext, useEffect } from 'react';
import { v4 } from 'uuid';
import api from '../api';
import firebase from '../firebase';
import { useToken, useAuthToken } from '../hooks/token';
import {generate as generateHash} from 'password-hash';
import { useError } from './errorProvider';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const {error, createError} = useError()
    const [token, setToken] = useToken();
    const [authToken, setAuthToken] = useAuthToken();

    // initializing firestore refs
    const store = firebase.firestore();
    const usersRef = store.collection('users');
    const tokensRef = store.collection('tokens')

    useEffect(() => {
        setLoading(true);
        if(authToken && authToken !== ""){
            getUserDetails();
        }else{
            setAnonymous(v4())
        }
    }, []);

    const getUserDetails = ()=>{
        usersRef.doc(authToken).get()
        .then(uref=>{
            setUser(uref.data());
            setIsAuth(true);
            setLoading(false);
        })
        .catch(error=>{
            setLoading(false);
            console.log(error);
        })
    }

    const setAnonymous = (temp_id)=>{
        setLoading(true);
        if(!token){
            tokensRef.doc().set({id: temp_id})
            .then(_=>{
                setToken(temp_id);
                setLoading(false);
            })
            .catch(err=>{
                console.log(err);
                setLoading(false);
            });
        }else{
            setLoading(false);
        }
    }

    // const throwError = (err)=>{
    //     setError(err);
    //     setTimeout(()=>{
    //         setError("");
    //     }, 2000)
    // }   

    const login = ({email, password}) => {
        setLoading(true);
        usersRef.get().then(snapshot=>{
            console.log("success", snapshot);
            let foundUser = null;
            snapshot.forEach(function(childSnapshot) {
                var data = childSnapshot.data();
                if(data.email === email && generateHash(data.password) === password){
                    foundUser = data;
                }
            });
            if(foundUser){
                setToken("");
                setAuthToken(foundUser.id);
                setUser(foundUser);
                setIsAuth(true);
            }else{
                createError("User does not exist", 2000);
            }
            setLoading(false);
        }).catch(error=>{
            console.log(error);
            setLoading(false);
        })
    }

    const signup = (data) => {
        setLoading(true);
        if(data.password === data.c_password){
            const userID = v4();
            setAuthToken(userID);
            usersRef.doc(userID).set({...data, id: userID, password: generateHash(data.password)})
            .then(uref=>{
                delete data.password;
                setToken("");
                setAuthToken(userID);
                setUser(data);
                setIsAuth(true);
                setLoading(false);
            }).catch(error=>{
                console.log(error);
            });
        }else{
            setLoading(false);
            createError("Passwords does not match", 2000)
        }
    }

    const logout = () => {
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
            setUser({});
            setIsAuth(false);
            localStorage.removeItem('_jwt');
        }, 1000)
        // Sign out here
    }

    return (
        <AuthContext.Provider value={{
            user, isAuth, loading, error,
            login, signup, logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
