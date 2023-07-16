import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import Events from "../event";

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
        <div>
            <Events/>
        </div>
    ) : (
        <div>
            Welcome!
        </div>
    )
};

export default HomePage