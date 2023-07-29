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
        dispatch(GET_FINANCES(data));
        return data
    } else {
        const error = await res.json()
        return error
    }
}

export const getFinanceRecord = (financeId) => async (dispatch) => {
    const res = await fetch(`/api/finance/${financeId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getFinance(data));
        return data
    } else {
        const error = await res.json();
        return error
    }
};



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