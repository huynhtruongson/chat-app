import { ADD_USER_ONLINE, ONLINE_USER, REMOVE_ONLINE_USER } from "../actions/type";

const OnlineReducer = (state = [],action) => {
    switch (action.type) {
        case ONLINE_USER:
            return action.payload;
        case ADD_USER_ONLINE :
            return [...state,action.payload] 
        case REMOVE_ONLINE_USER : 
            return state.filter(id => id !== action.payload)
        default:
            return state;
    }
}
export default OnlineReducer