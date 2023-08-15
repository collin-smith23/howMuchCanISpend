import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css'; // Import default styles
import './dark-mode.css'; // Import dark mode styles
import logoImage from './logo/logo.jpg';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        window.alert('Feature coming soon!')
        setDarkMode(prevDarkMode => !prevDarkMode);
        console.log('this is dark mode', darkMode)
    };

    return (
        <div className={`nav-bar`}>
            <div className={`background-container ${darkMode ? 'dark-mode' : ''}`}>
                <NavLink exact to="/">
                    <img src={logoImage} alt='Home' />
                </NavLink>
            </div>
            <div className='dark-mode-button'>
                <button onClick={toggleDarkMode}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            {isLoaded && (
                <div className='profile-button'>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    );
}

export default Navigation;