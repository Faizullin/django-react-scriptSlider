import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { AxiosError } from 'axios';
import ScriptService from '../../../services/ScriptService';
import { IScript } from '../../../models/IScript';
import { RootState } from '../store';
import { ISortProps, getSortField, setPageSize, setTotalItems, setTotalPages } from './scriptFilterSlice';

interface IInitialState {
  scripts: IScript[],
  script_payload: IScript | null,
  loading: boolean,
  error: string | null ,
  errors: any,
  success: boolean,
}

const initialState: IInitialState = {
  scripts: [],
  script_payload: null,
  loading: false,
  error: null ,
  errors: {},
  success: false,
}




export const fetchScriptList = createAsyncThunk(
  'script/fetchScriptList',
  async (props, { rejectWithValue, getState, dispatch }) => {
    const { scriptFilter } = getState() as RootState
    let params = { ...scriptFilter.filters } as any
    if(params.sort) {
      delete params['sort']
    }
    params.ordering = getSortField(scriptFilter.filters.sort)
    params = {
        ...params,
        page: scriptFilter.pagination.page + 1,
        limit: scriptFilter.pagination.pageSize,
    }
    try {
      const response = await ScriptService.getAll(params);
      dispatch(setTotalItems(response.data.count))
      // dispatch(setTotalPages(response.data.count))
      // const url = new URL(``);
      // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      // console.log(url)
      return response.data.results
    } catch (error: AxiosError | any) {
      if(error instanceof AxiosError && error.response){
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error)
    }
  }
);

export const fetchScriptDetail = createAsyncThunk(
    'script/fetchScriptDetail',
    async (props: {id:string}, { rejectWithValue }) => {
      try {
        const response = await ScriptService.getById(props.id);
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

export const fetchScriptCreate = createAsyncThunk(
    'script/fetchScriptCreate',
    async (props: IScript | File, { rejectWithValue }) => {
      try {
        let response
        if(props instanceof File) {
          response = await ScriptService.createWithFile(props)
        } else {
          response = await ScriptService.create(props);
        }
        return response.data
      } catch (error: AxiosError | any) {
        if(error instanceof AxiosError && error.response){
          return rejectWithValue(error.response.data);
        } else {
          console.log("global error",error);
        }
        return rejectWithValue(error)
      }
    }
);

export const fetchScriptEdit = createAsyncThunk(
  'script/fetchScriptEdit',
  async (props: { data: IScript, file?: File,}, { rejectWithValue }) => {
    try {
      let response
      if(props.file instanceof File) {
        response = await ScriptService.editWithFile(props.data.id,props.file)
      } else {
        response = await ScriptService.edit(props.data.id,props.data);
      }
      return response.data
    } catch (error: AxiosError | any) {
      if(error instanceof AxiosError && error.response){
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error)
    }
  }
);

export const fetchScriptDelete = createAsyncThunk(
  'script/fetchScriptDelete',
  async (props: string, { rejectWithValue }) => {
    try {
      const response = await ScriptService.delete(props)
      return response.data
    } catch (error: AxiosError | any) {
      if(error instanceof AxiosError && error.response){
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error)
    }
  }
);

const scriptSlice = createSlice({
  name: "script",
  initialState,
  reducers: {
    setScript(state, action) {
      state.script_payload = {...action.payload}
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchScriptList.fulfilled, (state, {payload}) => {
      state.loading = false
      state.scripts = payload
      state.errors = initialState.errors
      state.success = true
    })
    builder.addCase(fetchScriptList.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptList.rejected, (state, {payload, error}) => {
      state.loading = false
      state.scripts = []
      state.errors = payload
      state.success = false
    })
    builder.addCase(fetchScriptCreate.fulfilled, (state, {payload}) => {
      state.loading = false
      state.success = true
      state.errors = initialState.errors
    })
    builder.addCase(fetchScriptCreate.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptCreate.rejected, (state, {payload, error}) => {
      state.loading = false
      state.errors = payload
      state.success = false
    })
    builder.addCase(fetchScriptEdit.fulfilled, (state, {payload}) => {
      state.loading = false
      state.success = true
      state.errors = initialState.errors
    })
    builder.addCase(fetchScriptEdit.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptEdit.rejected, (state, {payload, error}) => {
      state.loading = false
      state.errors = payload
      state.success = false
    })
    builder.addCase(fetchScriptDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.success = true
      state.script_payload = payload
      state.errors = initialState.errors
    })
    builder.addCase(fetchScriptDetail.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptDetail.rejected, (state, {payload, error}) => {
      state.loading = false
      state.errors = payload
      state.success = false
    })
  },
});

export default scriptSlice.reducer;

export const { setScript } = scriptSlice.actions;