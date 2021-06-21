import React, {useEffect, useReducer} from "react";
import { getMessages } from "../actions/messageAction";
import MessageApi from "../api/messageApi";
import MessageReducer from "../reducers/MessageReducer";

const MessageContext = () => {
    const initialState = {
        conversations: [],
        activeConv: {},
        messages: [],
        isConversationLoaded: false,
    };
    const [state, dispatch] = useReducer(MessageReducer, initialState);
    useEffect(() => {
        const fetchMessage = async (id) => {
            try {
                if(!id) return
                if(state.messages.every(cv => cv._id !== id)) {
                    const res = await MessageApi.getMessages(id)
                    if(res.status === 200) {
                        dispatch(getMessages({data : [...res.data],_id : id}))
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessage(state.activeConv._id)
    },[state.activeConv,state.messages])
    return [state, dispatch];
};

export default MessageContext;
