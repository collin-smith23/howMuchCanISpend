const GET_USER_EVENTS = "events/GET_USER_EVENTS";
const GET_EVENTS =  "events/GET_EVENTS";
const GET_EVENT_BY_ID = "events/GET_EVENT_BY_ID";
const ADD_EVENT = "events/ADD_EVENT";
const UPDATE_EVENT = "events/UPDATE_EVENT";
const REMOVE_EVENT = "events/REMOVE_EVENT";


const getUserEvents = (events) => ({
    type: GET_USER_EVENTS,
    payload: events
});

const getEvents = (events) => ({
    type: GET_EVENTS,
    payload: events
});

const getEventById = (event) => ({
    type: GET_EVENT_BY_ID,
    payload: event
});

const addEvent = (event) => ({
    type: ADD_EVENT,
    payload: event
});

const updateEvent = (event) => ({
    type: UPDATE_EVENT,
    payload: event
});

const removeEvent = (event) => ({
    type: REMOVE_EVENT,
    payload: event
})

export const getAllUserEvents = () => async (dispatch) => {
    const res = await fetch(`/api/event/`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getUserEvents(data));
    }
};

export const getAllEvents = () => async (dispatch) => {
    const res = await (`/api/event/all`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getEvents(data));
    }
};