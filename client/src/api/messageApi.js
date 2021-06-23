import axiosClient from "./axiosClient"

const MessageApi = {
    getConversations() {
        const url = '/api/conversations'
        return axiosClient.get(url)
    },
    getMessages(id) {
        const url = `/api/message/${id}`
        return axiosClient.get(url)
    },
    addMessage(msg) {
        const url = 'api/add-message'
        return axiosClient.post(url,msg)
    }
}
export default MessageApi