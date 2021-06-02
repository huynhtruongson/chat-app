const UserReducer = (state,action) => {
    switch (action.type) {
        case 'UPDATE_USER_INFOR' :
            return {...state,infor: action.payload}
        default:
            return state;
    }
}
export default UserReducer