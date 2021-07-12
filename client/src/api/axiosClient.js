import axios from 'axios';
import _alert  from '../utils/alert'
// import queryString from "query-string";

const axiosClient = axios.create({
    // baseURL: process.env.REACT_APP_API_URL,
    headers: {'content-type': 'application/json'},
    //   paramsSerializer: (params) => queryString.stringify(params),
});

// Handle access token
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token)
        config.headers.Authorization = `Bearer ${token}`
    return config
},(error) => Promise.reject(error));

const handleError = (error) => {
    if(error)
        _alert({icon : 'error',title : 'Error',msg : error.message})
    else
        _alert({icon : 'error',title : 'Error',msg : 'No response!'})
}

// Handle response api
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) return {...response.data, status: response.status};
        return response;
    },
    (error) => {
        const statusCode = error.response?.status
        switch (statusCode) {
            case 400:
                handleError(error.response?.data)
                break;
            case 401:
                // Logout user
                window.location.replace('/login')
                localStorage.removeItem("token")
                // _alert({
                //     icon : 'warning',
                //     title : 'Session expired!',
                //     msg: 'Your session has expired.Please login again.',
                //     callback : ({isConfirmed}) => {
                //         if(isConfirmed) {
                //             window.location.replace('/login')
                //             localStorage.removeItem("token")
                //         }
                //     }
                // })
                break;
            case 403:
                _alert({icon : 'error',title : 'Error',message: '403 Forbidden' })
                break
            case 404:
                _alert({icon : 'error',title : 'Error',message: '404 Not Found' })
                break
            case 500:
                _alert({icon : 'error',title : 'Error',message: '404 Not Found' })
                break
            default:
                _alert({icon : 'error',title : 'Error',msg : '500 Internal Server Error'})
        }
       return Promise.reject(error.response?.data)
    }
);

export default axiosClient;
