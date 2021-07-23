import MessageApi from "../api/messageApi";
import { deleteGallery, updateGallery } from "./galleryAction";
import {ADD_MESSAGE, GET_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE, UPDATE_LAST_MESSAGE, GET_MORE_MESSAGES, DELETE_MESSAGE,UPDATE_CONVERSATION, UPDATE_MESSAGE, DELETE_CONVERSATION} from "./type";

export const getUserMessage = (user) => async (dispatch) => {
    try {
        dispatch({type: GET_USER_MESSAGE,payload: user})
        const res = await MessageApi.getMessages(user._id)
        if(res.status === 200) {
            dispatch(getMessages(res.data))
        }
    } catch (error) {
        console.log(error)

    }
}
export const getMoreMessage = (messages) => ({
    type : GET_MORE_MESSAGES,
    payload : messages
})
export const addMessage = (msg,user) => dispatch => {
    if(msg.status === 'Sending...') {
        msg.media = msg.media.map(md => {
            const resource_type = md.type.split('/')[0]
            if(resource_type === 'application')
                return {name : md.name,url_cloud : null,resource_type : 'raw'}
            else
                return {url_cloud : URL.createObjectURL(md),resource_type}
        })
    }
    dispatch({type: ADD_MESSAGE,payload: {msg,user}})
    if(msg.media.length && !msg.status)
        dispatch(updateGallery(msg.media))
};
export const getConversations = (id) => async (dispatch) => {
    try {
        if(!id) return
        const res = await MessageApi.getConversations();
        if (res.status === 200) {
            const formatConv = [];
            res.data.forEach((cv) => {
                cv.party.forEach((user) => {
                    if (user._id !== id)
                        formatConv.push({...user, text: cv.text, media: cv.media});
                });
            });
            dispatch({type : GET_CONVERSATIONS,payload : formatConv});
        }
    } catch (error) {
        console.log(error);
    }
}
export const deleteMessage = (id) => (dispatch,getState) => {
    const {messages} = getState().message
    const msgIndex = messages.findIndex(msg => msg._id === id) 
    if(msgIndex !== -1) {
        if(msgIndex === 0) {
            const preLastMsg = messages[1] 
            dispatch(updateConversation(preLastMsg))
        }
        if(messages[msgIndex].media.length)
            dispatch(deleteGallery(messages[msgIndex].media))
        
        dispatch({type : DELETE_MESSAGE,payload : id})
    }
}
export const updateMessage = (data) => (dispatch,getState) => {
    const {messages} = getState().message
    const msgIndex = messages.findIndex(msg => msg._id === data._id)  
    if(msgIndex !== -1) {
        const currentMsg = messages[msgIndex]
        const mediaDel = currentMsg.media.reduce((a,b) => {
            if(data.media.findIndex(md => md._id === b._id) === -1)
                a.push(b)
            return a
        },[])
        dispatch({type : UPDATE_MESSAGE,payload : data})
        if(mediaDel.length) 
            dispatch(deleteGallery(mediaDel))
        if(msgIndex === 0) {
            dispatch(updateConversation(data))
        }
    }
}
export const updateLastMessage = (message,id) => ({
    type : UPDATE_LAST_MESSAGE,
    payload : {message,id}
})
export const updateConversation = (msg) => ({
    type : UPDATE_CONVERSATION,
    payload : msg
})
export const getMessages = (messages) => ({
    type: GET_MESSAGES,
    payload: messages,
});
export const deleteConversation = (id) => ({
    type : DELETE_CONVERSATION,
    payload : id
})
