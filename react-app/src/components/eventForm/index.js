import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import './CreateEventForm.css'
import { useModal } from "../../context/Modal";

function EventForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const [event_name, setEventName] = useState("");
    const [event_date, setEventDate] = useState("");
    const [event_time, setEventTime] = useState("");
    const [event_details, setEventDetails] = useState("");
    const [estimated_cost, setEstimatedCost] = useState(0.00);
    const [predicted_revenue, setPredictedRevenue] = useState(0.00);
    const [privateEvent, setPrivateEvent] = useState(false);
    const [owner_id, setOwnerId] = useState(user.id);
    const [errors, setErrors] = useState([])
    const { closeModal } = useModal();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = (name, date, time) => {
            if (name.trim() !== "" && date.trim() !== "" && time.trim() !== "") return true
            else return false
        }

        if (event_name.trim() === "") setErrors(["Must enter a valid name"])
        if (event_date.trim() === "") setErrors(["Must enter a valid date"])
        if (event_time.trim() === "") setErrors(["Must enter a valid time"])

        if (isFormValid(event_name, event_date, event_time)) {
            const formattedEvent = {
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

                const data = await dispatch(eventActions.createEvent(formattedEvent))
                if (Array.isArray(data) && data.length > 0) {
                    setErrors(data)
                } else {
                    closeModal();
                    // history.push(`/event/${data.id}`);
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
        <div>

            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                {errors.length > 0 && (
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
                <input
                    type="text"
                    name="event_name"
                    placeholder="Event Name"
                    value={event_name}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />
                <input
                    type="date"
                    name="event_date"
                    value={event_date}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
                <input
                    type="time"
                    name="event_time"
                    value={event_time}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                />
                <textarea
                    name="event_details"
                    placeholder="Event Details"
                    value={event_details}
                    onChange={(e) => setEventDetails(e.target.value)}
                ></textarea>
                <input
                    type="text"
                    name="estimated_cost"
                    placeholder="Estimated Cost"
                    value={estimated_cost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                />
                <input
                    type="text"
                    name="predicted_revenue"
                    placeholder="Predicted Revenue"
                    value={predicted_revenue}
                    onChange={(e) => setPredictedRevenue(e.target.value)}
                />
                <select
                    name="private"
                    value={privateEvent}
                    onChange={(e) => setPrivateEvent(e.target.value)}
                >
                    <option value={false}>Public</option>
                    <option value={true}>Private</option>
                </select>
                <button type="submit" disabled={!isFormValid()}>Create Event</button>
            </form>
        </div>
    );
}

export default EventForm