import React, { useState, useContext } from 'react';
import api from '../api';
import { useJWT } from '../hooks';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jwt, setJwt] = useJWT();
    const [error, setError] = useState("");

    const throwError = (err)=>{
        setError(err);
        setTimeout(()=>{
            setError("");
        }, 2000)
    }   

    const presetUser = (user)=>{
        if(user !== null && jwt){
            setUser(user);
            setIsAuth(true);
        }
    }

    const login = (data) => {
        setLoading(true);
        setTimeout(()=>{
            const result = api.loginUser(data);
            console.log(result);
            if(result.success){
                setUser(result.user);
                setJwt(result.token);
                setIsAuth(true);
                setLoading(false);
            }else{
                throwError(result.error)
                setLoading(false);
            }
        }, 2000)
    }

    const signup = (data) => {
        setLoading(true);
        if(data.password === data.c_password){
            if(data.password.length < 8) {
                setLoading(false);
                return throwError("Password should have at least 8 characters")
            }

            const result = api.signupUser(data);
            return setTimeout(()=>{
                if(result.success){
                    setUser(result.user);
                    setJwt(result.token);
                    setIsAuth(true);
                    setLoading(false);
                }else{
                    throwError(result.error)
                    setLoading(false);
                }
            }, 2000)
        }
        setLoading(false);
        throwError("Passwords does not match")
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
            login, signup, logout, presetUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
