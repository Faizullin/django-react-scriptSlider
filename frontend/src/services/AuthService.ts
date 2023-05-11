import $api from "../http";
import { AxiosResponse } from 'axios'
import { AuthResponse } from "../models/response/AuthResponse";

export interface ILoginProps{
    email: string,
    password: string,
}
export interface IRegisterProps{
    username: '',
    email: string,
    password: string,
    password_confirmation: string,
}

export default class AuthService{
    static async login(data:ILoginProps): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/token/',{...data}) //.then(response => response.data)
    }
    static async register(data:IRegisterProps): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/register/',{...data}) //.then(response => response.data)
    }
    static async logout(): Promise<void> {
        return $api.post('/logout/') //.then(response => response.data)
    }
}