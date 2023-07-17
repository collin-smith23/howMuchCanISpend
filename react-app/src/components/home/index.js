import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import Events from "../event";
import './home.css'

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const events = useSelector((state) => state.event.events);


    if (!events) {
        dispatch(eventActions.getAllUserEvents());
        return (
            <div>
                No events loaded
            </div>
        )
    }

    return user && events ? (
        <div className="home-container">
            <div className="event-container">
                <h2 className="title">Events</h2>
                <Events />
            </div>
            <div className="finance-container">
                <h1 className="title">Finance</h1>
                <div className="home-element">Feature Coming SOON</div>
            </div>
        </div>
    ) : (
        <div>
            Welcome!
        </div>
    );
}

export default HomePage