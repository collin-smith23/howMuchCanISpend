import React, { useEffect, useState, useRef} from 'react';
import { useParams, useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { byIdGetEvent, deleteEvent, editEvent, getAllEvents } from '../../store/event';
import './eventDetails.css'
import OpenModalButton from '../OpenModalButton';
import ConfirmDelete from '../confirmations/confirmDelete';

function EventDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector((state) => state.event);
    const user = useSelector((state) => state.session.user);
    const eventId = useParams().eventId;

    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true)
    };

    useEffect(() => {
        if (user) {
            dispatch(byIdGetEvent(eventId))
        }
        else {
            return (
            history.push('/')
            )
        }
    }, [dispatch, user, eventId]);

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
        history.push('/')
    }
    const handleCancelDelete = () => {
        document.addEventListener("click", setShowMenu(false))
    }

    return event.id ? (
        <div>
            <div>{event.event_name}</div>
            <div>{event.even_date}</div>
            <div>{event.even_time}</div>
            <div>{event.owner_id}</div>
            <div className='delete-button'>
                <OpenModalButton
                buttonText="Delete Event"
                onItemClick={openMenu}
                modalComponent={<ConfirmDelete onConfirm={handleConfirmDelete} onCancel={handleCancelDelete}/>}
                />
            </div>
            <button> Edit form opens if clicked here </button>
        </div>
    ) : (
        <div>
            No event with ID
        </div>
    )


};

export default EventDetails