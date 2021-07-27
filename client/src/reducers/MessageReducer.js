import {ADD_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE, UPDATE_LAST_MESSAGE, GET_MORE_MESSAGES, DELETE_MESSAGE, UPDATE_CONVERSATION, UPDATE_MESSAGE, DELETE_CONVERSATION, UPDATE_SEEN_CONVERSATION} from '../actions/type';
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
                cvArr[index] = {...cvArr[index], 
                    text: msg.text, 
                    media: msg.media,
                    last_sender : msg.sender,
                    update_time : msg.createdAt,
                };
                cvArr.sort((currCv, nextCv) => {
                    if (currCv._id === cvArr[index]._id) return -1;
                    else if (nextCv._id === cvArr[index]._id) return 1;
                    return 0;
                });
            } else {
                const newCv = {...user, 
                    text: msg.text, 
                    media: msg.media,
                    last_sender : msg.sender,
                    update_time : msg.createdAt,
                };
                cvArr.unshift(newCv);
            }
            if(state.activeConv._id === msg.sender || state.activeConv._id === msg.receiver)  
                return {
                    ...state,
                    messages: [msg,...state.messages],
                    conversations: cvArr,
                };
            else 
                return {
                    ...state,
                    conversations: cvArr,
                };
        case GET_CONVERSATIONS:
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
            const delIndex = msgArr.findIndex(msg => msg._id === action.payload)
            if(delIndex !== -1) {
                msgArr.splice(delIndex,1)
                return {...state,messages : msgArr}
            }
            return state
        case UPDATE_MESSAGE : 
            const msgList = [...state.messages]
            const updateIndex = msgList.findIndex(msg => msg._id === action.payload._id)
            if(updateIndex !== -1) {
                msgList[updateIndex] = action.payload
                return {...state,messages : msgList}
            }
            return state 
        case UPDATE_CONVERSATION:
            const msgUpdate = action.payload
            const newConv = [...state.conversations]
            const cvIndex = newConv.findIndex(cv => cv._id === msgUpdate.sender || cv._id === msgUpdate.receiver)
            if(cvIndex !== -1) {
                newConv[cvIndex] = {...newConv[cvIndex],
                    text : msgUpdate.text,
                    media : msgUpdate.media,
                    last_sender : msgUpdate.sender,
                    seen : msgUpdate.seen
                }
                return {...state,conversations : newConv} 
            }
            return state
        case DELETE_CONVERSATION : 
            const convArr = [...state.conversations]
            const convIndex = convArr.findIndex(cv => cv._id === action.payload)
            if(convIndex !== -1)  {
                convArr.splice(convIndex,1)
                if(action.payload === state.activeConv._id)
                    return {...state,conversations : convArr,messages : []}
            }
            return {...state,conversations : convArr}
        case UPDATE_SEEN_CONVERSATION : 
            const {convId,data} = action.payload
            const convList = [...state.conversations]
            let messageList = [...state.messages]
            const convPos =  convList.findIndex(cv => cv._id === convId)
            if(convPos !== -1) 
                convList[convPos].seen = data
            if(state.activeConv._id === convId && data)
                messageList = messageList.map(msg => msg.seen ? msg : {...msg,seen : true})
            return {...state,conversations: convList,messages: messageList}
        default:
            return state;
    }
};
export default MessageReducer;
