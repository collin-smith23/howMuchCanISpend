import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logoImage from './logo/logo.jpg'

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className='nav-bar'>
			<div>
				<NavLink exact to="/">
					<img src={logoImage} alt='Home' />
				</NavLink>
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