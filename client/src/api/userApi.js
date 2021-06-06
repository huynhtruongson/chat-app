import axiosClient from "./axiosClient"

const UserApi = {
    getInfo(token) {
        const url = '/api/user/current'
        return axiosClient.get(url,{
            headers : {Authorization : `Bearer ${token}`}
        })
    }
}
export default UserApi