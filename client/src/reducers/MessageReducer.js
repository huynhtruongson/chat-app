import {ADD_MESSAGE, UPDATE_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE} from '../actions/type';
const initialState = {
    conversations: [],
    activeConv: {},
    messages: [],
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
                isConversationLoaded: true,
            };
        case GET_MESSAGES:
            return {
                ...state,
                messages: action.payload
            };
        default:
            return state;
    }
};
export default MessageReducer;
