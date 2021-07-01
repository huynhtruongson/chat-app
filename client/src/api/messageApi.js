import axiosClient from "./axiosClient"

const MessageApi = {
    getConversations() {
        const url = '/api/conversation/list'
        return axiosClient.get(url)
    },
    getMessages(id) {
        const url = `/api/message/${id}`
        return axiosClient.get(url)
    },
    addMessage(msg) {
        const url = '/api/conversation/add-message'
        return axiosClient.post(url,msg)
    },
    getImageGalerry(id) {
        const url = `/api/conversation/image-gallery/${id}`
        return axiosClient.get(url)
    },
    getVideoGalerry(id) {
        const url = `/api/conversation/video-gallery/${id}`
        return axiosClient.get(url)
    },
    getFileGalerry(id) {
        const url = `/api/conversation/file-gallery/${id}`
        return axiosClient.get(url)
    },
    getMoreMessages(id,params) {
        const url = `/api/message/${id}`
        return axiosClient.get(url,{params})
    }
}
export default MessageApi