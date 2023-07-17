import React, { useState } from "react";
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as taskActions from "../../store/task";
import { useModal } from "../../context/Modal";

function EditTaskForm({ task, eventId }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [task_id, settaskId] = useState(task.id)
    const user = useSelector((state) => state.session.user);
    const [task_name, setTaskName] = useState(task.task_name);
    const [task_date, setTaskDate] = useState(task.task_date);
    const [task_time, setTaskTime] = useState(task.task_time);
    const [task_details, setTaskDetails] = useState(task.task_details);
    const [status, setStatus] = useState(task.status);
    const [assigned_to, setAssignedTo] = useState(task.assigned_to)
    const [errors, setErrors] = useState([])
    const { closeModal } = useModal();

    function formatDate(date) {
        const [year, month, day] = date.split('-');
        console.log('this is year', year)
        console.log('this is motnh', month)
        console.log('this is day', day)
        return `${day}-${padZero(year)}-${padZero(month)}`;
    }
    function padZero(value) {
        return value.length === 1 ? `${value}` : value;
    }

    if (task_date === task.task_date) {
        setTaskDate(formatDate(task.task_date))
        console.log('this is task date', task_date)
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = (name, date, time) => {
            if (name.trim() !== "" && date.trim() !== "" && time.trim() !== "") return true
            else return false
        }

        if (task_name.trim() == "") setErrors(["Must enter a valid name"])
        if (task_date.trim() == "") setErrors(["Must enter a valid date"])
        if (task_time.trim() == "") setErrors(["Must enter a valid time"])


        if (isFormValid(task_name, task_date, task_time)) {
            const formattedTask = {
                id: task_id,
                task_name,
                task_date,
                task_time,
                task_details,
                status,
                assigned_to
            }
            try {
                console.log('this is formatted task', formattedTask)
                const data = await dispatch(taskActions.updateTask(formattedTask))
                if (Array.isArray(data) && data.length > 0) {
                    setErrors(data)
                } else {
                    closeModal();
                    dispatch(taskActions.getEventTask(eventId))
                }
            } catch (error) {
                setErrors([error.message]);
            }
        }
    };

    const isFormValid = () => {

        return (
            task_name.trim() !== "" &&
            task_date.trim() !== "" &&
            task_time.trim() !== ""
        );
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        dispatch(taskActions.removeTask(task_id))
        dispatch(taskActions.getEventTask(eventId))
        closeModal();
    }


    return (
        <div className="form-container">
            <h1>Edit Task</h1>
            <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                    <ul className="error-list">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <div className="form-group">
                    <input
                        type="text"
                        name="task_name"
                        placeholder="Task Name"
                        value={task_name}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        name="task_date"
                        value={task_date}
                        onChange={(e) => {
                            const newDate = e.target.value.trim() !== "" ? e.target.value : task.task_date;
                            setTaskDate(newDate);
                        }}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="time"
                        name="task_time"
                        value={task_time}
                        onChange={(e) => setTaskTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="task_details"
                        placeholder="Task Details"
                        value={task_details}
                        onChange={(e) => setTaskDetails(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Accepted"}>Accepted</option>
                        <option value={"Complete"}>Complete</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={!isFormValid()}>
                        Edit Event
                    </button>
                    <button type="button" className="delete-button" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditTaskForm;