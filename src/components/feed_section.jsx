import React, { useEffect } from 'react';
import LiveFeedCard from './feed_card';
import { Link } from 'react-router-dom';

const LiveFeedSection = ({products}) => {
    console.log(products);
    useEffect(() => {
        const feedsScrollView = document.getElementById('scroll-feed');
        let feedsPos = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandler = function(e) {
            feedsScrollView.style.cursor = 'grabbing';
            feedsScrollView.style.userSelect = 'none';
            feedsPos = {
                // The current scroll 
                left: feedsScrollView.scrollLeft,
                top: feedsScrollView.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            feedsScrollView.addEventListener('mouseup', mouseUpHandler);
            feedsScrollView.addEventListener('mousemove', mouseMoveHandler);
        };
        

        const mouseMoveHandler = function(e) {
            // How far the mouse has been moved
            const dx = e.clientX - feedsPos.x;
            const dy = e.clientY - feedsPos.y;

            // Scroll the element
            feedsScrollView.scrollTop = feedsPos.top - dy;
            feedsScrollView.scrollLeft = feedsPos.left - dx;
        };

        const mouseUpHandler = function() {
            feedsScrollView.style.cursor = 'grab';
            feedsScrollView.style.removeProperty('user-select');
            feedsScrollView.removeEventListener('mousemove', mouseMoveHandler);
        };

        feedsScrollView.addEventListener('mousedown', mouseDownHandler);
    }, []);

    return (
        <div className='feed-section'>
            <div className="live-notice">
                <div className="inner">
                    <div className="indicator"></div>
                    <p>Live Feed</p>
                </div>
                <hr />
            </div>
            <div className="inner" id="scroll-feed">
                {products.map((feed, id)=>(<LiveFeedCard feed={feed} key={id} />))}
            </div>
            <div className="vanishing-point left"></div>
            <div className="vanishing-point right"></div>
            {/* <QuickAccessFeedSection feeds={products} /> */}
            <style jsx>{`
                .feed-section .inner{
                    padding: 20px 5%;
                    display: flex;
                    align-items: center;
                    overflow: auto;
                }

                .feed-section .live-notice{
                    padding: 10px 5%;
                    display: flex;
                    align-items: center;
                    padding-bottom: 0;
                }

                .feed-section .live-notice .inner{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    border-radius: 20px;
                    box-shadow: 0 0 10px #ff00001a;
                }

                .feed-section .live-notice hr{
                    flex: 1;
                    border: none;
                    border-top: 1px solid;
                    border-color: #fafafa;

                }

                .feed-section .live-notice p{
                    font-size: 13px;
                }

                .feed-section .live-notice .indicator{
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: red;
                    margin-right: 15px;
                }
                .feed-section .live-notice .indicator::after,
                .feed-section .live-notice .indicator::before
                {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                }
                .feed-section .live-notice .indicator::before{
                    background: inherit;
                    animation: glow-scale 1s linear infinite;
                }
                .feed-section .live-notice .indicator::after{
                    border: 1px solid red;
                    transform: scale(2);
                    background: transparent;

                }

                @keyframes glow-scale{
                    100%{
                        transform: scale(2.2);
                        opacity: 0;
                    }
                }

                .feed-section .vanishing-point{
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 80px;
                }

                .feed-section .vanishing-point.left{
                    background: linear-gradient(to right, white, transparent);
                    left: 0;
                }
                .feed-section .vanishing-point.right{
                    background: linear-gradient(to left, white, transparent);
                    right: 0;
                }

                .feed-section .inner::-webkit-scrollbar{
                    display: none;
                }
            `}</style>
        </div>
    );
};

const QuickAccessFeedSection = ({feeds, onClickFeed})=>{
    useEffect(() => {
        const quickFeedScroll = document.getElementById('quick-feed');
        let quickFeedPos = { top: 0, left: 0, x: 0, y: 0 };

        
        const mouseDownHandler = function(e) {
            quickFeedScroll.style.cursor = 'grabbing';
            quickFeedScroll.style.userSelect = 'none';
            quickFeedPos = {
                // The current scroll 
                left: quickFeedScroll.scrollLeft,
                top: quickFeedScroll.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            quickFeedScroll.addEventListener('mouseup', mouseUpHandler);
            quickFeedScroll.addEventListener('mousemove', mouseMoveHandler);
        };
        

        const mouseMoveHandler = function(e) {
            // How far the mouse has been moved
            const dx = e.clientX - quickFeedPos.x;
            const dy = e.clientY - quickFeedPos.y;

            // Scroll the element
            quickFeedScroll.scrollTop = quickFeedPos.top - dy;
            quickFeedScroll.scrollLeft = quickFeedPos.left - dx;
        };

        const mouseUpHandler = function() {
            quickFeedScroll.style.cursor = 'grab';
            quickFeedScroll.style.removeProperty('user-select');
            quickFeedScroll.removeEventListener('mousemove', mouseMoveHandler);
        };

        quickFeedScroll.addEventListener('mousedown', mouseDownHandler);
    }, []);
    return (
        <>
        <div className="mute-heading">
            <hr /><b>Quick Feed</b><hr />
        </div>
        <div id="quick-feed" className="quick-access-feed">
            {feeds.map((feed, id)=><Link to={`/preview-product/${feed.id}`} key={id} className='quick-feed' style={{backgroundImage: `url(${feed.imageUrl})`}}></Link>)}
        </div>
            <style jsx>{`
                .quick-access-feed{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding: 20px 5%;
                    overflow: auto;
                }

                .quick-access-feed::-webkit-scrollbar{
                    display: none;
                }

                .quick-feed{
                    min-width: 80px;
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    background-size: cover;
                    background-position: center;
                    border: 5px solid #f5f5f5;
                    cursor: pointer;
                }

                .quick-feed:hover{
                    border-color: #eaeaea;
                }

                .quick-feed:not(:last-child){
                    margin-right: 20px;
                }
            `}</style>
        </>
    )
}

export default LiveFeedSection;
