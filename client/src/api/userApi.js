import axiosClient from "./axiosClient"

const UserApi = {
    getInfo(token) {
        const url = '/api/user/current'
        return axiosClient.get(url)
    },
    updateInfo(info)  {
        const url = '/api/user/update'
        return axiosClient.put(url,info)
    }
}
export default UserApi