import axiosClient from "./axiosClient"

const AuthApi = {
    register(credentials)  {
        const url = '/api/auth/register'
        return axiosClient.post(url,credentials)
    },
    login(credentials) {
        const url = '/api/auth/login'
        return axiosClient.post(url,credentials)
    },
    verifyEmail(data) {
        const url = '/api/auth/verify-user'
        return axiosClient.post(url,data)
    }
}
export default AuthApi