import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as eventActions from "../../store/event";
import OpenModalButton from "../OpenModalButton";
import Events from "../event";
import Finances from "../finance/finance";
import Tasks from "../task/task";
import './home.css'
import image from './image/background.jpg'

function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const events = useSelector((state) => state.event.events);


    if (!events) {
        dispatch(eventActions.getAllUserEvents());
        return (
            <div div className="background">
            <div className="welcome-box">
                <h1 className="welcome-h1">Welcome To How Much Can I Spend!</h1>
                <img className='welcome-img' src={image} alt='Home' />
                <p className="welcome-p">How Much Can I Spend is designed to allow users, like yourself access to manage! Currently we are able to help you coordinate your events by adding members and different task!</p>
                <h2 className="h2-welcome">Where to start?</h2>
                <p className="welcome-p">Well by signing up of course! If you click on the profile icon in the top right you will see the option to signup or login!</p>
                <p className="welcome-p">After signing up create an event! Once you have an event created, you will see it on your home page. With a created event, you can now add other members and create task and track the progress of them!</p>
                <div className="div-welcome">Yes it is that simple, and I strive to keep it that way!</div>
                <h3>Stay Tuned for updates as this application is always trying to improve!</h3>
                <footer className="footer">How Much Can I Spend is a non profit application designed for portfolio use only</footer>
            </div>
            </div>
        )
    }

    return user && events ? (
        <div className="background-container">
            <div className="task-box">
                <Tasks />
            </div>
        <div className="home-container">
            <div className="event-container">
                <Events />
            </div>
            <div className="finance-container">
                <Finances />
            </div>
        </div>
        </div>
    ) : (
        <div div className="background">
        <div className="welcome-box">
            <h1 className="welcome-h1">Welcome To How Much Can I Spend!</h1>
            <img className='welcome-img' src={image} alt='Home' />
            <p className="welcome-p">How Much Can I Spend is designed to allow users, like yourself access to manage! Currently we are able to help you coordinate your events by adding members and different task!</p>
            <h2 className="h2-welcome">Where to start?</h2>
            <p className="welcome-p">Well by signing up of course! If you click on the profile icon in the top right you will see the option to signup or login!</p>
            <p className="welcome-p">After signing up create an event! Once you have an event created, you will see it on your home page. With a created event, you can now add other members and create task and track the progress of them!</p>
            <div className="div-welcome">Yes it is that simple, and I strive to keep it that way!</div>
            <h3>Stay Tuned for updates as this application is always trying to improve!</h3>
            <footer className="footer">How Much Can I Spend is a non profit application designed for portfolio use only</footer>
        </div>
        </div>
    );
}

export default HomePage