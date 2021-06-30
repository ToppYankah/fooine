import React, { useEffect, useState } from 'react';
import Icon from 'react-eva-icons/dist/Icon';
import { usePaystackPayment } from 'react-paystack';
import { Route, Link, useHistory } from 'react-router-dom';
import '../css/cart.css';
import { useToken } from '../hooks/token';
import { useAuth } from '../providers/authProvider';
import { useCart } from '../providers/cartProvider';
import { useProducts, getStatus } from '../providers/productProvider';
import EmptyView from './empty_view';
import InputBox from './input_box';

const regions = [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"
];

const CartCheckoutPopup = () => {
    const history = useHistory();

    const handleClose = ()=>{
        document.body.style.overflow = "auto";
        history.replace('/');
    }

    const handleGoBack = ()=>{
        document.body.style.overflow = "auto";
        history.goBack();
    }

    return (
        <div className="cart-popup">
            <div className="overlay" onClick={handleClose}></div>
            <div className="inner">
                <Route exact path="/cart/checkout">
                    <CheckoutPage onClose={handleGoBack} />
                </Route>
                <Route exact path="/cart">
                    <CartPage onClose={handleGoBack} />
                </Route>
            </div>
        </div>
    );
}

const CartPage = ({onClose})=>{
     useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);

    const {cart, checkOut} = useCart();
    const {getProductById} = useProducts();

    function getCheckoutTally(){
        let output = 0;
        checkOut.forEach(itemId=>{
            const productPrice = parseFloat(getProductById(itemId).price);
            output += productPrice;
        });
        return output;
    }

    return <div className="cart-page">
        <div className="header">
            <h3>My Cart</h3>
            <div onClick={onClose} className="close-btn">{'x'}</div>
        </div>
        <div className="body">
            {cart.length < 1 ? 
            <EmptyView message="Your cart is Empty" icon="shopping-cart-outline"/> : 
            cart.map((itemId, id) => <CartItem key={id} item={getProductById(itemId)} />
            )}
        </div>
        {cart.length > 0 && checkOut.length > 0 ? <div className="footer">
            <Link to="/cart/checkout" className="submit-btn">Proceed to checkout</Link>
            <p className="price-tally"><b>GHC</b><h3>{getCheckoutTally().toFixed(2)}</h3></p>
        </div> : <></>}
    </div>
}

const CartItem = ({item})=>{
    const {removeFromCheckout, addToCheckout, removeFromCart, checkOut} = useCart();
    const {user, isAuth,} = useAuth();
    const [token] = useToken();

    return (
        <div className="item">
            <div className="check">
                <div onClick={()=> checkOut.includes(item.id) ? removeFromCheckout(item.id) : addToCheckout(item.id)} className={`checker ${checkOut.includes(item.id) ? 'on' : ''}`}></div>
            </div>
            <div className="details">
                <div className="img" style={{backgroundImage: `url(${item.imageUrl})`}}></div>
                <Link to={`/preview-product/${item.id}`} className="info">
                    <h3>{item.name}</h3>
                    <p className="size">{item.size}</p>
                    <p className="size">{item.category}</p>
                    <span className="tag">{getStatus(item.status).value}</span>
                </Link >
                <div className="price">
                    <p><small>GHC</small><span>{parseFloat(item.price).toFixed(2)}</span></p>
                    <span onClick={()=>removeFromCart(isAuth ? user.id : token, item.id)} style={{color: "#ccc", fontSize: 12}}>- Remove -</span>
                </div>
            </div>
            <style jsx>{`
                .item{
                    display: flex;
                    align-items: center;
                    justify-content: stretch;
                    padding: 15px var(--padding-x);
                    border-bottom: 1px solid #f5f5f5;
                    cursor: pointer;
                }
                .item:hover{
                    background: #fafafa;
                }
                .item .check{
                    width: 50px;
                    padding-top: 10px;
                }
                .item .check .checker{
                    width: 15px;
                    height: 15px;
                    border: 2px solid var(--dark-color);
                    border-radius: 50%;
                    cursor: pointer;
                }
                .item .check .checker.on{
                    background: var(--dark-color);
                }

                .item .img{
                    width: 60px;
                    height: 70px;
                    background-size: cover;
                    background-position: center;
                    margin-right: 15px;
                    border-radius: 10px;
                }

                .item .details{
                    display: flex;
                    flex: 1;
                    align-items: stretch;
                }
                .item .details .info{
                    flex: 1;
                    font-size: 14px;
                    color: #333;
                }

                .item .info h3{
                    font-size: 14px;
                }
                .item .info .size, 
                .item .info .tag{
                    margin: 2px 0;
                    font-size: 12px;
                }

                .item .info .tag{
                    color: #aaa;
                }

                .item .price{
                    color: var(--dark-color);
                    align-self: stretch;
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .item .price small{
                    font-size: 12px;
                    margin-right: 5px;
                }
                .item .price span{
                    font-size: 16px;
                }
            `}</style>
        </div>
    )
}

const CheckoutPage = ({onClose})=>{
    const [deliveryId, setDeliveryId] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const {clearCheckedOut, checkOut} = useCart();
    const [deliveryFee, setDeliveryFee] = useState(0)
    const {markProductsAsSold, getProductById} = useProducts();
    const [totalPayment, setTotalPayment] = useState(getCheckoutTally() + deliveryFee);
    const {user, isAuth} = useAuth();
    const [token] = useToken();
    const [email, setEmail] = useState(isAuth ? user.email : "");
    const history = useHistory();

    console.log(process.env.REACT_APP_PUBLIC_PAYSTACK_API_KEY)

    const initializePayment = usePaystackPayment({
        reference: (new Date()).getTime(),
        email: email,
        amount: totalPayment * 100,
        currency: 'GHS',
        publicKey: process.env.REACT_APP_PUBLIC_PAYSTACK_API_KEY,
    });

    useEffect(() => {
        setTotalPayment(getCheckoutTally() + deliveryFee)
    }, [deliveryFee]);

    useEffect(() => {
        if(checkOut.length < 1){
            history.replace('/cart');
        }
        document.body.style.overflow = "hidden";
    }, []);

    function getCheckoutTally(){
        let output = 0;
        checkOut.forEach(itemId=>{
            output += parseFloat(getProductById(itemId).price);
        });
        return output;
    }

    function getProductsForCheckout(){
        let output = [];

        checkOut.forEach(itemId=>{
            output.push(getProductById(itemId));
        })

        return output;
    }

    const handleCheckout = (e)=>{
        e.preventDefault();
        // initialize paystack for payment
        initializePayment(
        ({ transaction, reference, status }) => {
            // implementation for  whatever you want to do when the Paystack dialog closed.
            console.log("status", status);
            markProductsAsSold(getProductsForCheckout())
            clearCheckedOut(isAuth ? user.id : token);
            onClose();
        }, () => {
            // implementation for  whatever you want to do when the Paystack dialog closed.
            console.log('closed')
        })
    }

    return <form onSubmit={handleCheckout} className="checkout-page">
        <div className="header">
            <h3>Checkout</h3>
            <div onClick={onClose} className="close-btn">{'<'}</div>
        </div>
        <div className="body">
            <ProductsViewForCheckout checkoutProducts={getProductsForCheckout()} />
            {isAuth ? <></> :<div className="email-setup">
                <div className='label'>
                    Email Address
                </div>
                <div className="email-input">
                    <input autoFocus required value={email} name="email" type="email" placeholder="Enter your email address" onChange={({target: {value}})=> setEmail(value)} />
                </div>
            </div>}
            <div className="delivery-address">
                <div className='label'>
                    Delivery Setup
                </div>
                <div className="choose-delivery">
                    <button className={`${deliveryId == 0 ? 'selected' : ''}`} onClick={()=>{ setDeliveryId(0); setDeliveryFee(0)}}>Pick up</button>
                    <button className={`${deliveryId == 1 ? 'selected' : ''}`} onClick={()=>{ setDeliveryId(1); setDeliveryFee(0)}}>Parcel Office</button>
                    {/* <button className={`${deliveryId == 2 ? 'selected' : ''}`} onClick={()=> setDeliveryId(2)}>Doors Step</button> */}
                    <button className={`${deliveryId == 3 ? 'selected' : ''}`} onClick={()=> setDeliveryId(3)}><pre>Discounted shipping</pre></button>
                </div>
                {deliveryId == 1 ? 
                <div className="address-form">
                    <div className="warning">
                        <Icon name="info-outline" size="large" fill="orangered" />
                        <span style={{marginLeft: 10}}>By using this delivery option, you agree to pick your order at our designated partner's parcel office in your region.</span>
                    </div>
                    <select name="area-range" onChange={({target})=> {setDeliveryFee(target.value == "" ? 0 : parseFloat(target.value));}} id="area-range">
                        <option value="">Select your region</option>
                        <option value="10.00">Kumasi - 10.00</option>
                        <option value="50.00">Cape Coast - 50.00</option>
                        <option value="30.00">Accra - 30.00</option>
                        <option value="70.00">Tema - 70.00</option>
                    </select>
                </div> : <></>}
                {deliveryId == 2 ? 
                <div className="address-form">
                    <select name="area-range" onChange={({target})=> {setDeliveryFee(target.value == "" ? 0 : parseFloat(target.value));}} id="area-range">
                        <option value="">Select your region</option>
                        <option value="10.00">Kumasi - 10.00</option>
                        <option value="50.00">Cape Coast - 50.00</option>
                        <option value="30.00">Accra - 30.00</option>
                        <option value="70.00">Tema - 70.00</option>
                    </select>
                    <textarea value={deliveryAddress} onChange={(input)=> setDeliveryAddress(input.value)} placeholder="Enter delivery address"></textarea>
                </div> : <></>}
                {deliveryId == 3 ? 
                <div className="address-form">
                    <div className="warning">
                        <Icon name="info-outline" size="large" fill="orangered" />
                        <span style={{marginLeft: 10}}>Note: Discounted shipping is our cheapest shipping option to help you save on your order. This can take anywhere from 7-14 days to be delivered to our designated parcel office in your region.</span>
                    </div>
                    <select name="area-range" onChange={({target})=> {setDeliveryFee(target.value == "" ? 0 : parseFloat(target.value));}} id="area-range">
                        <option value="">Select your region</option>
                        {regions.map(region=> <option value="5.00">{region}</option>)}
                    </select>
                </div> : <></>}
            </div>
            <div className="amount-payable">
                <div className='label'>
                    Amount Payable
                </div>
                <div className="payable-details">
                    <div className="payable">
                        <b>Delivery Fee</b>
                        <span><small>GHC</small><big>{deliveryFee.toFixed(2)}</big></span>
                    </div>
                    <div className="payable">
                        <b>Product(s) Price</b>
                        <span><small>GHC</small><big>{getCheckoutTally().toFixed(2)}</big></span>
                    </div>
                    <div className="payable">
                        <b>Total Amount</b>
                        <span><small>GHC</small><big>{totalPayment.toFixed(2)}</big></span>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer">
            <button type="submit" className="submit-btn" style={{marginRight: 0}}>Accept Checkout</button>
        </div>
    </form>
}

const ProductsViewForCheckout = ({checkoutProducts})=>{
    const [hide, setHide] = useState(false);
    
    return <div className="products-view">
        <button onClick={()=> setHide(!hide)} className="toggler">{hide ? 'See Products' : 'Hide Products'}</button>
        <div className={`items-container ${hide ? "hidden" : ''}`}>
            {checkoutProducts.map(item=> <div className='item'>
                <img src={item.imageUrl} width={50} height={50} style={{objectFit: "cover"}} alt={item.name} />
                <div className="info">
                    <p><b>{item.name}</b></p>
                    <p style={{color: "#777"}}>{item.size} Size</p>
                </div>
                <span className="price"><small>GHC</small>{parseFloat(item.price).toFixed(2)}</span>
            </div>)}
        </div>
        <style jsx>{`
            .products-view{

            }    
            .products-view .toggler{
                min-width: 100%;
                border: none;
                background: #eee;
                color: #777;
                padding: 10px 0;
                cursor: pointer; 
            }

            .products-view .items-container{
                max-height: initial;
                transition: height .3s linear;
            }

            .products-view .items-container.hidden{
                max-height: 0px;
                overflow: hidden;
            }
            .products-view .items-container .item{
                padding: 10px 5%;
                border-bottom: 1px solid #fafafa;
                display: flex;
                align-items: center;
            }

            .products-view .item .price{
                margin-left: auto;
                color: var(--dark-color);
            }

            .products-view .item .info{
                margin-left: 10px;
            }

            .products-view img{
                border-radius: 10px;
            }

            .products-view .item p{
                font-size: 13px;
                line-height: 18px;
            }
        `}</style>
    </div>
}



export default CartCheckoutPopup;
