
const GET_TASKS = "tasks/GET_TASKS"
const GET_TASK = "tasks/GET_TASK"
const DELETE_TASK = "task/DELETE_TASK"

const getTasks = (tasks) => ({
    type: GET_TASKS,
    payload: tasks
})


const getTask = (task) => ({
    type: GET_TASK,
    payload: task
})

const deleteTask = (task) => ({
    type: DELETE_TASK,
    payload: task
})

export const getCreatedTask = () => async (dispatch) => {
    const res = await fetch ('/api/task/created');
    if (res.ok) {
        const data = await res.json();
        dispatch(getTasks(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
}

export const getAssignedTask = () => async (dispatch) => {
    const res = await fetch ('/api/task/assigned');
    if (res.ok) {
        const data = await res.json();
        dispatch(getTasks(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
}

export const getTaskId = (taskId) => async (dispatch) => {
    const res = await fetch (`/api/task/${taskId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getTasks(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
}

export const createTask = (eventId, task) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/${eventId}/task`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                task_name : task.task_name,
                task_date : task.task_date,
                task_time : task.task_time,
                task_details : task.task_details,
                status : task.status,
                assigned_to : task.assigned_to
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getTaskById(eventId));
        return data;
    } catch (error) {
        return JSON.parse(error.message);
    }
}

export const updateTask = (task) => async (dispatch) => {
    try {
        const res = await fetch(`/api/event/task/${task.id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                task_name : task.task_name,
                task_date : task.task_date,
                task_time : task.task_time,
                task_details : task.task_details,
                status : task.status,
                assigned_to : task.assigned_to
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getTaskById(eventId));
        return data;
    } catch (error) {
        return JSON.parse(error.message);
    }
}

export const removeTask = (taskId) => async (dispatch) => {
    const res = await fetch(`/api/task/${taskId}`, {
        method: "DELETE",
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteTask(data));
    } else {
        const error = await res.json()
        return error
    }
};

const initialState = { tasks: [], task: {}};

export default function task(state = initialState, action){
    let newState = Object.assign(state)
    switch (action.type) {
        case GET_TASKS:
            return {...newState, tasks: action.payload}
        case GET_TASK:
            return {...action.payload}
        case DELETE_TASK:
            return {...newState, task: {}}
        default:
            return state
    }
}