import React from 'react';
import Icon from 'react-eva-icons';


const InputBox = ({name, icon, placeholder, type, value="", onChange})=>{
    return <div className="input-box">
        <Icon name={icon} fill='#777' size="medium" />
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} />
        <style jsx>{`
            .input-box{
                padding: 10px;
                background: #efefef;
                border-radius: 10px;
                display: flex;
                align-items: center;
                margin: 0 auto;
                margin-bottom: 15px;
            }

            .input-box input{
                margin-left: 10px;
                padding: 5px 0;
                padding-left: 10px;
                flex: 1;
                margin-right: 10px;
                border: none;
                background: transparent;
                outline: none;
                border-left: 1px solid #dfdfdf;
            }
        `}</style>
    </div>
}

export default InputBox;