import {ADD_MESSAGE, UPDATE_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE, UPDATE_LAST_MESSAGE, GET_MORE_MESSAGES, DELETE_MESSAGE} from '../actions/type';
const initialState = {
    conversations: [],
    activeConv: {},
    messages: []
}
const MessageReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_MESSAGE:
            return {...state, activeConv: action.payload,messages : []};
        case ADD_MESSAGE:
            const cvArr = [...state.conversations];
            const {msg, user} = action.payload;
            const index = cvArr.findIndex(
                (cv) => cv._id === msg.sender || cv._id === msg.receiver
            );
            if (index !== -1) { 
                cvArr[index] = {...cvArr[index], text: msg.text, media: msg.media};
                cvArr.sort((currCv, nextCv) => {
                    if (currCv._id === cvArr[index]._id) return -1;
                    else if (nextCv._id === cvArr[index]._id) return 1;
                    return 0;
                });
            } else {
                const newCv = {...user, text: msg.text, media: msg.media};
                cvArr.unshift(newCv);
            }
            return {
                ...state,
                messages: [msg,...state.messages],
                conversations: cvArr,
            };
        case UPDATE_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload,
            };
        case UPDATE_LAST_MESSAGE : 
            const messageArr =  [...state.messages]
            const {message,id} = action.payload
            const msgPos = messageArr.findIndex(m => m.id === id)
            if(msgPos !== -1)
                messageArr[msgPos] = message
            return {...state,messages : messageArr}
        case GET_MESSAGES :
            return {...state,messages : action.payload}
        case GET_MORE_MESSAGES :
            return {...state,messages : [...state.messages,...action.payload]}
        case DELETE_MESSAGE :
            const msgArr = [...state.messages]
            const delIndex =  msgArr.findIndex(msg => msg._id === action.payload)
            if(delIndex !== -1)
                msgArr.splice(delIndex,1)
            return {...state,messages : msgArr}
        default:
            return state;
    }
};
export default MessageReducer;
