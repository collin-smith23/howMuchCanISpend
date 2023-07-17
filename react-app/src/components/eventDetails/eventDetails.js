import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { byIdGetEvent, deleteEvent, editEvent, getAllEvents } from '../../store/event';
import * as memberActions from "../../store/member";
import * as taskActions from "../../store/task"
import AddMember from '../addMember/addMemberForm';
import { usersList } from '../../store/session';
import Members from '../members';
import EditEventForm from './editEvent';
import EditTaskForm from './editTask';
import OpenModalButton from '../OpenModalButton';
import ConfirmDelete from '../confirmations/confirmDelete';
import { useModal } from '../../context/Modal'
import './eventDetails.css'
import CreateTaskForm from '../createTask/createTask';

function EventDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const event = useSelector((state) => state.event);
    console.log('this is event', event)
    const user = useSelector((state) => state.session.user);
    const tasks = useSelector((state) => state.task.tasks.tasks);
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

    useEffect(() => {
        if (user){
            dispatch(taskActions.getEventTask(eventId))
        }
    }, [dispatch, user])


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

    const isMember = () => {
        if (!members) {
            return false;
        }
        const userRole = members.find((member)=> member.user_id === user.id)?.role
        return userRole === "admin" || userRole === "owner" || userRole === "guest"
    }

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
                modalComponent={<AddMember users={users} members={members} eventId={eventId} closeModal={closeModal}/>}
                />
                </div>
                <div className='add-task-button'>
                    <OpenModalButton
                    buttonText="Add a Task"
                    onItemClick={openMenu}
                    modalComponent={<CreateTaskForm members={members} eventId={eventId}/>}
                    />
                </div>
                </>
            )}
            {isMember() && tasks && (
                <>
                {Object.values(tasks).map((task) => {
                    console.log('this is task', task)
                    const taskId = task.id;
                const created = task.owner_id === user.id;
                return (
                    <div className="task-row" key={taskId}>
                        <div className="task-details">
                            <div className="task-el">{task.task_name}</div>
                            <div className="task-el">{task.task_date}</div>
                            <div className="task-el">{task.task_time}</div>
                            <div className="task-el">{task.task_details}</div>
                            <div className="task-el">{task.status}</div>
                            <div className="task-owner">
                                {created ? <div>You created</div> : <div>Assigned to you</div>}
                            </div>
                            <>
                            <OpenModalButton
                                buttonText="Edit"
                                onItemClick={openMenu}
                                modalComponent={<EditTaskForm
                                    task={task}
                                    eventId={eventId}
                                    />}/>
                                    </>
                        </div>
                    </div>
                    )
                })}
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