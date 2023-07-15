import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import Events from "../event";

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);


    return user ? (
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