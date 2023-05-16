import axios, { InternalAxiosRequestConfig, AxiosResponse  } from "axios";
import { AuthResponse } from "../models/response/IAuthResponse";

export const API_URL = process.env.REACT_APP_BASE_URL + '/api'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}` 
    }
    return config
})
$api.interceptors.response.use((config: AxiosResponse) => {
    return config
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401){
        try{
            const refresh = localStorage.getItem('refreshToken') || ''
            if(refresh.length !== 0){
                const response = await axios.post<AuthResponse>(`${API_URL}/token/refresh/`,{
                    refresh
                })
                localStorage.setItem('token',response.data.access)
                return $api.request(originalRequest);
            }
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        } catch(e) {
            console.log("Not authed")
        }
    }
    return Promise.reject(error)
})

export default $api;