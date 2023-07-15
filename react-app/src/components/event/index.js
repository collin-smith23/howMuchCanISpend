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
        console.log("events", events);
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

    
    return events ? (
        <div className="home-container">
            <div className="event-box">
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
                    }

                    return (
                        <div className="event">
                            <div className="category">
                                <div className="category-title">Event Name</div>
                                <div className="category-element">{event.event_name}</div>
                            </div>
                            <div className="category">
                                <div className="category-title">Date</div>
                                <div className="category-element">{event.event_date}</div>
                            </div>
                            <div className="category">
                                <div className="category-title">Revenue</div>
                                <div className="category-element">{result}</div>
                            </div>
                        </div>
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