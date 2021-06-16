import MessageApi from "../api/messageApi";
import {ADD_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE} from "./type";

export const getUserMessage = (user) => ({
    type: GET_USER_MESSAGE,
    payload: user,
});
export const addMessage = (msg) => ({
    type: ADD_MESSAGE,
    payload: msg,
});
export const getConversations = (conversations) => ({
    type: GET_CONVERSATIONS,
    payload: conversations,
});
export const getMessages = (messages) => ({
    type: GET_MESSAGES,
    payload: messages,
});
