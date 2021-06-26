import React, { useEffect, useState } from 'react';
import Icon from 'react-eva-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';
import { useProducts } from '../providers/productProvider';
import Loader from './simple_loader';

const FeedCard = ({feed}) => {
    const {user, isAuth} = useAuth();
    const {loading, like, addToWishList, share} = useProducts();
    const [liked, setLiked] = useState(feed.likes.includes(user.id));
    const [wishlisted, setWishlisted] = useState(feed.wishlist.includes(user.id));

    const onViewItem = ()=>{
        // set current open feed
        document.body.style.overflow = "hidden";
        // onClick();
    }

    const handleLike = ()=> {
        if(loading) return;
        if(!liked && isAuth){
            setLiked(like(user.id, feed.id))
        }else{
            setLiked(!like(user.id, feed.id, true))
        }
    }

    return (
        <div className='feed-card' 
        style={{backgroundImage: `url(${feed.image})`}}
        >
            <div className="actions">
                <div onClick={handleLike} className={`like ${liked ? 'active' : ''}`}>
                    <Icon name={"heart-outline"} fill={'#fff'} size="medium" />
                    <div className="count">{feed.likes.length}</div>
                </div>
                <div onClick={()=> isAuth ? addToWishList(user.id) : ()=>{}} className={`wish ${wishlisted ? 'active' : ''}`}>
                    <Icon name={"star-outline"} fill={'#fff'} size="medium" />
                    <div className="count" style={{background: "#FF9900"}}>{feed.wishlist.length}</div>
                </div>
                <div onClick={()=>{}} className="share">
                    <Icon name="share-outline" fill='#ffffff' size="medium" />
                    <div className="count" style={{background: "#ffffff", color: "#555"}}>{feed.shares.length}</div>
                </div>
            </div>
            <Link className="details" to={`/preview-product/${feed.id}`} onClick={onViewItem}>
                    <h3>{feed.name}</h3>
                    <p>{feed.size} Size</p>
                    <p><small>GHC</small><span>{feed.price}</span></p>
                    <div className="status">{feed.status}</div>
            </Link>
            <style jsx>{`
                .feed-card{
                    min-width: 350px;
                    width: 25vw;
                    min-height: 500px;
                    border-radius: 20px;
                    background-color: #efefef;
                    border: 1px solid #efefef;
                    background-position: center center;
                    background-size: cover;
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
                    color: white;
                    background: #ffffff2a;
                    cursor: pointer;
                }

                div.like.active{
                    background: #FF3C00;
                }
                div.wish.active{
                    background: #FF9900;
                }

                .feed-card .actions div:nth-child(2){
                    margin: 10px 0;
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
                    bottom: 10%;
                    right: 0;
                    min-width: 60%;
                    max-width: 70%;
                    padding: 10px 20px;
                    padding-top: 20px;
                    min-height: 20%;
                    border-right: none;
                    border-top-left-radius: 20px;
                    border-bottom-left-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: white;
                    background-color: #0000005a;
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);                    
                }

                .feed-card h3{
                    font-size: 16px;
                    font-family: var(--font-regular)
                }

                .feed-card p{
                    font-size: 14px;
                    margin-top: 10px;
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
                    background-color: var(--warning-color);
                    font-size: 12px;
                }

                .feed-card .details *{user-select: none;}
            `}</style>
        </div>
    );
}

export default FeedCard;
