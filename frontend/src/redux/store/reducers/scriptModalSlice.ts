
import { createSlice } from '@reduxjs/toolkit';

export type IModalStatusProps = 'confirm' | 'decline' | 'clear' | 'submit' | ''

interface IInitialState {
    status: IModalStatusProps
    isOpened: boolean
    isDeclined: boolean
    isConfirmed: boolean
    isSubmit: boolean
}


const initialState: IInitialState = {
    status: '',
    isOpened: false,
    isDeclined: false,
    isConfirmed: false,
    isSubmit: false
}

const scriptModalSlice = createSlice({
  name: 'scriptModal',
  initialState: initialState,
  reducers: {
    setOpen(state, action) {
      state.isOpened = action.payload;
    },
    setConfirm(state, action) {
      state.isConfirmed = true;
      state.isOpened = false;
    },
    setDecline(state, action) {
      state.isDeclined = true;
      state.isOpened = false;
    },
    setSubmit(state, action) {
        state.isSubmit = action.payload
    },
    setStatus(state, action) {
      state.status = action.payload
  },
  }
})
 
export const { setOpen, setConfirm, setDecline, setSubmit, setStatus, } = scriptModalSlice.actions;
 
export default scriptModalSlice.reducer;