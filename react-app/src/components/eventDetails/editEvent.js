import React, { useState } from "react";
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import './editEvent.css'
import { useModal } from "../../context/Modal";

function EditEventForm({ event }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [event_id, setEventId] = useState(event.id)
    console.log(event_id)
    const user = useSelector((state) => state.session.user);
    const [event_name, setEventName] = useState(event.event_name);
    const [event_date, setEventDate] = useState(event.event_date);
    const [event_time, setEventTime] = useState(event.event_time);
    const [event_details, setEventDetails] = useState(event.event_details);
    const [estimated_cost, setEstimatedCost] = useState(event.estimated_cost);
    const [predicted_revenue, setPredictedRevenue] = useState(event.predicted_revenue);
    const [privateEvent, setPrivateEvent] = useState(event.private);
    const [owner_id, setOwnerId] = useState(event.owner_id);
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

    if (event_date === event.event_date) {
        setEventDate(formatDate(event.event_date))
        console.log('this is event date', event_date)
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = (name, date, time) => {
            if (name.trim() !== "" && date.trim() !== "" && time.trim() !== "") return true
            else return false
        }

        if (event_name.trim() == "") setErrors(["Must enter a valid name"])
        if (event_date.trim() == "") setErrors(["Must enter a valid date"])
        if (event_time.trim() == "") setErrors(["Must enter a valid time"])


        if (isFormValid(event_name, event_date, event_time)) {
            const formattedEvent = {
                id: event_id,
                event_name,
                event_date,
                event_time,
                event_details,
                estimated_cost,
                predicted_revenue,
                privateEvent,
                owner_id
            }
            console.log(formattedEvent)
            try {

                const data = await dispatch(eventActions.editEvent(formattedEvent))
                if (Array.isArray(data) && data.length > 0) {
                    setErrors(data)
                } else {
                    closeModal();
                }
            } catch (error) {
                setErrors([error.message]);
            }
        }
    };

    const isFormValid = () => {

        return (
            event_name.trim() !== "" &&
            event_date.trim() !== "" &&
            event_time.trim() !== ""
        );
    }


    return (
        <div className="form-container">
            <h1>Edit Event</h1>
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
                        name="event_name"
                        placeholder="Event Name"
                        value={event_name}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        name="event_date"
                        value={event_date}
                        onChange={(e) => {
                            const newDate = e.target.value.trim() !== "" ? e.target.value : event.event_date;
                            setEventDate(newDate);
                        }}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="time"
                        name="event_time"
                        value={event_time}
                        onChange={(e) => setEventTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="event_details"
                        placeholder="Event Details"
                        value={event_details}
                        onChange={(e) => setEventDetails(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="estimated_cost"
                        placeholder="Estimated Cost"
                        value={estimated_cost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="predicted_revenue"
                        placeholder="Predicted Revenue"
                        value={predicted_revenue}
                        onChange={(e) => setPredictedRevenue(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <select
                        name="private"
                        value={privateEvent}
                        onChange={(e) => setPrivateEvent(e.target.value)}
                    >
                        <option value={false}>Public</option>
                        <option value={true}>Private</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={!isFormValid()}>
                        Edit Event
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditEventForm