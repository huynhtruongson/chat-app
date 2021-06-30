import { ADD_USER_ONLINE, ONLINE_USER, REMOVE_USER_ONLINE } from "../actions/type";

const OnlineReducer = (state = [],action) => {
    switch (action.type) {
        case ONLINE_USER:
            return action.payload;
        case ADD_USER_ONLINE :
            return [...state,action.payload] 
        case REMOVE_USER_ONLINE : 
            return state.filter(id => id !== action.payload)
        default:
            return state;
    }
}
export default OnlineReducer