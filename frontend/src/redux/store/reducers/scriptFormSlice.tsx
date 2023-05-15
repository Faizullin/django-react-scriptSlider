import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { AxiosError } from 'axios';
import ScriptService from '../../../services/ScriptService';
import { IScript } from '../../../models/IScript';
import { RootState } from '../store';
import { IPresentationUrlData } from '../../../models/response/IPresentaionData';

export interface IScriptPageCreateFormProps {
    index : number | null
    title: string
    content: string,
    id: number | null,
}

interface IInitialState {
    script_payload: IScript | null,
    loading: boolean,
    errors: any,
    success: boolean,
    currentPageIndex: number,
    currentScriptPageFormData: IScriptPageCreateFormProps,
    scriptPagesData: Array<IScriptPageCreateFormProps>,
    saveOnScriptPageChange: boolean
    updated: boolean
}

const initialState: IInitialState = {
    script_payload: null,
    loading: false,
    errors: {},
    success: false,
    currentPageIndex: 0,
    currentScriptPageFormData: {
        id: null,
        index: 0,
        title: '',
        content: '',
    },
    scriptPagesData: [],
    saveOnScriptPageChange: false,
    updated: false,
}

export const fetchScriptDetailWithPages = createAsyncThunk(
    'script/fetchScriptDetailWithPages',
    async (props: {id:string}, { rejectWithValue }) => {
        try {
            const response = await ScriptService.getByIdWithPages(props.id);
            return {
                ...response.data
            };
        } catch (error: AxiosError | any) {
            if(error instanceof AxiosError && error.response){
            return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error)
        }
    }
  );
  

const scriptFormSlice = createSlice({
    name: "scriptForm",
    initialState,
    reducers: {
        addScriptPage(state,) {
            const pages_length = state.scriptPagesData.length
            const newScriptPageFormData = {
                index: pages_length + 1,
                title: '',
                content: '',
                id: pages_length,
            }
            if (pages_length === 0) {
                let tmpScriptPagesData = [...state.scriptPagesData, newScriptPageFormData]
                state.scriptPagesData = tmpScriptPagesData
                state.currentScriptPageFormData = newScriptPageFormData
                state.currentPageIndex = 1
            } else {
                state.currentScriptPageFormData =  newScriptPageFormData
                let tmpScriptPagesData = [...state.scriptPagesData, newScriptPageFormData]
                state.scriptPagesData = tmpScriptPagesData
                state.currentPageIndex = newScriptPageFormData.index
            }
            state.updated = true
            state.success = true
        },
        removeScriptPage(state, action) {
            const page_index = action.payload
            let tmpScriptPagesData = [...state.scriptPagesData]
            tmpScriptPagesData = tmpScriptPagesData.filter(element => element.index !== page_index)
            for (let i = 0; i < tmpScriptPagesData.length; i++) {
                tmpScriptPagesData[i] = { ...tmpScriptPagesData[i], index: i + 1, id: i }
            }
            if (tmpScriptPagesData.length === 0) {
                state.currentPageIndex = 0
                state.updated = true
                state.currentScriptPageFormData = initialState.currentScriptPageFormData
            } else if (tmpScriptPagesData.length === 0) {
                state.currentPageIndex = 1
                state.updated = true
                state.currentScriptPageFormData = state.scriptPagesData[0]
            } else if (state.currentPageIndex > 1 && state.currentPageIndex <= tmpScriptPagesData.length) {
                state.currentPageIndex = 1;
                state.currentScriptPageFormData = state.scriptPagesData[state.currentPageIndex - 1]
                state.updated = true
            }
            state.scriptPagesData = tmpScriptPagesData
        },
        setCurrentPageIndex(state, action) {
            const newCurrentScriptPage = action.payload
            if(newCurrentScriptPage > 0 && newCurrentScriptPage <= state.scriptPagesData.length) {
                state.currentPageIndex = newCurrentScriptPage
                const needeScriptData = state.scriptPagesData.filter(element => element.index === newCurrentScriptPage)
                if(needeScriptData.length === 0) {
                    state.currentScriptPageFormData = initialState.currentScriptPageFormData
                    throw "scriptData is unreachable"
                } else {
                    state.currentScriptPageFormData = {...needeScriptData[0]}
                    state.updated = true
                }
            }
        },
        setCurrentScriptPageFormData(state, action) {
            const newData = {
                ...state.currentScriptPageFormData,
                ...action.payload,
            }
            state.currentScriptPageFormData = newData
            let tmpScriptPagesData = [...state.scriptPagesData]
            for(let i = 0; i < tmpScriptPagesData.length; i++) {
                if(tmpScriptPagesData[i].index === state.currentPageIndex) {
                    tmpScriptPagesData[i] = newData
                    break;
                }
            }
            state.scriptPagesData = tmpScriptPagesData;
        },
        clearData(state) {
            state.script_payload = initialState.script_payload
            state.currentPageIndex = initialState.currentPageIndex
            state.scriptPagesData = initialState.scriptPagesData
            state.updated = initialState.updated
        },
        setUpdated(state,action) {
            state.updated = action.payload
        }
  },
    extraReducers(builder) {
        builder.addCase(fetchScriptDetailWithPages.fulfilled, (state, {payload}) => {
            let tmpPayload = {...payload}
            state.scriptPagesData = tmpPayload.pages?.map(element => ({
                id: Number(element.id),
                title: element.title,
                content: element.content,
                index: Number(element.index),
            }))  || []
            state.currentPageIndex = (tmpPayload.pages) ? (tmpPayload.pages.length > 0 ? 1 : 0) : 0
            if(state.currentPageIndex > 0) {
                state.currentScriptPageFormData = state.scriptPagesData[state.currentPageIndex - 1]
            }
            delete tmpPayload['pages']
            state.script_payload = tmpPayload
            state.loading = false
            state.success = true
            state.errors = initialState.errors
        })
        builder.addCase(fetchScriptDetailWithPages.pending, (state, {payload}) => {
            state.loading = true
            state.success = false
        })
        builder.addCase(fetchScriptDetailWithPages.rejected, (state, {payload, error}) => {
            state.loading = false
            state.errors = payload
            state.success = false
        })
    },
});

export default scriptFormSlice.reducer;

export const { addScriptPage, setCurrentPageIndex, setCurrentScriptPageFormData, removeScriptPage, clearData, setUpdated } = scriptFormSlice.actions;