import { IScriptPage } from "./IScriptPage";
import { IUser } from "./IUser";

export interface IScript{
    id: string,
    title: string,
    owner?: IUser,
    pages?: IScriptPage[],
    created_at: string,
    updated_at: string,
    pages_count: number,
}