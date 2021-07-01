import React from 'react';
import Icon from 'react-eva-icons/dist/Icon';

const EmptyView = ({message, icon, useIcon = true}) => {
    return (
        <div className="empty-box">
            {useIcon ? <Icon name={icon} size="xlarge" fill="#ddd" /> : <></>}
            <p style={{marginTop: useIcon ? 20 : 0}}>{message}</p>
            <style jsx>{`
                .empty-box{
                    padding: 0 20%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }

                .empty-box p{
                    font-size: 16px;
                    color: #999;
                }
            `}</style>
        </div>
    );
}

export default EmptyView;
