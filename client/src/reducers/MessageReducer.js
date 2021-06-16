import {ADD_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE} from "../actions/type";

const MessageReducer = (state, action) => {
    switch (action.type) {
        case GET_USER_MESSAGE:
            return {...state, user: {...action.payload},messages : []};
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [{...action.payload}, ...state.messages],
                conversations: state.conversations.map((cv) =>
                    cv.id === action.payload.sender || cv.id === action.payload.recipient
                        ? {
                              ...cv,
                              text: action.payload.text,
                              media: action.payload.medi,
                          }
                        : cv
                ),
            };
        case GET_CONVERSATIONS: 
            return {
                ...state,
                conversations : action.payload,
                isConversationLoaded : true
            }
        case GET_MESSAGES:
            return {
                ...state,
                messages : action.payload
            }
        default:
            return state;
    }
};
export default MessageReducer;
