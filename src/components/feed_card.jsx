import React from 'react';
import Icon from 'react-eva-icons';
import { Link } from 'react-router-dom';
import { useToken } from '../hooks/token';
import { useAuth } from '../providers/authProvider';
import { useWatchlist } from '../providers/watchlistProvider';
import { useProducts, getStatus } from '../providers/productProvider';

const LiveFeedCard = ({feed}) => {
    const {user, isAuth} = useAuth();
    const [token] = useToken();
    const {products, like, share, holdProduct, unholdProduct} = useProducts();
    const {watchlist, isWatching, addToWatchlist, removeFromWatchlist} = useWatchlist();
    const productId = feed.id;

    const onViewItem = ()=>{
        // set current open feed
        document.body.style.overflow = "hidden";
        // onClick();
    }

    const handleAddToWatchlist = ()=>{
        if(isWatching(feed.id)){
            removeFromWatchlist(productId);
        }else{
            addToWatchlist(isAuth ? user.id : token, productId);
        }
    }

    const handleHoldItem = ()=>{
        if(feed.heldBy !== ""){
            unholdProduct(isAuth ? user.id : token, feed);
        }else{
            holdProduct(isAuth ? user.id : token, feed);
        }
    }

    return (
        <div className='feed-card' 
        style={{backgroundImage: `url(${feed.imageUrl})`}}
        >
            <div style={{display: "flex", paddingTop: 20}}>
                {feed.status === 1 ? <img src="/images/held-img.png" style={{opacity: 0.9, margin: "0 auto"}} width="50%" /> : <></>}
            </div>
            <div className="details" onClick={onViewItem}>
                <div style={{background: getStatus(feed.status).color}} className="status">{getStatus(feed.status).value}</div>
                <Link to={`/preview-product/${feed.id}`} >
                    <h3>{feed.name}</h3>
                    <p>{feed.size} Size</p>
                    <p><small>GHC</small><span>{parseFloat(feed.price).toFixed(2)}</span></p>
                </Link>
                {feed.status !== 2 ? 
                <div className="add-section">
                    {feed.heldBy === (isAuth ? user.id : token) ? <></> :<label htmlFor={feed.id} className="add-to-watchlist">
                        <input type="checkbox" checked={isWatching(feed.id)} name="add-watchlist" className="add-watchlist" id={feed.id} onChange={handleAddToWatchlist} />
                        <div className="check-box">
                            <Icon name="checkmark-outline" fill="#fff" size="small"/>
                        </div>
                        <span>{isWatching(feed.id) ? "Unwatch" : "Watch"}</span>
                    </label>}
                    {feed.status === 1 && !(feed.heldBy === (isAuth ? user.id : token )) ? 
                    <></> : <label htmlFor={`${feed.id}hold`} className="hold">
                        <input type="checkbox" checked={(feed.heldBy === (isAuth ? user.id : token ))} name="add-watchlist" className="add-watchlist" id={`${feed.id}hold`} onChange={handleHoldItem} />
                        <div className="check-box">
                            <Icon name="checkmark-outline" fill="#fff" size="small"/>
                        </div>
                        <span>{(feed.heldBy === (isAuth ? user.id : token )) ? "Drop" : "Hold"}</span>
                    </label>}
                </div> : 
                <></>}
            </div>
            <style jsx>{`
                .feed-card{
                    min-width: 300px;
                    min-height: 300px;
                    border-radius: 20px;
                    background-color: #efefef;
                    border: 1px solid #efefef;
                    background-position: center center;
                    background-size: cover;
                }

                .feed-card .add-section{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 10px;
                    border-top: 1px solid #ffffff1a;
                    padding-top: 10px;
                    padding-right: 20px;
                }
                .feed-card .add-section > label{
                    display: flex;
                    cursor: pointer;
                }
                .feed-card .add-watchlist{display: none}
                .feed-card .add-watchlist:checked + .check-box{
                    background: var(--dark-color)
                }
                .feed-card .add-watchlist:checked + .check-box > *{
                    display: block;
                }
                .feed-card .add-section .check-box{
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    border: 2px solid var(--dark-color);
                    margin-right: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .feed-card .add-section .check-box > *{
                    display: none;
                }
                .feed-card .add-section span{
                    font-size: 12px;
                }

                .feed-card:not(:last-child){
                    margin-right: 50px;
                }

                .feed-card .actions{
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    border-radius: 50px;
                    background-color: #0000005a;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                    opacity: 0.2;
                    pointer-events: none;
                    transition: opacity .3s;
                }

                .feed-card:hover .actions{
                    opacity: 1;
                    pointer-events: initial;
                }

                .feed-card .actions > div{
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff2a;
                    cursor: pointer;
                }

                .feed-card .actions div:nth-child(2){
                    margin: 5px 0;
                }

                .feed-card .actions > div:hover .count{
                    opacity: 1;
                    transform: translateX(-50%) translateY(0px);
                }

                .feed-card .actions .count{
                    position: absolute;
                    left: 50%;
                    bottom: 100%;
                    transform: translateX(-50%) translateY(5px);
                    padding: 5px 20px;
                    font-size: 13px;
                    color: #ffffff;
                    background: #FF3300;
                    border-radius: 20px;
                    opacity: 0;
                    transition: all .5s cubic-bezier(0.03, 0.95, 0.27, 1.07);
                    pointer-events: none;
                }

                .feed-card .actions .count::before{
                    content: "";
                    position: absolute;
                    top: calc(100% - 6px);
                    left: 50%;
                    transform: translateX(-50%) rotate(45deg);
                    width: 10px;
                    height: 10px;
                    background: inherit;
                }

                .feed-card .details{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    min-width: 60%;
                    max-width: 70%;
                    padding: 10px 20px;
                    padding-top: 20px;
                    padding-right: 0;
                    min-height: 20%;
                    border-right: none;
                    border-radius: 20px 0 20px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: white;
                    background-color: #0000005a;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);                    
                }

                .feed-card *{
                    color: #fff;
                }

                .feed-card h3{
                    font-size: 16px;
                    font-family: var(--font-regular)
                }

                .feed-card p{
                    font-size: 14px;
                    margin-top: 5px;
                }

                .feed-card span{
                    font-size: 20px;
                    margin-left: 5px;
                    font-family: 'gilroyBold'
                }

                .feed-card .status{
                    position: absolute;
                    top: -12px;
                    left: 20px;
                    padding: 5px 10px;
                    border-radius: 8px;
                    font-size: 12px;
                }

                .feed-card .details *{user-select: none;}
            `}</style>
        </div>
    );
}

export default LiveFeedCard;
