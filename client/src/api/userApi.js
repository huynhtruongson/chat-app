import axiosClient from "./axiosClient"

const UserApi = {
    getInfo(token) {
        const url = '/api/current' //  '/api/user/current'
        return axiosClient.get(url)
    },
    updateInfo(info)  {
        const url = '/api/user/update'
        return axiosClient.put(url,info)
    },
    searchFriends(params) {
        const url = '/api/searchs'
        return axiosClient.get(url,{params})
    }
}
export default UserApi