import React, {useState, useEffect} from 'react';
import Icon from 'react-eva-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';

const HomeHeader = ({onSearch}) => {
    const [authenticated, setAuthenticated] = useState(false);
    const {isAuth} = useAuth();

    useEffect(() => {
        setAuthenticated(isAuth);
    }, [isAuth]);

    const renderAuth = ()=>{
        return <>
        {authenticated ? 
        <>
            <Link to='/profile' className='profile-button'>
                    <Icon name="person-outline" fill='#555' size="medium" />
                    <b style={{marginLeft: 5}}>Profile</b>
            </Link>
        </> : 
        <>
            <Link to='/login' className='profile-button auth'>
                <b>Login</b>
            </Link>
            <Link to='/signup' className='profile-button auth'>
                <b><pre>Sign up</pre></b>
            </Link>
        </>}
        <Link to='/cart' className='profile-button'>
            <Icon name="shopping-cart-outline" fill='#555' size="medium" />
            <b style={{marginLeft: 5}}>Cart</b>
        </Link>
        </>
    }

    return (
        <div className='home-header'>
            <h4><pre>FOINE</pre></h4>
            <div className="search-form">
                <Icon name="search" fill='#555' />
                <input onChange={({target: {value}})=> onSearch(value)} type="text" placeholder='Search' aria-placeholder="Search" className="search-input"/>
            </div>
            {renderAuth()}
            <style jsx>{`
                .home-header{
                    padding: 20px 5%;
                    display: flex;
                    align-items: center;
                }

                .home-header .search-form{
                    border-radius: 15px;
                    flex: 1;
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                    margin: 0 5%;
                }

                .search-form input{
                    border: none;
                    background: transparent;
                    padding: 15px;
                    outline: none;
                    flex: 1;
                }

                .profile-button{
                    border-radius: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-family: var(--font-bold);
                    color: var(--text-color);
                }

                .profile-button:not(:last-child){
                    margin-right: 20px;
                }

                @media(max-width: 600px){
                    .home-header{
                        margin-bottom: 50px;
                    }
                    .home-header h4{
                        margin-right: auto;
                    }
                    .home-header .search-form{
                        position: absolute;
                        top: 100%;
                        width: 90%;
                        left: 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default HomeHeader;
