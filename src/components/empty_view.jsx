import React from 'react';
import Icon from 'react-eva-icons/dist/Icon';

const EmptyView = ({message, icon}) => {
    return (
        <div className="empty-box">
            <Icon name={icon} size="xlarge" fill="#ddd" />
            <p>{message}</p>
            <style jsx>{`
                .empty-box{
                    padding: 0 20%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }

                .empty-box p{
                    margin-top: 20px;
                    font-size: 16px;
                    color: #999;
                }
            `}</style>
        </div>
    );
}

export default EmptyView;
