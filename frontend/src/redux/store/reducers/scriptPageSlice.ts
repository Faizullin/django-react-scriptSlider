import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { AxiosError } from 'axios';
import ScriptService from '../../../services/ScriptService';

interface IInitialState {
  loading: boolean,
  errors: any,
  success: boolean,
}

const initialState: IInitialState = {
  loading: false,
  errors: {},
  success: true,
}

export const fetchScriptPageList = createAsyncThunk(
  'script/fetchScriptPageList',
  async (props, { rejectWithValue }) => {
    try {
      const response = await ScriptService.getAll();
      return response.data
    } catch (error: AxiosError | any) {
      if(error instanceof AxiosError && error.response){
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
        if(error instanceof AxiosError && error.response){
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
    builder.addCase(fetchScriptPageDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(fetchScriptPageDetail.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptPageDetail.rejected, (state, {payload, error}) => {
      state.loading = false
      state.errors = payload
      state.success = false
    })
  },
});

export default scriptPageSlice.reducer;