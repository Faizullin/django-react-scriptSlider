// import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";
// import rootReducer, { RootState } from "./root.reducer";
// import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import logger from "redux-logger";
// import thunk from "redux-thunk";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import styleSlice from "./reducers/styleSlice";
import scriptSlice from "./reducers/scriptSlice";
import scriptPageSlice from "./reducers/scriptPageSlice";

// const persistConfig = {
//   key: "root",
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// const middleware =
//   process.env.NODE_ENV == "production" ? [thunk] : [thunk, logger];

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: middleware,
//   devTools: process.env.NODE_ENV !== "production",
// });

export type AppDispatch = typeof store.dispatch;
// export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

// export const UseAppDispatch = () => useDispatch<AppDispatch | any>();
const rootReducer = combineReducers({
    auth: authSlice,
    script: scriptSlice,
    scriptPage: scriptPageSlice,
    //auth: authSlice,
    // style: styleSlice.reducer,
})
  
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
export type RootState = ReturnType<typeof rootReducer>
