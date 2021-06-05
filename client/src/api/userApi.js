import axiosClient from "./axiosClient"

const UserApi = {
    getInfo(token) {
        const url = '/api/user/current'
        return axiosClient.get(url,{
            headers : {Authorization : token}
        })
    }
}
export default UserApi