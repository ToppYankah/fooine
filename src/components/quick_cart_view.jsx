import React, {useState} from 'react';
import Icon from 'react-eva-icons/dist/Icon';
import { Link } from 'react-router-dom';
import { useToken } from '../hooks/token';
import { useAuth } from '../providers/authProvider';
import { useCart } from '../providers/cartProvider';
import { useProducts } from '../providers/productProvider';
import EmptyView from './empty_view';

const QuickCartView = () => {
    const {getProductById} = useProducts();
    const {removeFromCart, checkOut} = useCart();
    const {isAuth, user} = useAuth();
    const [token] = useToken();
    const [open, setOpen] = useState(true);

    return (
        <div className={`quick-cart-view ${open ? "show" : ""}`}>
            <div onClick={()=> setOpen(!open)} className="toggler">{open ? "Hide Cart" : "Show Cart"}</div>
            <div className="body-wrap">
                <div className="cart-list">
                    {checkOut.map(item=> 
                        <div className="item">
                            <Link to={"/preview-product/" + item}>
                                <img src={getProductById(item).imageUrl} alt="cart item" />
                            </Link>
                            <div onClick={()=> removeFromCart(isAuth ? user.id : token, item)} className="remove-btn">
                                <Icon name="close-outline" fill="white" size="small" />
                            </div>
                        </div>
                    )}
                    {checkOut.length < 1 ? <EmptyView message="Checkout cart is empty" useIcon={false} /> : <></>}
                </div>
                <div className="checkout-btn-box">
                    <Link to="/cart/checkout" className="btn">Checkout</Link>
                </div>
            </div>
            <style jsx>{`
                .quick-cart-view{
                    position: fixed;
                    bottom: calc(-130px + 50px);
                    right: 0;
                    left: 0;
                    background: #fff;
                    padding: 10px 0;
                    border-top: 1px solid #eee;
                    transition: all .1s linear;
                }

                .quick-cart-view .toggler{
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 10px 20px;
                    font-size: 12px;
                    background: #eee;
                    border-top-right-radius: 10px;
                    border-top-left-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .quick-cart-view.show{
                    bottom: 0;
                }

                .quick-cart-view .body-wrap{
                    display: flex;
                    align-items: center;
                    padding: 0 5%;
                }

                .quick-cart-view .cart-list{
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    flex: 1;
                    overflow-x: auto;
                    margin-right: 10px;
                    padding-top: 5px;
                }
                .quick-cart-view .cart-list::-webkit-scrollbar{
                    display: none;
                }

                .cart-list .item{
                    animation: bounce .3s cubic-bezier(0.36, 0.63, 0, 1.32);
                }

                .cart-list .item:not(:last-child){
                    margin-right: 20px;
                }

                .cart-list .item .remove-btn{
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: red;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .cart-list .item img{
                    width: 55px;
                    height: 55px;
                    object-fit: cover;
                    border-radius: 10px;
                    border: 5px solid #eee;
                }

                @keyframes bounce{
                    0%{
                        transform: scale(0);
                    }
                    50%{
                        transform: scale(1.1);
                    }
                    100%{
                        transform: scale(1);
                    }
                }

                .quick-cart-view .btn{
                    padding: 10px 20px;
                    background: var(--dark-color);
                    color: #fff;
                    border-radius: 10px;
                    font-size: 13px;
                }
            `}</style>
        </div>
    );
}

export default QuickCartView;
