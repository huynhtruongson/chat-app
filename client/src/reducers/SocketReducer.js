import { CREATE_SOCKET_INSTANCE } from "../actions/type";

const SocketReducer = (state = null,action) => {
    switch (action.type) {
        case CREATE_SOCKET_INSTANCE:
            return action.payload;
        default:
            return state;
    }
}
export default SocketReducer