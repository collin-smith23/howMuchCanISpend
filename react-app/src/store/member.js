const GET_MEMBERS = "members/GET_MEMBERS";
const GET_MEMBER = "members/GET_MEMBER"
const ADD_MEMBER = "members/ADD_MEMBER";
const UPDATE_MEMBER = "members/UPDATE_MEMBER";
const REMOVE_MEMBER = "members/REMOVE_MEMBER";


const getMembers = (members) => ({
    type: GET_MEMBERS,
    payload: members
});

const getMember = (member) => ({
    type: GET_MEMBER,
    payload: member
})

const addMember = (member) => ({
    type: ADD_MEMBER,
    payload: member
});

const updateMember = (member) => ({
    type: UPDATE_MEMBER,
    payload: member
});

const removeMember = (member) => ({
    type: REMOVE_MEMBER,
    payload: member
});

export const getAllMembers = (eventId) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/${eventId}/members`);
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages))
        }
            const data = await res.json();
            dispatch(getMembers(data));
            return data
        } catch (error) {
            console.log(error)
            return JSON.parse(error.messsage)
        }
    }

export const getMemberId = (eventId, memberId) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/${eventId}/members/${memberId}`)
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages))
        }
        const data = await res.json();
        dispatch(getMember(data));
        return data
    } catch (error) {
        console.log(error)
        return JSON.parse(error.messsage)
    }
}

export const createMember = (eventId, member) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/${eventId}/members`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: member.user_id,
                role: member.role
            }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getAllMembers(eventId));
        return data;
    } catch (error) {
        console.log(error)
        return JSON.parse(error.messsage);
    }
};

export const editMember = (eventId, member) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/${eventId}/members/${member.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                role: member.role
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getAllMembers(eventId));
        return data;
    } catch (error) {
        console.log(error)
        return JSON.parse(error.message)
    }
};

export const deleteMember = (eventId, memberId) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/${eventId}/members/${memberId}`, {
            method: "DELETE"
        });
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getAllMembers(eventId));
        return data;
    } catch (error) {
        console.log(error)
        return JSON.parse(error.message)
    }
};

const initialState = {members: [], member: {}}
export default function member(state = initialState, action) {
    let newState = Object.assign(state)
    switch (action.type) {
        case GET_MEMBERS: 
            return {...newState, members: action.payload}
        case GET_MEMBER: 
            return {...action.payload}
        case ADD_MEMBER:
            return {...newState, member: action.payload}
        case UPDATE_MEMBER:
            return {...action.payload}
        case REMOVE_MEMBER:
            return {...newState, member: {}}

        default:
            return state
    }
}