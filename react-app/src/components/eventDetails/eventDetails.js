import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { byIdGetEvent, deleteEvent, editEvent, getAllEvents } from '../../store/event';
import * as memberActions from "../../store/member";
import AddMember from '../addMember/addMemberForm';
import { usersList } from '../../store/session';
import Members from '../members';
import EditEventForm from './editEvent';
import OpenModalButton from '../OpenModalButton';
import ConfirmDelete from '../confirmations/confirmDelete';
import { useModal } from '../../context/Modal'
import './eventDetails.css'

function EventDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector((state) => state.event);
    const user = useSelector((state) => state.session.user);
    const members = useSelector((state) => state.member.members.members);
    const eventId = useParams().eventId;
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const { closeModal } = useModal();

    const users = useSelector((state) => state.session.users);

    useEffect(() => {
        if (user){
            dispatch(usersList())
        } else {
            return <div>Must be logged in to view</div>
        }
        console.log('this is users', users)
    }, [dispatch, user]);


    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true)
    };

    useEffect(() => {
        if (user) {
            dispatch(byIdGetEvent(eventId))
            console.log(event)
        }
        else {
            return (
                history.push('/')
            )
        }
    }, [dispatch, user, eventId]);

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

    const isAdmin = () => {
        if (!members) {
            return false;
        }
        const userRole = members.find((member) => member.user_id === user.id)?.role;
        return userRole === 'admin' || userRole === 'owner';
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu)

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu])

    const handleConfirmDelete = () => {
        dispatch(deleteEvent(eventId))
        dispatch(getAllEvents())
        closeModal()
        history.push('/')
    }
    const handleCancelDelete = () => {
        document.addEventListener("click", setShowMenu(false))
        closeModal()
    }

    return event && event.id ? (
        <div>
            <div>{event.event_name}</div>
            <div>{event.event_date}</div>
            <div>{event.event_time}</div>
            <div className='members'>
                < Members members={members} />
            </div>
            <div>{event.event_details}</div>
            <div>{event.owner_id}</div>
            {user.id === event.owner_id && (
                <div className='delete-button'>
                    <OpenModalButton
                        buttonText="Delete Event"
                        onItemClick={openMenu}
                        modalComponent={<ConfirmDelete onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}
                    />
                </div>
            )}
            {isAdmin() && (
                <>
                <div className='edit-button'>
                <OpenModalButton
                    buttonText="Edit Event"
                    onItemClick={openMenu}
                    modalComponent={<EditEventForm event={event} />}
                    />
                </div>
                <div className='add-members-button'>
                <OpenModalButton
                buttonText="Add Members"
                onItemClick={openMenu}
                modalComponent={<AddMember users={users} eventId={eventId} closeModal={closeModal} showMenu={showMenu}/>}
                />
                </div>
                </>

            )}
        </div>
    ) : (
        <div>
            No event with ID
        </div>
    )


};

export default EventDetails