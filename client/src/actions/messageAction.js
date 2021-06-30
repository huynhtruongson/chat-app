import MessageApi from "../api/messageApi";
import {ADD_MESSAGE, UPDATE_CONVERSATIONS, GET_MESSAGES, GET_USER_MESSAGE} from "./type";

export const getUserMessage = (user) => async (dispatch) => {
    try {
        dispatch({type: GET_USER_MESSAGE,payload: user});
        const res = await MessageApi.getMessages(user._id)
        if(res.status === 200)
            dispatch(getMessages(res.data))
    } catch (error) {
        console.log(error)
    }
}
export const addMessage = (msg,user,socket) => async (dispatch) => {
    try {
        const msgData = new FormData()
        msgData.append('text',msg.text)
        msgData.append('receiver',msg.receiver)
        msg.media.forEach(file => msgData.append('media',file))
        msg.media = msg.media.map(md => {
            const resource_type = md.type.split('/')[0]
            return {url_cloud : URL.createObjectURL(md),resource_type}
        })
        dispatch({type: ADD_MESSAGE,payload: {msg,user}})
        const res = await MessageApi.addMessage(msgData)
        if(res.status === 200) {
            socket.emit('ADD-MESSAGE',{msg,user})
        }
    } catch (error) {
        console.log(error)
    }
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
export const updateConversations = (convs) => ({
    type : UPDATE_CONVERSATIONS,
    payload : convs
})
export const getMessages = (messages) => ({
    type: GET_MESSAGES,
    payload: messages,
});
