import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import EventForm from "../eventForm";
import OpenModalButton from "../OpenModalButton";
import "./event.css";

function Events() {
    const dispatch = useDispatch();
    const history = useHistory()
    const events = useSelector((state) => state.event.events.events);
    const user = useSelector((state) => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {

        if (user) {
            dispatch(eventActions.getAllUserEvents());
        } else {
            return (
                <div>Must be logged in to view</div>
            )
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const handleEventClick = (eventId) => {
        history.push(`/event/${eventId}`);
    };


    return events ? (
        <div className="event-contain">
            <h2 className="title">Events</h2>
            <div className="event-box">
                <div className="category-title-box">
                        <div className="category-title">Event Name</div>
                        <div className="category-title">Date</div>
                        <div className="category-title">Revenue</div>
                        </div>


                {Object.values(events).map((event) => {
                    const { estimated_cost, predicted_revenue } = event;
                    let result = null;
                    
                    if (estimated_cost && predicted_revenue) {
                        const difference = predicted_revenue - estimated_cost;
                        result = `$${difference.toFixed(2)}`;
                    } else if (estimated_cost) {
                        result = `$${estimated_cost.toFixed(2)}`;
                    } else if (predicted_revenue) {
                        result = `$${predicted_revenue.toFixed(2)}`;
                    } else if (!predicted_revenue && !estimated_cost) {
                        result = `$0.00`
                    }
                    
                    return (
                        <>
                        <div className="event" key={event.id} onClick={() => handleEventClick(event.id)}>
                            <div className="category">
                                <div className="category-element">{event.event_name}</div>
                            </div>
                            <div className="category">
                                <div className="category-element">{event.event_date}</div>
                            </div>
                            <div className="category">
                                <div className="category-element">{result}</div>
                            </div>
                        </div>
                        <span className="line"></span>
                        </>
                    );
                })}
                <div className="create-event-button">
                    <OpenModalButton
                        buttonText="Create Event"
                        onItemClick={openMenu}
                        modalComponent={<EventForm />}
                        />
                </div>
            </div>
        </div>
    ) : (
        <>
            <div>No events created yet</div>
            <div className="create-event-button">
                <OpenModalButton
                    buttonText="Create Event"
                    onItemClick={openMenu}
                    modalComponent={<EventForm />}
                    />
            </div>
        </>
    );
}

export default Events;