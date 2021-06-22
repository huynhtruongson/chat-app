import axiosClient from "./axiosClient"

const MessageApi = {
    getConversations() {
        const url = '/api/conversations'
        return axiosClient.get(url)
    },
    getMessages(id) {
        const url = `/api/messages?recipient._id=${id}&_sort=createdAt&_order=desc`
        return axiosClient.get(url)
    }
}
export default MessageApi