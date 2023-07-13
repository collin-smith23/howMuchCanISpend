import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import "./event.css"

function Events() {
    const dispatch = useDispatch();
    const events = useSelector(state => state.events);
    const user = useSelector(state => state.session.user)

    useEffect(() => {
        console.log('events', events)
        dispatch(eventActions.getAllEvents());
    }, [dispatch])


    return events ? (
        <div>{events}</div>
    ) : (
        <div>events not found</div>
    )
}

export default Events