const GET_FINANCE = 'finance/ADD_FINANCE';
const GET_FINANCES = 'finance/GET_FINANCES';
const REMOVE_FINANCE = 'finance/REMOVE_FINANCE';

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