import React, { useEffect } from 'react';
import '../css/profile.css';
import { Link, useHistory } from 'react-router-dom';
import Icon from 'react-eva-icons/dist/Icon';
import { useAuth } from '../providers/authProvider';
import Loader from './simple_loader';
import { useCart } from '../providers/cartProvider';

const ProfilePopup = () => {
    const {user, isAuth, logout, loading} = useAuth();
    const {cart} = useCart();
    const history = useHistory();

    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);

    useEffect(() => {
       if(!isAuth){
           handleClose();
       }
    }, [isAuth]);

    const handleClose = ()=>{
        document.body.style.overflow = "auto";
        history.replace('/');
    }

    const handleLogout = (e)=>{
        e.preventDefault();
        logout();
    }

    return (
        <div className="profile_popup">
            <div onClick={handleClose} className="close-bg"></div>
            <div className="content">
                <div className="header">
                    <h3>My Profile</h3>
                </div>
                <div className="acc-info">
                    <div className="profile-img">
                        <Icon name="person" size="xlarge" fill="#aaa" />
                    </div>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                </div>
                <div className="option-list">
                    <Link className="option" to="/cart">
                        <p>
                            <Icon name="shopping-cart-outline" fill="#555" size="medium" />
                            <b>My Cart</b>
                            <span className="tag">{cart.length}</span>
                        </p>
                    </Link>
                    <Link className="option" to="/profile/option">
                        <p>
                            <Icon name="star-outline" fill="#555" size="medium" />
                            <b>My Wish List</b>
                            <span className="tag">0</span>
                        </p>
                    </Link>
                    <Link className="option" onClick={handleLogout}>
                        <p><Icon name="log-out-outline" fill="#555" size="medium" /><b>Logout</b></p>
                    </Link>
                </div>
                {loading ? <Loader expand={true} /> : <></>}
            </div>
        </div>
    );
}

export default ProfilePopup;
