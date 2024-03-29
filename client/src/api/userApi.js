import axiosClient from "./axiosClient"

const UserApi = {
    getInfo(token) {
        const url = '/api/user/current'
        return axiosClient.get(url,{headers : {'Authorization' : 'Bearer ' + token}})
    },
    updateInfo(info)  {
        const url = '/api/user/update'
        return axiosClient.put(url,info)
    },
    searchFriends(params) {
        const url = '/api/user/search'
        return axiosClient.get(url,{params})
    },
    requestFriend(id) {
        const url = `api/user/request-friend/${id}`
        return axiosClient.put(url)
    },
    getFriendRequests() {
        const url = 'api/user/friend-request-list'
        return axiosClient.get(url)
    },
    getFriendList() {
        const url = 'api/user/friend-list'
        return axiosClient.get(url)
    },
    acceptAddFriend(id) {
        const url = `api/user/accept-friend/${id}`
        return axiosClient.put(url)
    },
    refuseAddFriend(id) {
        const url = `api/user/refuse-friend/${id}`
        return axiosClient.put(url)
    },
    changePassword(data) {
        const url = `api/user/change-password`
        return axiosClient.put(url,data)
    }
}
export default UserApi