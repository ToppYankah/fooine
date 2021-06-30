import React, { useEffect, useState } from 'react';
import Icon from 'react-eva-icons/dist/Icon';
import { useParams } from 'react-router-dom';
import { useToken } from '../hooks/token';
import { useAuth } from '../providers/authProvider';
import { useCart } from '../providers/cartProvider';
import { useProducts, getStatus } from '../providers/productProvider';
import Loader from './simple_loader';

const ProductViewPage = () => {
    const params = useParams();
    const {products, comment, getProductById, loading: productsLoading} = useProducts();
    const {cart, addToCart, removeFromCart} = useCart();
    const [token] = useToken();
    const {isAuth, user, loading: AuthLoading} = useAuth();
    const [held, setHeld] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [commentMsg, setCommentMsg] = useState("");
    const product = getProductById(params.id);

    useEffect(() => {
        setHeld(product.heldBy && product.heldBy !== "")
        setInCart(cart.includes(product.id));
    }, [cart, products]);

    const handleComment = (e)=>{
        e.preventDefault();
        if(commentMsg && commentMsg !== ""){
            comment( isAuth ? user.name : "Unknown", commentMsg, product);
            setCommentMsg("");
        }
    }

    const onClosePage = ()=>{
        // remove current feed
        setTimeout(()=>{
            document.body.style.overflow = "auto";
            window.history.go(-1)
        }, 150);
    }

    return (
        <div className='single-product-page'>
            {productsLoading || AuthLoading ? <Loader /> : <><div className="close-sheet" onClick={onClosePage}></div>
            <div className={`main-page`}>
                <div className="close-button" onClick={onClosePage}>
                    <Icon name="close" fill="#ffffff" size="medium" />
                </div>
                <div className="img-box" style={{backgroundImage: `url(${product.imageUrl})`}}></div>
                <div className="mute-heading">
                    <hr /><b>Details</b><hr />
                </div>
                <div className="details">
                    <div  style={{flex: '1'}}>
                        <h2 style={{marginBottom: 10}}>{product.name}</h2>
                        <div style={{marginBottom: 10}}>
                            <span className="tag" style={{marginRight: 10}}>{product.size} Size</span>
                            <span className="tag">{getStatus(product.status).value}</span>
                        </div>
                    </div>
                    <div>
                        <p className='price'>GHC <b style={{fontSize: 25}}>{parseFloat(product.price).toFixed(2)}</b></p>
                    </div>               
                </div>
                <div className="purchase-actions">
                    {/* <button onClick={()=> held ? unholdProduct(product.id) : holdProduct(product.id, 1)} id="hold">
                        <Icon name="pause-circle-outline" size="medium" fill="var(--dark-color)" />
                        <b>{held ? "Unhold Item" : "Hold Item"}</b>
                    </button> */}
                    {product.status !== 2 ? <button onClick={()=> inCart ? removeFromCart(isAuth ? user.id : token, product.id) : addToCart(isAuth ? user.id : token, product.id)} id="add-to-cart">
                        <Icon name="shopping-cart-outline" size="medium" fill="#fff" />
                        <b>{inCart ? 'Remove from cart' : 'Add to cart'}</b>
                    </button> : <></>}
                </div>
                <div className="mute-heading">
                    <hr /><b>Comments</b><hr />
                </div>
                <div className="comment-section">
                    <form onSubmit={handleComment} className="comment-input">
                        <input type="text" value={commentMsg} onChange={({target: {value}})=> setCommentMsg(value)} placeholder="Leave a comment on this item" />
                    </form>
                    <div className="comments-list">
                        {product.comments.map(comment => <Comment  comment={comment}/>)}
                    </div>
                </div>
            </div> </>}
            <style jsx>{`
                .single-product-page{
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);  
                    z-index: 100;
                }

                .single-product-page .close-sheet{
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    background: #0000005a;
                }

                .single-product-page .main-page{
                    margin: 0 auto;
                    padding: 40px 40px;
                    max-width: 550px;
                    width: 100%;
                    background: #fff;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    animation: scale-in .15s cubic-bezier(0.04, 1.12, 0.37, 1.15);
                    overflow: auto;
                }

                .single-product-page .main-page::-webkit-scrollbar{
                    display: none;
                }

                .single-product-page .main-page.close{
                    animation: scale-out .15s cubic-bezier(0.04, 1.12, 0.37, 1.15);
                }
                
                @keyframes scale-in{
                    0%{
                        transform: scale(1.15);
                        opacity: 0.5;
                    }
                }

                @keyframes scale-out{
                    100%{
                        opacity: 0;
                    }
                }
                
                .single-product-page .close-button{
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background-color: #0000005a;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 25px;
                    cursor: pointer;
                }

                .single-product-page .img-box{
                    width: 100%;
                    min-height: 500px;
                    border-radius: 20px;
                    background-color: var(--light-color);
                    background-size: cover;
                    background-position: center;
                    margin-bottom: 20px;
                }
                .single-product-page .details{
                    display: flex;
                }

                .single-product-page .details h2{
                    font-size: 20px;
                    color: var(--text-color);
                }

                .single-product-page .details .tag{
                    padding: 5px 10px;
                    background: var(--light-color);
                    color: var(--dark-color);
                    font-size: 12px;
                    margin-right: 10px;
                    border-radius: 10px;
                }
                .single-product-page .details .tag b{
                    font-size: 8px;
                }

                .single-product-page .details > div:first-child b{
                    font-size: 14px;
                }
                .single-product-page .details .price,
                .single-product-page .details .price *
                 {
                    color: var(--dark-color);
                }

                .single-product-page .purchase-actions{
                    display: flex;
                    padding: 15px 0;
                    align-items: center;
                }

                #hold, #add-to-cart{
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                    border-radius: 10px;
                    color: white;
                    font-size: 13px;
                    border: 1px solid var(--dark-color);
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .purchase-actions button b{
                    margin-left: 10px;
                }

                #hold{
                    background: transparent;
                    color: var(--dark-color);
                    margin-right: 20px;
                }
                #add-to-cart{
                    background: var(--dark-color);
                }

                .comment-input{
                    display: flex;
                    align-items: center;
                    padding: 5px 10px;
                    background-color: #f0f0f0;
                    border-radius: 10px;
                }

                .comment-input input{
                    flex: 1;
                    border: none;
                    padding: 10px;
                    background: transparent;
                    outline: none;
                }

                .comments-list{
                    max-height: 300px;
                    overflow: auto;
                    margin-top: 20px;
                    padding: 0px 20px;
                }
                .comments-list::-webkit-scrollbar{
                    display: none;
                    width: 2px;
                }
            `}</style>
        </div>
    );
}

const Comment = ({comment})=>{
    return <div className="comment">
        <div className="user-name">
            <Icon name="person-outline" fill="#777" size='medium'></Icon>
            <b style={{marginLeft: 10, fontSize: 13}}>{comment.by}</b>
        </div>
        <div className="message">{comment.comment}</div>
        <style jsx>{`
            .comment{
                display: flex;
                flex-direction: column;
                padding-top: 10px;
            }    
            .comment .user-name{
                display: flex;
                align-items: center;
            }
            .comment .message{
                padding: 5px 0;
                padding-bottom: 15px;
                margin-left: 6.5%;
                font-size: 12px;
                color: #555;
                border-bottom: 1px solid #f0f0f0;
                font-weight: 300;
                letter-spacing: 0.5px;
                font-weight: 300;
            }
        `}</style>
    </div>
}

export default ProductViewPage;
