import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as taskActions from "../../store/task";
import OpenModalButton from '../OpenModalButton';
import EditTaskForm from './editTask';
import { useModal } from '../../context/Modal'
import "./task.css";

function Tasks() {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.task.tasks.tasks);
    const user = useSelector((state) => state.session.user);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const { closeModal } = useModal();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true)
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


    useEffect(() => {
        if (user) {
            dispatch(taskActions.getAssignedTask());
            dispatch(taskActions.getCreatedTask());
        }
    }, [dispatch, user, showMenu]);


    return tasks ? (
        <div className="task-container">
            <h1 className="task-title">Tasks</h1>
            {Object.values(tasks).map((task) => {
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
                                    />}/>
                                    </>
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        <div className='no-task'>No tasks yet! Navigate to an event to create a new task</div>
    );
}

export default Tasks