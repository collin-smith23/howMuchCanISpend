// constants
const SET_USER = "session/SET_USER";
const GET_USERS = "session/GET_USERS";
const REMOVE_USER = "session/REMOVE_USER";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const getUsers = (users) => ({
	type: GET_USERS,
	payload: users
})

const removeUser = () => ({
	type: REMOVE_USER,
});

const initialState = { user: null, users: [] };

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (identifier, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			identifier,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (username, email, name, password) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			name,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const usersList = () => async (dispatch) => {
	try {
		const res = await fetch(`/api/users/`);
		if (!res.ok) {
			const errorData = await res.json();
			const errorMessages = errorData.errors;
			throw new Error(JSON.stringify(errorMessages))
		}
		const data = await res.json();
		dispatch(getUsers(data));
		return data;
	} catch (error) {
		console.log(error)
		return JSON.parse(error.message)
	}
}

export default function reducer(state = initialState, action) {
	let newState = Object.assign(state)
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case GET_USERS:
			return { ...newState, users: action.payload }
		case REMOVE_USER:
			return { user: null };
		default:
			return state;
	}
}