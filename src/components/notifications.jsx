import React, {useEffect} from 'react';
import '../css/notifications.css';
import {FaBell, FaBellSlash} from '@meronex/icons/fa';
import {BiBell} from '@meronex/icons/bi';
import { useState } from 'react/cjs/react.development';
import { useNotification } from '../providers/notificationProvider';
import { AiFillCloseCircle, AiFillDelete, AiFillDownCircle, AiFillUpCircle, AiOutlineArrowDown } from '@meronex/icons/ai';
import EmptyView from './empty_view';

const DesktopNotifications = () => {
    const [show, setShow] = useState(false);
    const [holdOn, setHoldOn] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const {notifications} = useNotification();

    useEffect(() => {
        setShowMessage(false);
    }, []);

    useEffect(() => {
        document.addEventListener("mousemove", mousemoveEvent);

        function mousemoveEvent({clientX}){
            if(clientX >= window.innerWidth - (window.innerWidth*0.1)){
                return setShow(true)
            }
            setShow(false);
        }

        return ()=>{
            document.removeEventListener("mousemove", mousemoveEvent)
        }
    }, []);

    const closeNotifications = ()=>{
        document.querySelector('.notification-list').classList.add('hide');
        setTimeout(()=>{
            document.querySelector('.notification-list').classList.remove('hide');
            setHoldOn(false);
        }, 200)
    }

    const toggleShow = ()=>{
        if(holdOn){
             closeNotifications()
        } else {
            setHoldOn(true)
        }
    }

    return (
        <div className={`notifications ${holdOn || show ? "show" : ""}`}>
            <div onClick={toggleShow} className="bubble-btn">
                <FaBell size={18} color="#222" />
                {notifications.length < 1 ? <></> : <div className="tag">{notifications.length}</div>}
            </div>
            {holdOn ? <div className="notification-list">
                <header>
                    <h5 style={{fontSize: 14}}>Notifications</h5>
                    {/* <div className="tag">{notifications.length}</div> */}
                    <AiFillCloseCircle onClick={closeNotifications} size={20} color="#bbb" style={{marginLeft: "auto", cursor: "pointer"}} />
                </header>
                <div className="content">
                    {notifications.isEmpty ? <EmptyView message="No notifications available" useIcon={true} icon={<FaBellSlash size={60} color="#ddd"/>} /> : notifications.map(item=> <NotificationItem notification={item} />) }
                </div>
            </div> : <></>}
            <div className={`quick-message ${showMessage ? 'show' : ''}`}>
                <figure>
                    <BiBell size={30} color="#ccc" />
                </figure>
                <div className="info">
                    <h4>Notification title</h4>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus ut rerum asperiores dolor.</p>
                </div>
            </div>
        </div>
    );
}

const NotificationItem = ({notification})=>{
    const [open, setOpen] = useState(false);
    
    const reduceMessage = ()=>{
        if(notification.message && notification.message.length > 50){
            return notification.message.substring(0, 50).concat('...');
        }
    }

    return <div className="item">
        <header>
            <h5 style={{fontSize: "12px"}}>{notification.title}</h5>
            <div className="actions">
                {notification.message.length > 50 ? 
                open ? <AiFillUpCircle onClick={()=>setOpen(!open)} size={20} style={{cursor: "pointer"}} color="#aaa" /> : <AiFillDownCircle onClick={()=>setOpen(!open)} size={20} style={{cursor: "pointer"}} color="#aaa" /> 
                : <></>}
                <AiFillDelete style={{marginLeft: 8, cursor: "pointer"}} size={17} color="#ff000077" />
            </div>
        </header>
        <p style={{fontSize: "11px", color: "#777", fontWeight: "500"}}>
            {notification.message.length > 50 ? open ? notification.message : reduceMessage() : notification.message}
        </p>
    </div>
}

export default DesktopNotifications;
