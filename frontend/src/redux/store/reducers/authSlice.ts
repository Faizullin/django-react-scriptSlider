import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
import { IAuthUser } from '../../../models/IAuthUser'
import AuthService from '../../../services/AuthService';
import { ILoginProps } from '../../../services/AuthService';
import { IRegisterProps } from '../../../services/AuthService';
import { AxiosError } from 'axios';
import AxiosResponse from 'axios';
import UserService from '../../../services/UserService';

interface IInitialState {
  token: string | null,
  user: IAuthUser,
  loading: boolean,
  error: string | null ,
  success: boolean,
}

const initToken = localStorage.getItem('token') ?? ''
const initialState: IInitialState = {
  token: initToken,
  user: {
    id: '',
    name: '',
    email: '',
    isAuthenticated: initToken.length !== 0,
  },
  loading: false,
  error: null ,
  success: false,
}

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (props, { rejectWithValue }) => {
    try {
      const response = await UserService.fetchUser();
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

export const registerUser = createAsyncThunk("auth/registerUser",
  async (values: IRegisterProps, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(values)

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      return {
        ...response.data,
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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: ILoginProps, { rejectWithValue }) => {
    try {
      const response = await AuthService.login({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      return {
        ...response.data,
      }
    } catch (error) {
      if(error instanceof AxiosError && error.response instanceof AxiosResponse ){
        console.log(error.response.data);
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error)
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem("refreshToken");
      state.user.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    setCredentials: (state, { payload }) => {
      state.user = payload
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.fulfilled, (state, {payload}) => {
      state.loading = false
      state.user = { 
        ...payload.user,
        isAuthenticated: true,
      } as IAuthUser
      state.success = true
    })
    builder.addCase(loginUser.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(loginUser.rejected, (state, {payload, error}) => {
      state.loading = false
      state.user = { 
        isAuthenticated: false,
      } as IAuthUser
      state.error = error.message ?? ""
      state.success = false
    })

    builder.addCase(registerUser.fulfilled, (state, {payload}) => {
      state.loading = false
      state.user = { 
        ...payload.user,
        isAuthenticated: true,
      } as IAuthUser
      state.success = true
    })
    builder.addCase(registerUser.pending, (state, {payload}) => {
      state.loading = true
      state.success = false
    })
    builder.addCase(registerUser.rejected, (state, {payload, error}) => {
      state.loading = false
      state.user = { 
        isAuthenticated: false,
      } as IAuthUser
      state.error = error.message ?? ""
      state.success = false
    })
    builder.addCase(fetchUserData.pending, (state, action) => {
      state.loading = true;
      state.success = false
    })
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true
      state.user = {
        ...action.payload,
        isAuthenticated: true,
      }
    })
  },
});

export default authSlice.reducer;
export const {logout,setCredentials} = authSlice.actions