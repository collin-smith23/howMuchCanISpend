import React, { useState } from "react";
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as taskActions from "../../store/task";
import { useModal } from "../../context/Modal";
import './createTask.css'

function CreateTaskForm({ members, eventId }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    console.log('this is eventId', eventId)
    const [task_name, setTaskName] = useState("");
    const [task_date, setTaskDate] = useState("");
    const [task_time, setTaskTime] = useState("");
    const [task_details, setTaskDetails] = useState("");
    const [status, setStatus] = useState("Pending");
    const [assigned_to, setAssignedTo] = useState("");
    const [errors, setErrors] = useState([])
    const { closeModal } = useModal();


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
                task_name,
                task_date,
                task_time,
                task_details,
                status,
                assigned_to
            }
            try {
                console.log('this is formatted task', formattedTask)
                console.log('this is eventId again', eventId)
                const data = await dispatch(taskActions.createTask(eventId, formattedTask))
                if (Array.isArray(data) && data.length > 0) {
                    setErrors(data)
                } else {
                    dispatch(taskActions.getEventTask(eventId))
                    closeModal();
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
            task_time.trim() !== "" &&
            assigned_to.trim() !== ""
        );
    }


    return (
        <div className="form-container">
            <h1>Create Task</h1>
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
                            const newDate = e.target.value.trim() !== "" ? e.target.value : task_date;
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
                <div className="form-group">
                    <select
                        name="assigned_to"
                        value={assigned_to}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option value="">Assign a user</option>
                        {members.map((member) => (
                            <option key={member.user_id} value={member.user_id}>
                                {member.username}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button" disabled={!isFormValid()}>
                    Create Task
                </button>
            </form>
        </div>
    );
}

export default CreateTaskForm;