import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import scriptSlice from "./reducers/scriptSlice";
import scriptPageSlice from "./reducers/scriptPageSlice";
import userSlice from "./reducers/userSlice";
import scriptPresentationSlice from "./reducers/scriptPresentationSlice";
import scriptFilterSlice from "./reducers/scriptFilterSlice";
import scriptModalSlice from "./reducers/scriptModalSlice";
import scriptFormSlice from './reducers/scriptFormSlice';

export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
    auth: authSlice,
    user: userSlice,
    script: scriptSlice,
    scriptPage: scriptPageSlice,
    scriptPresentation: scriptPresentationSlice,
    scriptFilter: scriptFilterSlice,
    scriptModal: scriptModalSlice,
    scriptForm: scriptFormSlice,
})
  
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
export type RootState = ReturnType<typeof rootReducer>
