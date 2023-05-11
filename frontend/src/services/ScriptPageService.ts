import $api from "../http";
import { AxiosResponse } from 'axios'
import { IScriptPage } from "../models/IScriptPage";
import { IScript } from "../models/IScript";

export default class ScriptPageService{
    static async getAllByScript(script: IScript): Promise<AxiosResponse<IScriptPage[]>> {
        return $api.get<IScriptPage[]>(`/script_page?script=${script.id}`)
    }
    static async getByScriptAndIndex(script: IScript, index: string): Promise<AxiosResponse<IScriptPage[]>> {
        return $api.get<IScriptPage[]>(`/script_page/`,{
            params: {
                script: script.id,
                index: index,
            }
        })
    }
    static async create(data: IScriptPage): Promise<AxiosResponse<IScriptPage>> {
        return $api.post<IScriptPage>(`/script_page/create/?script=`,data)
    }
    static async save(data: IScriptPage): Promise<AxiosResponse<IScriptPage>> {
        return $api.post<IScriptPage>(`/script_page/save/${data.id}`,data)
    }
    static async saveNew(data: IScriptPage): Promise<AxiosResponse<IScriptPage>> {
        return $api.post<IScriptPage>(`/script_page/save/`,data)
    }
    static async edit(data: IScriptPage): Promise<AxiosResponse<IScriptPage>> {
        return $api.post<IScriptPage>(`/script_pages/create?script=`,data)
    }

}