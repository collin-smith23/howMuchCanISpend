import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import './CreateEventForm.css'

function EventForm() {
    const dispatch = useDispatch();

    return (
        <h1>Create Event</h1>
    )
}

export default EventForm