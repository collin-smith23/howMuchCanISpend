import "./task.css";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as taskActions from "../../store/task";
import OpenModalButton from '../OpenModalButton';
import EditTaskForm from './editTask';
import { useModal } from '../../context/Modal'

function Tasks() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const { closeModal } = useModal();
    const history = useHistory();

    useEffect(() => {
        if (user) {
            dispatch(taskActions.getAssignedTask());
            dispatch(taskActions.getCreatedTask());
        }
    }, [dispatch, user]);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        const clickListener = (e) => closeMenu(e);

        document.addEventListener("click", clickListener);

        return () => document.removeEventListener("click", clickListener);
    }, [showMenu]);

    const assignedTasks = useSelector((state) => state.task.tasks.tasks) || [];
    const createdTasks = useSelector((state) => state.task.userTasks.tasks) || [];

    useEffect(() => {
        if (assignedTasks.length > 0 || createdTasks.length > 0) {
            setTasks([...assignedTasks, ...createdTasks]);
        }
    }, [assignedTasks, createdTasks]);

    const navigateToEvent = (eventId) => {
        history.push(`/event/${eventId}`);
    };

    return tasks.length > 0 ? (
        <div className="task-container">
            <h1 className="task-title">Tasks</h1>
            {tasks.map((task) => {
                const taskId = task.id;
                const created = task.owner_id === user.id;
                return (
                    <div
                        className="task-row"
                    >
                        <div
                            key={taskId}
                            onClick={() => navigateToEvent(task.event_id)}
                            className="task-details" >
                            <div className="task-el-title">{task.task_name}</div>
                            <div className="task-el">{task.task_date}</div>
                            <div className="task-el">{task.task_time}</div>
                            <div className="task-el">{task.task_details}</div>
                            <div className="task-el">{task.status}</div>
                            <div className="task-owner">
                                {created ? <div>You created</div> : <div>Assigned to you</div>}
                            </div>
                            <div className="edit-button">
                                <OpenModalButton
                                    buttonText="Edit"
                                    className="edit-button"
                                    onItemClick={openMenu}
                                    modalComponent={<EditTaskForm task={task} />}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        <div className="no-task">No tasks yet! Navigate to an event to create a new task</div>
    );
}

export default Tasks;