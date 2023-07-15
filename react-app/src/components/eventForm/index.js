import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import './CreateEventForm.css'

function EventForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const [event, setEvent] = useState({
        event_name:"",
        event_date: "",
        event_time: "",
        event_details:"",
        estimated_cost: 0,
        predicted_revenue: 0,
        private: false,
        owner_id: user.id
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isFormValid = (name, date, time) => {
            if (name.trim() !== "" && date.trim() !== "" && time.trim() !== "") return true
            else return false
        }

        if (isFormValid(event.event_name, event.event_date, event.event_time)) {
            const date = new Date(event.event_date);
            const formatTime = (timeString) => {
                const time = new Date(`1970-01-01T${timeString}`);
                const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false})
                return formattedTime
            };

            const formattedEvent = {
                ...event,
                event_date: date,
                event_time: formatTime(event.event_time)
            }
            console.log('formattedEvent', formattedEvent)
            dispatch(eventActions.createEvent(formattedEvent))
            .then((data) => {
                console.log("Event created:", data);
            })
            .catch((error) => {
                console.error("Error creating event:", error)
            });
        }
    };
    const isFormValid = () => {
        const { event_name, event_date, event_time } = event
        
        if (event_name.trim() !== "" && event_date.trim() !== "" && event_time.trim() !== "") return true
        else return false
    }

    return (
        <div>

            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="event_name"
                    placeholder="Event Name"
                    value={event.event_name}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="event_date"
                    value={event.event_date}
                    onChange={handleChange}
                />
                <input
                    type="time"
                    name="event_time"
                    value={event.event_time}
                    onChange={handleChange}
                />
                <textarea
                    name="event_details"
                    placeholder="Event Details"
                    value={event.event_details}
                    onChange={handleChange}
                ></textarea>
                <input
                    type="text"
                    name="estimated_cost"
                    placeholder="Estimated Cost"
                    value={event.estimated_cost}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="predicted_revenue"
                    placeholder="Predicted Revenue"
                    value={event.predicted_revenue}
                    onChange={handleChange}
                />
                <select
                    name="private"
                    value={event.private}
                    onChange={handleChange}
                >
                    <option value={false}>Public</option>
                    <option value={true}>Private</option>
                </select>
                <button type="submit" disabled={!isFormValid(event)}>Create Event</button>
            </form>
        </div>
    )
}

export default EventForm