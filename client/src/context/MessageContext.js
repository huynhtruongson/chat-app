import React, {useEffect, useReducer} from "react";
import { getMessages } from "../actions/messageAction";
import MessageApi from "../api/messageApi";
import MessageReducer from "../reducers/MessageReducer";

const MessageContext = () => {
    const initialState = {
        conversations: [],
        user: {},
        messages: [],
        isConversationLoaded: false,
    };
    const [state, dispatch] = useReducer(MessageReducer, initialState);
    useEffect(() => {
        const fetchMessage = async (id) => {
            try {
                if(!id) return
                const res = await MessageApi.getMessages(id)
                if(res.status === 200) {
                    dispatch(getMessages(res.data))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessage(state.user._id)
    },[state.user])
    return [state, dispatch];
};

export default MessageContext;
