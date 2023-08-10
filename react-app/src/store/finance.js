const GET_FINANCE = 'finance/ADD_FINANCE';
const GET_FINANCES = 'finance/GET_FINANCES';
const REMOVE_FINANCE = 'finance/REMOVE_FINANCE';

const getFinances = (finances) => ({
    type: GET_FINANCES,
    payload: finances
})
const getFinance = (finance) => ({
    type: GET_FINANCE,
    payload: finance
})
const removeFinance = (finance) => ({
    type: GET_FINANCE,
    payload: finance
})

export const getUserFinances = () => async (dispatch) => {
    const res = await fetch(`api/finance/`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getFinances(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
}

export const getFinanceRecord = (financeId) => async (dispatch) => {
    try{
        const res = await fetch(`/api/finance/${financeId}`);
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getFinance(data));
        return data;
    } catch(error) {
        console.log('this is error', error)
        return error
    }
};

export const addFinanceRecord = (transaction) => async (dispatch) => {
    try {
        const res = await fetch("/api/finance/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: transaction.amount,
                transaction_type : transaction.transaction_type,
                transaction_details : transaction.transaction_details,
                transaction_date: transaction.transaction_date,
            }),
        })
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = await res.json();
        dispatch(getFinanceRecord(data.id));
        return data;
    } catch (error) {
        return JSON.parse(error.messsage)
    }
}

export const editTransaction = (financeId, transaction) => async (dispatch) => {
    try {
        const res = await fetch(`/api/finance/${financeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: transaction.amount,
                transaction_type : transaction.transaction_type,
                transaction_details : transaction.transaction_details,
                transaction_date: transaction.transaction_date,
            }),
        })
        if (!res.ok) {
            const errorData = await res.json();
            const errorMessages = errorData.errors;
            throw new Error(JSON.stringify(errorMessages));
        }
        const data = res.json()
        dispatch(getUserFinances());
        return data;
    } catch (error) {
        console.log(error)
        return JSON.parse(error.messsage)
    }
}

export const deleteTransaction = (financeId) => async (dispatch) => {
    const res = await fetch(`/api/finance/${financeId}`, {
        method: "DELETE",
    })
    if (res.ok) {
        const data = await res.json();
        dispatch(getUserFinances());
    } else {
        const error = await res.json()
        return error
    }
}



const initialState = { finance: {}, finances: []};
export default function finance(state = initialState, action) {
    let newState = Object.assign(state)
    switch (action.type) {
        case GET_FINANCE:
            return {...action.payload}
        case GET_FINANCES:
            return {...newState, finances: action.payload}
        case REMOVE_FINANCE:
            return {...newState, finance:{}}
        default:
            return state
    }
}