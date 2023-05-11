import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { AxiosError } from 'axios';
import AxiosResponse from 'axios';
import ScriptService from '../../../services/ScriptService';
import { IScript } from '../../../models/IScript';

interface IInitialState {
  scripts: IScript[],
  loading: boolean,
  error: string | null ,
  errors: any | null,
  success: boolean,
}

const initialState: IInitialState = {
  scripts: [],
  loading: false,
  error: null ,
  errors: {

  },
  success: false,
}

export const fetchScriptList = createAsyncThunk(
  'script/fetchScriptList',
  async (props, { rejectWithValue }) => {
    try {
      const response = await ScriptService.getAll();
      console.log("Response",response)
      return response.data
    } catch (error: AxiosError | any) {
      if(error instanceof AxiosError && error.response instanceof AxiosResponse ){
        console.log(error.response.data);
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
        if(error instanceof AxiosError && error.response instanceof AxiosResponse ){
          console.log(error.response.data);
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
        if(error instanceof AxiosError && error.response !== undefined ){
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
      if(error instanceof AxiosError && error.response instanceof AxiosResponse ){
        console.log(error.response.data);
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
      if(error instanceof AxiosError && error.response instanceof AxiosResponse ){
        console.log('Error',error.response.data);
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
  },
  extraReducers(builder) {
    builder.addCase(fetchScriptList.fulfilled, (state, {payload}) => {
      state.loading = false
      state.scripts = payload
      state.success = true
    })
    builder.addCase(fetchScriptList.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptList.rejected, (state, {payload, error}) => {
      state.loading = false
      state.scripts = []
      state.error = error.message ?? ""
      state.success = false
    })
    builder.addCase(fetchScriptCreate.fulfilled, (state, {payload}) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(fetchScriptCreate.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptCreate.rejected, (state, {payload, error}) => {
      state.loading = false
      state.scripts = []
      state.error = error.message ?? ""
      state.errors = payload
      console.log(error,payload)
      state.success = false
    })
  },
});

export default scriptSlice.reducer;