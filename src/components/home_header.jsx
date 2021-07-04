import { AiOutlineSearch } from '@meronex/icons/ai';
import { FaEye } from '@meronex/icons/fa';
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
                    <Icon name="person-outline" fill='#eee' size="medium" />
                    <b style={{marginLeft: 5}}>Profile</b>
            </Link>
        </> : 
        <>
            <Link to='/login' className='profile-button auth'>
                <b>Login</b>
            </Link>
            <Link to='/signup' className='profile-button auth'>
                <b><pre>Signup</pre></b>
            </Link>
        </>}
        <Link to='/watchlist' className='profile-button'>
            <FaEye size={18} color="#eee" />
            <b style={{marginLeft: 5}}>WatchList</b>
        </Link>
        </>
    }

    return (
        <div className='home-header'>
            <h4 style={{color: "#fff"}}><pre>FOINE.COM</pre></h4>
            <div className="search-form">
                <AiOutlineSearch size={20} color="#555" />
                <input onChange={({target: {value}})=> onSearch(value)} type="text" placeholder='Search by name or category' aria-placeholder="Search by name or category" className="search-input"/>
            </div>
            {renderAuth()}
            <style jsx>{`
                .home-header{
                    padding: 10px 5%;
                    display: flex;
                    align-items: center;
                    background: #222;
                }

                .home-header .search-form{
                    border-radius: 20px;
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
                    padding: 10px 15px;
                    outline: none;
                    flex: 1;
                    font-size: 12px;
                }

                .search-form input::-webkit-input-placeholder{
                    font-size: 12px;
                    color: #aaa;
                }

                .profile-button{
                    border-radius: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-family: var(--font-bold);
                    color: #ccc;
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
