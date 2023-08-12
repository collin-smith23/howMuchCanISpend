import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as financeActions from "../../store/finance";
import './Navigation.css';
import logoImage from './logo/logo.jpg'

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const sessionUser = useSelector(state => state.session.user);

	const handleClick = async (e) => {
		e.preventDefault();

		dispatch(financeActions.getUserFinances());
	}

	return (
		<div className='nav-bar'>
			<div>
				<button className='logo-button' onClick={handleClick}>
				<NavLink exact to="/">
					<img src={logoImage} alt='Home' />
				</NavLink>
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