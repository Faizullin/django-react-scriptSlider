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
    static async getById(id: string): Promise<AxiosResponse<IScriptPage>> {
        return $api.get<IScriptPage>(`/script_page/${id}/`,)
    }
}