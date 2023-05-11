import $api from "../http";
import { AxiosResponse } from 'axios'
import { AuthResponse } from "../models/response/AuthResponse";
import { IAuthUser } from "../models/IAuthUser";

export interface ILoginProps{
    email: string,
    password: string,
}
export interface IRegisterProps{
    email: string,
    password: string,
    password_confirmation: string,
}

export default class UserService{
    static async fetchUsers(): Promise<AxiosResponse<IAuthUser[]>> {
        return $api.get<IAuthUser[]>('/users') //.then(response => response.data)
    }
    static async fetchUser(): Promise<AxiosResponse<IAuthUser>> {
        return $api.get<IAuthUser>('/user/') //.then(response => response.data)
    }
}