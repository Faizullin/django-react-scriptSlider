import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { AxiosError } from 'axios';
import ScriptService from '../../../services/ScriptService';
import { IScript } from '../../../models/IScript';
import { RootState } from '../store';
import { IPresentationUrlData } from '../../../models/response/IPresentaionData';

interface IInitialState {
  script_payload: IScript | null,
  loading: boolean,
  errors: any,
  success: boolean,
  currentPageIndex: number,
  urlData: IPresentationUrlData,
}

const initialState: IInitialState = {
  script_payload: null,
  loading: false,
  errors: {},
  success: false,
  currentPageIndex: 0,
  urlData: {
    ws_url: '',
    next_page_url: '',
    command: '',
  },
}

export const fetchScriptPresentationConnect = createAsyncThunk(
  'script/fetchScriptPresentationConnect',
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
        let response
        response = await ScriptService.getById(id);
        dispatch(setScript(response.data))
        const { scriptPresentation } = getState() as RootState
        if(!scriptPresentation.script_payload) {
            throw "No script payload"
        }
        if(scriptPresentation.script_payload.pages_count > 0) {
            dispatch(setCurrentPageIndex(0))
        }
        response = await ScriptService.get_track_url(scriptPresentation.script_payload.id)            
        return response.data
    } catch (error: AxiosError | any) {
        if(error instanceof AxiosError && error.response){
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error)
    }
  }
);

const scriptPresentationSlice = createSlice({
  name: "scriptPresentation",
  initialState,
  reducers: {
    setScript(state, action) {
        state.script_payload = action.payload
    },
    clearScript(state) {
        state.script_payload = initialState.script_payload
    },
    setCurrentPageIndex(state, action) {
        state.currentPageIndex = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchScriptPresentationConnect.fulfilled, (state, {payload}) => {
      state.loading = false
      state.errors = initialState.errors
      if(payload){
        state.urlData = payload
      }
      state.success = true
    })
    builder.addCase(fetchScriptPresentationConnect.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(fetchScriptPresentationConnect.rejected, (state, {payload, error}) => {
      state.loading = false
      state.errors = payload
      state.success = false
    })
  },
});

export default scriptPresentationSlice.reducer;

export const { setScript, clearScript, setCurrentPageIndex } = scriptPresentationSlice.actions;