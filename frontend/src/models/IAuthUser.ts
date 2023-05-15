import { IUser } from "./IUser"

export interface IAuthUser {
    username: string,
    email: string,
    id: string,
    isAuthenticated: boolean,
}
export interface ILoginProps {
    email: string,
    password: string,
}
export interface IRegisterProps {
    username: '',
    email: string,
    password: string,
    password_confirmation: string,
}
export interface IForgotPasswordProps {
    email: string 
}
export interface IForgotPasswordConfirmProps {
    password: string,
    token?: string,
}
export interface IChangePasswordProps {
    old_password: string,
    new_password: string,
    new_password_confirmation: string,
}
export interface IUserData extends IUser {
    phone?: string
    address?: string
    scripts_count: number,
    created_at: string,
    updated_at: string,
    gender?: string,
    current_address?: string,
    permanent_address?: string,
}
export interface IUpdateProfileProps {
    username: string,
    email: string,
}