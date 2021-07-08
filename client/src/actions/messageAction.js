import MessageApi from "../api/messageApi";
import {ADD_MESSAGE, UPDATE_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE, UPDATE_LAST_MESSAGE, GET_MORE_MESSAGES, DELETE_MESSAGE} from "./type";

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
export const addMessage = (msg,user) => {
    msg.media = msg.media.map(md => {
        const resource_type = md.type.split('/')[0]
        if(resource_type === 'application')
            return {name : md.name,url_cloud : null,resource_type : 'raw'}
        else
            return {url_cloud : URL.createObjectURL(md),resource_type}
    })
    return ({type: ADD_MESSAGE,payload: {msg,user}})
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
            dispatch(updateConversations(formatConv));
        }
    } catch (error) {
        console.log(error);
    }
}
export const updateLastMessage = (message,id) => ({
    type : UPDATE_LAST_MESSAGE,
    payload : {message,id}
})
export const updateConversations = (convs) => ({
    type : UPDATE_CONVERSATIONS,
    payload : convs
})
export const getMessages = (messages) => ({
    type: GET_MESSAGES,
    payload: messages,
});
export const deleteMessage = (id) => ({
    type : DELETE_MESSAGE,
    payload : id
})
