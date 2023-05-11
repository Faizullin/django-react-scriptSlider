import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { IAuthUser } from '../../../models/IAuthUser'
import AuthService from '../../../services/AuthService';
import { ILoginProps } from '../../../services/AuthService';
import { IRegisterProps } from '../../../services/AuthService';
import { AxiosError } from 'axios';
import AxiosResponse from 'axios';
import UserService from '../../../services/UserService';
import ScriptService from '../../../services/ScriptService';
import { IScript } from '../../../models/IScript';
import ScriptPageService from '../../../services/ScriptPageService';
import { IScriptPage } from '../../../models/IScriptPage';

interface IInitialState {
  loading: boolean,
  error: string | null ,
  success: boolean,
}

const initialState: IInitialState = {
  loading: false,
  error: null ,
  success: true,
}

export const fetchScriptPageList = createAsyncThunk(
  'script/fetchScriptPageList',
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

export const fetchScriptPageDetail = createAsyncThunk(
    'script/fetchScriptPageDetail',
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

export const fetchScriptPageSave = createAsyncThunk(
    'script/fetchScriptPageSave',
    async (props: IScriptPage, { rejectWithValue }) => {
      try {
        let response
        if (props.id == null || !props.id) {
          response = await ScriptPageService.saveNew(props);
        } else {
          response = await ScriptPageService.save(props);
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

const scriptPageSlice = createSlice({
  name: "scriptPage",
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(fetchScriptPageSave.fulfilled, (state, {payload}) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(fetchScriptPageSave.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptPageSave.rejected, (state, {payload, error}) => {
      state.loading = false
      state.error = error.message ?? ""
      state.success = false
    })
  },
});

export default scriptPageSlice.reducer;
export const {} = scriptPageSlice.actions