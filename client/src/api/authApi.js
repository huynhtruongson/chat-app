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
    googleLogin(token) {
        const url = '/api/auth/login/google'
        return axiosClient.post(url,token)
    },
    verifyEmail(data) {
        const url = '/api/auth/verify-user'
        return axiosClient.post(url,data)
    },
    forgotPwd(email) {
        const url = '/api/auth/forgot-passsword'
        return axiosClient.post(url,email)
    },
    resetPwd(data) {
        const url = '/api/auth/reset-password'
        return axiosClient.post(url,data)
    },
    setHeaderAxios(token) {
        axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + token
    }
}
export default AuthApi