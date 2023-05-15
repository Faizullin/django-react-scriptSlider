import $api from "../http";
import { AxiosResponse } from 'axios'
import { IScript } from "../models/IScript";
import { IPresentationUrlData } from "../models/response/IPresentaionData";
import { IScriptResponse } from "../models/response/IScriptResponse";

export default class ScriptService{
    static async getAll(filters?: any): Promise<AxiosResponse<IScriptResponse>> {
        return $api.get<IScriptResponse>('/script/',{
            params: {
                ...filters
            }
        })
    }
    static async getById(id: string): Promise<AxiosResponse<IScript>> {
        return $api.get<IScript>(`/script/${id}/`)
    }
    static async getByIdWithPages(id: string): Promise<AxiosResponse<IScript>> {
        return $api.get<IScript>(`/script/${id}/?pages=1`)
    }
    static async create(data: IScript): Promise<AxiosResponse<IScript>> {
        return $api.post<IScript>(`/script/create/`,data)
    }
    static async createWithFile(data: File): Promise<AxiosResponse<IScript>> {
        const formData = new FormData()
        formData.append('form_type','file')
        formData.append('file',data)
        return $api.post<IScript>(`/script/create/`,formData)
    }
    static async edit(id: string ,data: IScript): Promise<AxiosResponse<IScript>> {
        return $api.patch<IScript>(`/script/${id}/edit`,data)
    }
    static async editWithFile(id: string ,data: File): Promise<AxiosResponse<IScript>> {
        const formData = new FormData()
        formData.append('form_type','file')
        formData.append('file',data)
        return $api.patch<IScript>(`/script/${id}/edit`,formData)
    }
    static async delete(id: string): Promise<AxiosResponse<any>>  {
        return $api.delete<any>(`/script/${id}/delete/`,)
    }
    static async get_track_url(id:string): Promise<AxiosResponse<IPresentationUrlData>>  {
        return $api.get<IPresentationUrlData>(`/script/${id}/track_url/`,)
    }
}