import { IScript } from "../IScript"

export interface IScriptResponse {
    results: IScript[]
    count: number
    previous?: any
    next?: any
}