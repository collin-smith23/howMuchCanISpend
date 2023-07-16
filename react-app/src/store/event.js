const GET_USER_EVENTS = "events/GET_USER_EVENTS";
const GET_EVENTS = "events/GET_EVENTS";
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

// const addEvent = (event) => ({
//     type: ADD_EVENT,
//     payload: event
// });

const updateEvent = (event) => ({
    type: UPDATE_EVENT,
    payload: event
});

const removeEvent = (event) => ({
    type: REMOVE_EVENT,
    payload: event
});

export const getAllUserEvents = () => async (dispatch) => {
    const res = await fetch(`/api/event/`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getUserEvents(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
};

export const getAllEvents = () => async (dispatch) => {
    const res = await fetch(`/api/event/all`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getEvents(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
};

export const byIdGetEvent = (eventId) => async (dispatch) => {

    const res = await fetch(`/api/event/${eventId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getEventById(data))
        return data
    } else {
        const error = await res.json()
        return error
    }
};

export const createEvent = (event) => async (dispatch) => {
    try {
        const res = await fetch("/api/event/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event_name: event.event_name,
                event_date: event.event_date,
                event_time: event.event_time,
                event_details: event.event_details,
                estimated_cost: event.estimated_cost,
                predicted_revenue: event.predicted_revenue,
                private: event.privateEvent.toString(),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error);
        }

        const data = await res.json();
        console.log('this is data ----', data)
        console.log('this is res', res)
        dispatch(byIdGetEvent(data.id));
        return data;
    } catch (error) {
        return error.message;
    }
};

export const editEvent = (event) => async (dispatch) => {
    const res = await fetch(`/api/event/${event.id}`, {
        method: "PUT",
        body: JSON.stringify(
            {
                "event_name": event.event_name,
                "event_date": event.event_name,
                "event_time": event.event_time,
                "event_details": event.event_details,
                "estimated_cost": event.estimated_cost,
                "predicted_revenue": event.predicted_revenue,
                "private": event.private
            }
        )
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(updateEvent(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
};

export const deleteEvent = (event_id) => async (dispatch) => {
    const res = await fetch(`/api/event/${event_id}`, {
        method: "DELETE",
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(removeEvent(data));
    } else {
        const error = await res.json()
        return error
    }
};

const initialState = { events: [], event: {} };

export default function event(state = initialState, action) {
    let newState = Object.assign(state)
    switch (action.type) {
        case GET_USER_EVENTS:
            return { ...newState, events: action.payload }
        case GET_EVENTS:
            return { ...newState, events: action.payload }
        case GET_EVENT_BY_ID:
            return { ...action.payload }
        case ADD_EVENT:
            return { ...newState, event: action.payload }
        case UPDATE_EVENT:
            return { ...action.payload }
        case REMOVE_EVENT:
            return { ...newState, event: {} }
        default:
            return state
    }
}