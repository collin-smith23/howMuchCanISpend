import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as memberActions from "../../store/member";
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import DisplayMembers from './allMembers';
import './members.css'

function Members() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const members = useSelector((state) => state.member.members.members);
    const eventId = useParams().eventId
    const [isUserMember, setIsUserMember] = useState(false)
    const [showMenu, setShowMenu] = useState(false);
    const [errors, setErrors] = useState([]);
    const ulRef = useRef();
    const { closeModal } = useModal();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true)
    };

    useEffect(() => {
        if (user) {
            dispatch(memberActions.getAllMembers(eventId));
            console.log('this is members', members)
        } else {
            return (
                <div>Must be logged in to view</div>
            )
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (members && members.length > 0) {
            setIsUserMember(members.some((member) => member.user_id === user.id));
            console.log('isUserMember:', isUserMember);
        }
    }, [members, user]);

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener("click", closeMenu)
        return () => document.removeEventListener("click", closeMenu)
    }, [showMenu])

    return isUserMember ? (
        <div className='member-button'>
            <OpenModalButton
                buttonText={members.length}
                onItemClick={openMenu}
                modalComponent={<DisplayMembers members={members} eventId={eventId} closeModal={closeModal} />}
            />
        </div>
    ) : (
        <div>
            <button onClick={(e) => window.alert('Feature Coming Soon!')}>Join Event</button>
        </div>
    );
};

export default Members