import React, { useEffect } from 'react';
import FeedCard from './feed_card';
import { Link } from 'react-router-dom';

const FeedSection = ({products}) => {
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
            <div className="inner" id="scroll-feed">
                {products.map((feed, id)=>(<FeedCard feed={feed} key={id} />))}
            </div>
            <QuickAccessFeedSection feeds={products} />
            <style jsx="true">{`
                .feed-section .inner{
                    padding: 50px 5%;
                    display: flex;
                    align-items: center;
                    overflow: auto;
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

export default FeedSection;
